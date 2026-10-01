# SrtToTXT - 字幕时间轴信息移除工具

将字幕文件（SRT/ASS）中的时间轴、序号等元数据移除，提取纯文本内容。

## 功能特性

- **网页版工具** (`index.html`) - 可视化界面，支持单文件处理、上传、下载
- **批量脚本** (`batch_convert.bat` + `convert.ps1`) - 命令行批量转换同目录下所有字幕文件
- 支持 `.srt` 和 `.ass` 两种主流字幕格式
- 自动识别字幕格式并采用对应解析策略
- 输出编码统一为 UTF-8 (无 BOM)

## 使用方式

### 网页版 (推荐)

1. 双击打开 `index.html`（无需服务器，直接浏览器打开）
2. **上传文件**：点击或拖拽字幕文件到上传区域
3. **粘贴内容**：也可直接在文本框中粘贴字幕内容
4. 点击「移除时间轴信息」按钮进行处理
5. 处理完成后可：
   - 复制到剪贴板
   - 下载为 TXT 文件

### 批量命令行版

```bash
# 双击运行或在命令行执行
batch_convert.bat
```

脚本会自动：
1. 扫描当前目录下所有 `.srt` / `.ass` 文件
2. 调用 PowerShell 脚本逐一提取纯文本内容
3. 输出到 `output/` 子目录（自动创建）

输出文件命名规则：`原文件名.txt`

```
示例:
  movie.srt        → output/movie.txt
  episode01.ass    → output/episode01.txt
```

## 支持的格式

### SRT 格式处理逻辑

移除以下内容，保留字幕文本：
- 序号行（纯数字）
- 时间轴行 (`00:00:01,000 --> 00:00:04,000`)
- 空行

**输入示例 (SRT):**
```
1
00:00:01,500 --> 00:00:04,000
Hello World

2
00:00:05,000 --> 00:00:08,000
你好世界
```

**输出结果:**
```
Hello World
你好世界
```

### ASS 格式处理逻辑

- 定位 `[Events]` 段落
- 提取 `Dialogue:` 和 `Comment:` 行中的文本内容（第10个字段之后）
- 移除样式标签 `{\\...}`

**输入示例 (ASS):**
```
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.50,0:00:04.00,,Default,,0,0,0,,Hello World
Dialogue: 0,0:00:05.00,0:00:08.00,,Default,,0,0,0,,{\i1}你好世界{\i0}
```

**输出结果:**
```
Hello World
你好世界
```

## 项目结构

```
SrtToTXT/
├── index.html          # 网页版工具（含上传、下载功能）
├── batch_convert.bat   # 批量转换入口（扫描文件、调用 PS1、显示统计）
├── convert.ps1         # 核心转换逻辑（SRT/ASS 解析与提取）
├── README.md           # 项目说明文档
└── output/             # 批量转换输出目录（运行后自动创建）
```

## 技术实现

| 组件 | 技术 | 说明 |
|------|------|------|
| 网页前端 | HTML + CSS + JavaScript (原生) | 单页应用，无依赖 |
| 文件读取 | FileReader API | 支持拖拽和点击上传 |
| 文件下载 | Blob + URL.createObjectURL | 客户端生成并下载 TXT |
| 批量入口 | Windows Batch (.bat) | 遍历目录、调用转换脚本 |
| 核心引擎 | PowerShell (.ps1) | SRT/ASS 格式解析与文本提取 |

### 批量脚本架构

```
batch_convert.bat (入口)
    │
    ├── 扫描 *.srt / *.ass 文件
    │
    └── 循环调用 convert.ps1
            │
            ├── 接收参数: InputFile, OutputFile
            ├── 自动检测格式 (SRT / ASS)
            └── 写入纯文本到 OutputFile
```

## 注意事项

- 网页版需现代浏览器支持（Chrome / Firefox / Edge 等）
- 批量脚本仅限 Windows 系统（依赖 Batch + PowerShell）
- 运行批量脚本前请确保 `convert.ps1` 与 `batch_convert.bat` 在同一目录
- 输出文件编码统一为 UTF-8 无 BOM
