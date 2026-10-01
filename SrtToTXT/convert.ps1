param(
    [string]$InputFile,
    [string]$OutputFile
)

$ErrorActionPreference = "Stop"

$lines = [System.IO.File]::ReadAllLines($InputFile, [System.Text.Encoding]::UTF8)
$result = [System.Collections.Generic.List[string]]::new()

$isAssFormat = $lines | Where-Object { $_.Trim().StartsWith("Dialogue:") }

if ($isAssFormat) {
    $inEvents = $false
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -eq "[Events]") {
            $inEvents = $true
            continue
        }
        if ($inEvents -and $trimmed.StartsWith("Dialogue:")) {
            $parts = $trimmed.Split(",")
            if ($parts.Length -ge 10) {
                $text = $parts[9..($parts.Length - 1)] -join ","
                $text = $text -replace '\{\\[^\}]*\}', ''
                if ($text.Trim() -ne "") {
                    $result.Add($text.Trim())
                }
            }
        } elseif ($inEvents -and $trimmed.StartsWith("Comment:")) {
            $cParts = $trimmed.Split(",")
            if ($cParts.Length -ge 10) {
                $cText = $cParts[9..($cParts.Length - 1)] -join ","
                $cText = $cText -replace '\{\\[^\}]*\}', ''
                if ($cText.Trim() -ne "") {
                    $result.Add($cText.Trim())
                }
            }
        }
    }
} else {
    $timeRegex = '^\s*\d{1,2}:\d{1,2}:\d{1,2},\d{1,3}\s*-->\s*\d{1,2}:\d{1,2}:\d{1,2},\d{1,3}\s*$'
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -eq "" -or $trimmed -match '^\s*\d+\s*$' -or $trimmed -match $timeRegex) {
            continue
        }
        $result.Add($line)
    }
}

$dir = Split-Path $OutputFile -Parent
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

[System.IO.File]::WriteAllLines($OutputFile, $result.ToArray(), (New-Object System.Text.UTF8Encoding $false))

$srcName = [System.IO.Path]::GetFileName($InputFile)
$outName = [System.IO.Path]::GetFileName($OutputFile)
Write-Host "  [$([System.IO.Path]::GetExtension($InputFile).ToUpper().TrimStart('.'))] $srcName -> $outName"
