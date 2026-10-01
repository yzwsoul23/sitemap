@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

title 字幕批量转TXT工具

echo ============================================
echo       字幕批量转换工具 (SRT/ASS ^> TXT)
echo ============================================
echo.

set "outputDir=%~dp0output"
if not exist "%outputDir%" mkdir "%outputDir%"

set "ps1Script=%~dp0convert.ps1"

set countSRT=0
set countASS=0
set countTotal=0

for %%f in ("*.srt") do (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%ps1Script%" "%%f" "%outputDir%\%%~nf.txt"
    if !errorlevel! equ 0 (
        set /a countSRT+=1
        set /a countTotal+=1
    )
)

for %%f in ("*.ass") do (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%ps1Script%" "%%f" "%outputDir%\%%~nf.txt"
    if !errorlevel! equ 0 (
        set /a countASS+=1
        set /a countTotal+=1
    )
)

echo.
echo ============================================
echo   转换完成 共处理 %countTotal% 个文件
echo   SRT文件: %countSRT% 个
echo   ASS文件: %countASS% 个
echo   输出目录: %outputDir%
echo ============================================
echo.
pause
