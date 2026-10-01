// LRC歌词编辑器 - 主要功能实现
class LrcEditor {
    constructor() {
        // DOM元素引用
        this.audioUpload = document.getElementById('audioUpload');
        this.fileName = document.getElementById('fileName');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playPauseIcon = document.getElementById('playPauseIcon');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        this.addTimestampBtn = document.getElementById('addTimestampBtn');
        this.pasteLyricsBtn = document.getElementById('pasteLyricsBtn');
        this.playLyricsBtn = document.getElementById('playLyricsBtn');
        this.addRowBtn = document.getElementById('addRowBtn');
        this.importLrcBtn = document.getElementById('importLrcBtn');
        this.exportLrcBtn = document.getElementById('exportLrcBtn');
        this.toggleThemeBtn = document.getElementById('toggleThemeBtn');
        
        // 波形图相关元素
        this.waveformContainer = document.getElementById('waveform-container');
        this.waveformCanvas = document.getElementById('waveform-canvas');
        
        // 设置相关元素
        this.rewindTimeSelect = document.getElementById('rewindTime');
        
        // 悬浮播放按钮
        this.floatingPlayBtn = document.getElementById('floatingPlayBtn');
        this.floatingPlayIcon = document.getElementById('floatingPlayIcon');
        
        // 模态框相关元素
        this.pasteLyricsModal = document.getElementById('pasteLyricsModal');
        this.lyricsTextarea = document.getElementById('lyricsTextarea');
        this.songTitleInput = document.getElementById('songTitle');
        this.artistNameInput = document.getElementById('artistName');
        this.albumNameInput = document.getElementById('albumName');
        this.makerNameInput = document.getElementById('makerName');
        this.confirmPasteBtn = document.getElementById('confirmPasteBtn');
        this.cancelPasteBtn = document.getElementById('cancelPasteBtn');
        this.closeModalSpan = document.querySelector('.modal .close');
        
        // 帮助模态框相关元素
        this.helpBtn = document.getElementById('helpBtn');
        this.helpModal = document.getElementById('helpModal');
        this.closeHelpBtn = document.getElementById('closeHelpBtn');
        this.helpCloseSpan = document.querySelector('.help-close');
        
        // 音频和歌词数据
        this.audio = null;
        this.audioContext = null;
        this.analyser = null;
        this.audioBuffer = null;
        this.isPlaying = false;
        this.isPlayLyricsMode = false; // 播放歌词模式
        this.currentRowIndex = -1; // 当前选中的歌词行
        this.lyricsData = []; // 存储歌词数据 [{time: seconds, text: lyrics}]
        
        // 初始化事件监听器
        this.initEventListeners();
        
        // 检查本地存储的主题设置
        this.checkStoredTheme();
    }

    initEventListeners() {
        // 音频上传
        if (this.audioUpload) {
            this.audioUpload.addEventListener('change', (e) => this.handleAudioUpload(e));
        }
        
        // 播放/暂停按钮
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        // 悬浮播放按钮
        if (this.floatingPlayBtn) {
            this.floatingPlayBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        // 添加时间戳
        if (this.addTimestampBtn) {
            this.addTimestampBtn.addEventListener('click', () => this.addTimestampToCurrentRow());
        }
        
        // 粘贴歌词按钮
        if (this.pasteLyricsBtn) {
            this.pasteLyricsBtn.addEventListener('click', () => this.showPasteLyricsModal());
        }
        
        // 播放歌词按钮
        if (this.playLyricsBtn) {
            this.playLyricsBtn.addEventListener('click', () => this.togglePlayLyricsMode());
        }
        
        // 添加新行
        if (this.addRowBtn) {
            this.addRowBtn.addEventListener('click', () => this.addNewRow());
        }
        
        // 导入/导出LRC
        if (this.importLrcBtn) {
            this.importLrcBtn.addEventListener('click', () => this.importLrcFile());
        }
        if (this.exportLrcBtn) {
            this.exportLrcBtn.addEventListener('click', () => this.exportLrcFile());
        }
        
        // 切换主题
        if (this.toggleThemeBtn) {
            this.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        // 模态框事件
        if (this.confirmPasteBtn) {
            this.confirmPasteBtn.addEventListener('click', () => this.confirmPasteLyrics());
        }
        if (this.cancelPasteBtn) {
            this.cancelPasteBtn.addEventListener('click', () => this.hidePasteLyricsModal());
        }
        if (this.closeModalSpan) {
            this.closeModalSpan.addEventListener('click', () => this.hidePasteLyricsModal());
        }
        window.addEventListener('click', (e) => {
            if (this.pasteLyricsModal && e.target === this.pasteLyricsModal) {
                this.hidePasteLyricsModal();
            }
        });
        
        // 帮助按钮事件
        if (this.helpBtn) {
            this.helpBtn.addEventListener('click', () => this.showHelpModal());
        }
        if (this.closeHelpBtn) {
            this.closeHelpBtn.addEventListener('click', () => this.hideHelpModal());
        }
        if (this.helpCloseSpan) {
            this.helpCloseSpan.addEventListener('click', () => this.hideHelpModal());
        }
        window.addEventListener('click', (e) => {
            if (this.helpModal && e.target === this.helpModal) {
                this.hideHelpModal();
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // 处理音频上传
    async handleAudioUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.fileName.textContent = file.name;
        
        // 创建音频对象
        if (this.audio) {
            this.audio.pause();
        }
        
        this.audio = new Audio();
        this.audio.src = URL.createObjectURL(file);
        
        // 监听音频加载完成
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalTime.textContent = this.formatTime(this.audio.duration);
            this.addTimestampBtn.disabled = false;
            this.playPauseBtn.disabled = false;
            this.floatingPlayBtn.disabled = false;
            this.updatePlayLyricsButton();
            
            // 加载波形图
            this.loadWaveformData(file);
        });
        
        // 监听音频时间更新
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime.textContent = this.formatTime(this.audio.currentTime);
            
            // 重新绘制波形图以显示当前位置指示器
            this.drawWaveform();
            
            // 如果在播放歌词模式下，自动更新当前歌词行
            if (this.isPlayLyricsMode) {
                this.updateCurrentLyricLine();
            }
        });
        
        // 监听音频结束
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.playPauseIcon.textContent = '▶';
        });
    }

    // 加载波形图数据
    async loadWaveformData(file) {
        try {
            // 创建音频上下文
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // 读取文件为ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();
            
            // 解码音频数据
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // 绘制波形图
            this.drawWaveform();
            
            // 添加波形图点击事件
            this.setupWaveformClickHandler();
        } catch (error) {
            console.error('加载波形图失败:', error);
        }
    }

    // 绘制波形图
    drawWaveform() {
        const canvas = document.getElementById('waveform-canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!this.audioBuffer) return;
        
        const data = this.audioBuffer.getChannelData(0); // 获取第一个声道的数据
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        // 减少采样点以降低密度
        const step = Math.ceil(data.length / (width * 5)); // 进一步减少采样密度，增加zoom效果
        const amp = height / 2; // 振幅
        
        // 绘制波形
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        // 使用更柔和的颜色而不是纯黑色
        ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color') || '#4a6fa5';
        
        for (let i = 0; i < width; i++) {
            let min = 1.0;
            let max = -1.0;
            
            // 找到当前像素对应的所有样本中的最大值和最小值
            for (let j = 0; j < step; j++) {
                const dataIndex = Math.floor(i * step) + j;
                if (dataIndex < data.length) {
                    const datum = data[dataIndex];
                    if (datum < min) min = datum;
                    if (datum > max) max = datum;
                }
            }
            
            // 绘制从最小值到最大值的线条
            ctx.moveTo(i, (1 + min) * amp);
            ctx.lineTo(i, (1 + max) * amp);
        }
        
        ctx.stroke();
        
        // 绘制播放位置指示器
        if (this.audio && this.audio.duration > 0) {
            const progress = this.audio.currentTime / this.audio.duration;
            const positionX = progress * width;
            
            // 绘制红色播放头线
            ctx.beginPath();
            ctx.strokeStyle = '#ff4757'; // 红色指示器
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            ctx.moveTo(positionX, 0);
            ctx.lineTo(positionX, height);
            ctx.stroke();
            
            // 在顶部绘制一个小三角形指示器
            ctx.beginPath();
            ctx.fillStyle = '#ff4757';
            ctx.moveTo(positionX - 5, 0);
            ctx.lineTo(positionX + 5, 0);
            ctx.lineTo(positionX, 10);
            ctx.closePath();
            ctx.fill();
        }
    }

    // 设置波形图点击事件处理器
    setupWaveformClickHandler() {
        const canvas = document.getElementById('waveform-canvas');
        if (!canvas) return;
        
        canvas.addEventListener('click', (e) => {
            if (!this.audioBuffer || !this.audio) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = canvas.clientWidth;
            
            // 计算点击位置对应的时间
            const percent = x / width;
            const seekTime = percent * this.audio.duration;
            
            // 跳转到指定时间
            this.audio.currentTime = seekTime;
            this.currentTime.textContent = this.formatTime(seekTime);
        });
    }

    // 播放/暂停控制
    togglePlayPause() {
        if (!this.audio) return;
        
        if (this.isPlaying) {
            this.audio.pause();
            this.playPauseIcon.textContent = '▶';
            this.floatingPlayIcon.textContent = '▶';
        } else {
            this.audio.play().then(() => {
                this.playPauseIcon.textContent = '⏸';
                this.floatingPlayIcon.textContent = '⏸';
            }).catch(error => {
                console.error('播放失败:', error);
                alert('无法播放音频，请检查文件格式是否支持');
            });
        }
        
        this.isPlaying = !this.isPlaying;
    }

    // 格式化时间为 mm:ss
    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // 格式化时间为 [mm:ss.xx] 格式
    formatTimestamp(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        const ms = Math.floor((seconds * 100) % 100);
        return `[${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}]`;
    }

    // 给当前选中行添加时间戳
    addTimestampToCurrentRow() {
        if (!this.audio || this.currentRowIndex === -1) {
            alert('请先选择一行歌词');
            return;
        }
        
        const currentTime = this.audio.currentTime;
        const timestampCell = document.querySelector(`#row-${this.currentRowIndex} .timestamp-cell`);
        if (timestampCell) {
            timestampCell.textContent = this.formatTimestamp(currentTime);
            
            // 更新内部数据
            if (this.lyricsData[this.currentRowIndex]) {
                this.lyricsData[this.currentRowIndex].time = currentTime;
            }
            
            // 更新播放歌词按钮状态
            this.updatePlayLyricsButton();
        }
    }

    // 切换播放歌词模式
    togglePlayLyricsMode() {
        if (!this.audio) return;
        
        this.isPlayLyricsMode = !this.isPlayLyricsMode;
        
        if (this.isPlayLyricsMode) {
            // 进入播放歌词模式
            this.playLyricsBtn.textContent = '⏹️ 停止播放';
            this.playLyricsBtn.classList.remove('btn-success');
            this.playLyricsBtn.classList.add('btn-warning');
            
            // 如果音频未播放，则开始播放
            if (!this.isPlaying) {
                this.togglePlayPause();
            }
            
            // 立即更新当前歌词行
            this.updateCurrentLyricLine();
        } else {
            // 退出播放歌词模式
            this.playLyricsBtn.textContent = '🎵 播放歌词';
            this.playLyricsBtn.classList.remove('btn-warning');
            this.playLyricsBtn.classList.add('btn-success');
            
            // 移除所有高亮
            this.clearAllHighlights();
        }
    }

    // 更新当前歌词行（播放歌词模式下）
    updateCurrentLyricLine() {
        if (!this.audio || this.lyricsData.length === 0) return;
        
        const currentTime = this.audio.currentTime;
        let currentLyricIndex = -1;
        
        // 找到当前时间对应的歌词行
        for (let i = 0; i < this.lyricsData.length; i++) {
            if (this.lyricsData[i].time <= currentTime) {
                currentLyricIndex = i;
            } else {
                break;
            }
        }
        
        // 如果找到了对应的歌词行，且与当前选中行不同
        if (currentLyricIndex !== -1 && currentLyricIndex !== this.currentRowIndex) {
            this.highlightLyricLine(currentLyricIndex);
        }
    }

    // 高亮歌词行（播放歌词模式下）
    highlightLyricLine(index) {
        // 移除所有高亮
        this.clearAllHighlights();
        
        // 高亮当前行
        const row = document.getElementById(`row-${index}`);
        if (row) {
            row.classList.add('playing');
            this.currentRowIndex = index;
            
            // 滚动到当前行
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 清除所有高亮
    clearAllHighlights() {
        const allRows = document.querySelectorAll('.lyrics-table tr.playing');
        allRows.forEach(row => {
            row.classList.remove('playing');
        });
    }

    // 更新播放歌词按钮状态
    updatePlayLyricsButton() {
        if (!this.playLyricsBtn) return;
        
        // 检查是否有歌词和时间戳
        const hasLyrics = this.lyricsData.length > 0;
        const hasTimestamps = this.lyricsData.some(item => item.time > 0);
        
        // 只有在有歌词且有时间戳时才启用按钮
        this.playLyricsBtn.disabled = !(hasLyrics && hasTimestamps && this.audio);
    }

    // 显示粘贴歌词模态框
    showPasteLyricsModal() {
        this.lyricsTextarea.value = '';
        this.pasteLyricsModal.style.display = 'block';
        this.lyricsTextarea.focus();
    }

    // 隐藏粘贴歌词模态框
    hidePasteLyricsModal() {
        this.pasteLyricsModal.style.display = 'none';
    }

    // 显示帮助模态框
    showHelpModal() {
        this.helpModal.style.display = 'block';
    }

    // 隐藏帮助模态框
    hideHelpModal() {
        this.helpModal.style.display = 'none';
    }

    // 确认粘贴歌词
    confirmPasteLyrics() {
        const lyricsText = this.lyricsTextarea.value.trim();
        if (!lyricsText) {
            alert('请输入歌词内容');
            return;
        }
        
        // 清空现有歌词
        this.clearLyricsTable();
        
        // 解析歌词（按行分割），自动去除多余空行
        let lines = lyricsText.split('\n');
        
        // 过滤掉空行和只包含空白字符的行
        lines = lines.filter(line => line.trim() !== '');
        
        // 提取元数据（如果有的话）
        const metadataRegex = /^\[(ti|ar|al|by|offset):(.*)\]$/i;
        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(metadataRegex);
            if (match) {
                const key = match[1].toLowerCase();
                const value = match[2].trim();
                
                switch(key) {
                    case 'ti':
                        this.songTitleInput.value = value;
                        break;
                    case 'ar':
                        this.artistNameInput.value = value;
                        break;
                    case 'al':
                        this.albumNameInput.value = value;
                        break;
                    case 'by':
                        this.makerNameInput.value = value;
                        break;
                    case 'offset':
                        // 可以将偏移量存储在某个变量中，用于后续处理
                        break;
                }
                
                // 移除已处理的元数据行
                lines.splice(i, 1);
                i--; // 调整索引
            }
        }
        
        // 添加到歌词表
        lines.forEach((line, index) => {
            this.addRow(line.trim(), index);
        });
        
        this.hidePasteLyricsModal();
        
        // 更新播放歌词按钮状态
        this.updatePlayLyricsButton();
        
        // 自动选中第一行
        if (this.lyricsData.length > 0) {
            setTimeout(() => {
                this.selectRow(0);
            }, 100);
        }
    }

    // 清空歌词表格
    clearLyricsTable() {
        const tbody = document.getElementById('lyricsTableBody');
        tbody.innerHTML = '';
        this.lyricsData = [];
        this.currentRowIndex = -1;
    }

    // 添加新行
    addRow(text = '', index = null) {
        const tbody = document.getElementById('lyricsTableBody');
        
        // 如果是清空后添加第一行，移除空行提示
        if (tbody.querySelector('.empty-row')) {
            tbody.innerHTML = '';
        }
        
        const rowIndex = index !== null ? index : this.lyricsData.length;
        const rowId = `row-${rowIndex}`;
        
        // 创建新的歌词数据项
        const lyricItem = { time: 0, text: text };
        if (rowIndex < this.lyricsData.length) {
            this.lyricsData.splice(rowIndex, 0, lyricItem);
            // 更新后续行的ID
            this.updateRowIdsAfterIndex(rowIndex);
        } else {
            this.lyricsData.push(lyricItem);
        }
        
        const row = document.createElement('tr');
        row.id = rowId;
        row.innerHTML = `
            <td>${rowIndex + 1}</td>
            <td class="timestamp-cell">[00:00.00]</td>
            <td class="lyrics-cell">${text}</td>
            <td class="action-buttons">
                <button class="btn btn-small btn-danger delete-btn" onclick="lrcEditor.deleteRow(${rowIndex})">删</button>
            </td>
        `;
        
        // 添加点击行选中功能
        row.addEventListener('click', (e) => {
            // 如果点击的是删除按钮，则不触发选中
            if (!e.target.classList.contains('delete-btn')) {
                this.selectRow(rowIndex);
            }
        });
        
        // 添加双击编辑功能
        const timestampCell = row.querySelector('.timestamp-cell');
        const lyricsCell = row.querySelector('.lyrics-cell');
        
        timestampCell.addEventListener('dblclick', (e) => {
            e.stopPropagation(); // 阻止冒泡到行点击事件
            this.editTimestamp(rowId, rowIndex);
        });
        lyricsCell.addEventListener('dblclick', (e) => {
            e.stopPropagation(); // 阻止冒泡到行点击事件
            this.editLyrics(rowId, rowIndex);
        });
        
        tbody.appendChild(row);
    }

    // 更新指定索引之后的所有行ID
    updateRowIdsAfterIndex(startIndex) {
        const tbody = document.getElementById('lyricsTableBody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach((row, idx) => {
            if (idx >= startIndex) {
                const newId = `row-${idx}`;
                row.id = newId;
                
                // 更新按钮的参数
                const selectBtn = row.querySelector('.select-btn');
                const deleteBtn = row.querySelector('.delete-btn');
                if (selectBtn) selectBtn.setAttribute('onclick', `lrcEditor.selectRow(${idx})`);
                if (deleteBtn) deleteBtn.setAttribute('onclick', `lrcEditor.deleteRow(${idx})`);
                
                // 更新行号
                row.cells[0].textContent = idx + 1;
            }
        });
    }

    // 添加新行按钮事件
    addNewRow() {
        this.addRow('', this.lyricsData.length);
    }

    // 选择某一行
    selectRow(index) {
        // 取消之前选中的行
        const prevSelected = document.querySelector('.lyrics-table tr.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
        
        // 选中当前行
        const row = document.getElementById(`row-${index}`);
        if (row) {
            row.classList.add('selected');
            this.currentRowIndex = index;
            
            // 滚动到选中行
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 删除某一行
    deleteRow(index) {
        if (confirm('确定要删除这一行吗？')) {
            const row = document.getElementById(`row-${index}`);
            if (row) {
                row.remove();
                this.lyricsData.splice(index, 1);
                
                // 更新后续行的ID和序号
                this.updateRowIdsAfterIndex(index);
                
                // 如果删除的是当前选中行，重置选中状态
                if (this.currentRowIndex === index) {
                    this.currentRowIndex = -1;
                }
            }
            
            // 如果没有歌词了，显示空行提示
            const tbody = document.getElementById('lyricsTableBody');
            if (tbody.children.length === 0) {
                tbody.innerHTML = '<tr class="empty-row"><td colspan="4">暂无歌词，请上传音频并粘贴歌词</td></tr>';
                this.currentRowIndex = -1;
            }
        }
    }

    // 编辑时间戳
    editTimestamp(rowId, index) {
        const cell = document.querySelector(`#${rowId} .timestamp-cell`);
        const currentValue = cell.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.className = 'timestamp-input';
        input.style.width = '100%';
        
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();
        input.select();
        
        const saveTimestamp = () => {
            const newTimestamp = input.value.trim();
            if (newTimestamp && this.isValidTimestamp(newTimestamp)) {
                cell.textContent = newTimestamp;
                // 更新内部数据
                this.lyricsData[index].time = this.timestampToSeconds(newTimestamp);
            } else {
                cell.textContent = currentValue;
            }
        };
        
        input.addEventListener('blur', saveTimestamp);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveTimestamp();
            }
        });
    }

    // 编辑歌词
    editLyrics(rowId, index) {
        const cell = document.querySelector(`#${rowId} .lyrics-cell`);
        const currentValue = cell.textContent;
        
        const textarea = document.createElement('textarea');
        textarea.value = currentValue;
        textarea.className = 'lyrics-textarea';
        textarea.style.width = '100%';
        textarea.style.minHeight = '40px';
        
        cell.innerHTML = '';
        cell.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        const saveLyrics = () => {
            const newLyrics = textarea.value.trim();
            cell.textContent = newLyrics;
            // 更新内部数据
            this.lyricsData[index].text = newLyrics;
        };
        
        textarea.addEventListener('blur', saveLyrics);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveLyrics();
            } else if (e.key === 'Escape') {
                // 按ESC取消编辑
                cell.textContent = currentValue;
            }
        });
    }

    // 验证时间戳格式
    isValidTimestamp(timestamp) {
        const regex = /^\[\d{2}:\d{2}\.\d{2}\]$/;
        return regex.test(timestamp);
    }

    // 将时间戳转换为秒数
    timestampToSeconds(timestamp) {
        const match = timestamp.match(/\[(\d{2}):(\d{2})\.(\d{2})\]/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const centiseconds = parseInt(match[3]);
            return minutes * 60 + seconds + centiseconds / 100;
        }
        return 0;
    }

    // 导入LRC文件
    importLrcFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.lrc';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                this.parseLrcContent(content);
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    // 解析LRC内容
    parseLrcContent(content) {
        // 清空现有歌词
        this.clearLyricsTable();
        
        const lines = content.split('\n');
        const parsedLyrics = [];
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            // 匹配时间戳和歌词 [mm:ss.xx]lyrics 或 [mm:ss]lyrics
            const timestampRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2}))?\]/g;
            let match;
            let lastIndex = 0;
            let lyrics = '';
            
            while ((match = timestampRegex.exec(trimmedLine)) !== null) {
                // 提取歌词部分
                if (match.index > lastIndex) {
                    lyrics = trimmedLine.substring(lastIndex, match.index);
                }
                
                // 计算时间（秒）
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const centiseconds = match[3] ? parseInt(match[3]) : 0;
                const totalSeconds = minutes * 60 + seconds + centiseconds / 100;
                
                // 添加到解析结果
                parsedLyrics.push({
                    time: totalSeconds,
                    text: lyrics.trim()
                });
                
                lastIndex = match.index + match[0].length;
            }
            
            // 如果行以歌词结尾，添加剩余部分
            if (lastIndex < trimmedLine.length) {
                const remaining = trimmedLine.substring(lastIndex).trim();
                if (remaining && parsedLyrics.length > 0) {
                    parsedLyrics[parsedLyrics.length - 1].text += remaining;
                }
            }
        }
        
        // 按时间排序
        parsedLyrics.sort((a, b) => a.time - b.time);
        
        // 添加到表格
        parsedLyrics.forEach((item, index) => {
            this.addRow(item.text, index);
            // 设置时间戳
            const timestampCell = document.querySelector(`#row-${index} .timestamp-cell`);
            if (timestampCell) {
                timestampCell.textContent = this.formatTimestamp(item.time);
                this.lyricsData[index].time = item.time;
            }
        });
        
        // 更新播放歌词按钮状态
        this.updatePlayLyricsButton();
        
        if (parsedLyrics.length === 0) {
            alert('未找到有效的LRC格式歌词');
        }
    }

    // 导出LRC文件
    exportLrcFile() {
        if (this.lyricsData.length === 0) {
            alert('没有歌词可导出');
            return;
        }
        
        // 生成LRC内容
        let lrcContent = '';
        
        // 添加元数据
        const songTitle = this.songTitleInput ? this.songTitleInput.value.trim() : '';
        const artistName = this.artistNameInput ? this.artistNameInput.value.trim() : '';
        const albumName = this.albumNameInput ? this.albumNameInput.value.trim() : '';
        const makerName = this.makerNameInput ? this.makerNameInput.value.trim() : '';
        
        if (songTitle) lrcContent += `[ti:${songTitle}]\n`;
        if (artistName) lrcContent += `[ar:${artistName}]\n`;
        if (albumName) lrcContent += `[al:${albumName}]\n`;
        if (makerName) lrcContent += `[by:${makerName}]\n`;
        lrcContent += `[offset:0]\n`; // 时间偏移量
        lrcContent += '\n';
        
        // 添加歌词
        this.lyricsData.forEach(item => {
            if (item.text.trim()) {
                const timestamp = this.formatTimestamp(item.time);
                lrcContent += `${timestamp}${item.text}\n`;
            }
        });
        
        // 创建下载链接
        const blob = new Blob([lrcContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lyrics.lrc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 切换主题
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // 保存主题到本地存储
        localStorage.setItem('theme', newTheme);
        
        // 更新按钮文本
        this.toggleThemeBtn.innerHTML = newTheme === 'dark' ? '☀️ 浅色模式' : '🌙 暗色模式';
    }

    // 检查本地存储的主题设置
    checkStoredTheme() {
        const storedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', storedTheme);
        this.toggleThemeBtn.innerHTML = storedTheme === 'dark' ? '☀️ 浅色模式' : '🌙 暗色模式';
    }

    // 处理键盘快捷键
    handleKeyDown(event) {
        // 空格键：播放/暂停
        if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
            
            // 如果正在播放，则执行打时间戳并跳到下一行
            if (this.isPlaying && this.currentRowIndex !== -1) {
                this.addTimestampToCurrentRow();
                
                // 自动跳到下一行
                const nextRowIndex = this.currentRowIndex + 1;
                if (nextRowIndex < this.lyricsData.length) {
                    this.selectRow(nextRowIndex);
                } else {
                    // 如果已经是最后一行，添加新行
                    this.addNewRow();
                    setTimeout(() => {
                        this.selectRow(this.lyricsData.length - 1);
                    }, 100);
                }
            } else {
                this.togglePlayPause();
            }
        }
        
        // 方向键：上下导航歌词行，上键同时后退音频
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            if (event.code === 'ArrowUp') {
                event.preventDefault();
                
                // 获取用户设置的后退时间（秒）
                const rewindSeconds = this.rewindTimeSelect ? parseInt(this.rewindTimeSelect.value) : 5;
                
                // 音频后退指定秒数
                if (this.audio && this.audio.currentTime >= rewindSeconds) {
                    this.audio.currentTime -= rewindSeconds;
                } else if (this.audio) {
                    this.audio.currentTime = 0; // 如果当前时间不足，则跳到开头
                }
                
                // 如果当前有选中行，向上选择一行
                if (this.currentRowIndex > 0) {
                    this.selectRow(this.currentRowIndex - 1);
                }
            } else if (event.code === 'ArrowDown') {
                event.preventDefault();
                if (this.currentRowIndex < this.lyricsData.length - 1) {
                    this.selectRow(this.currentRowIndex + 1);
                }
            }
        }
        
        // 回车键：添加新行（当焦点不在输入框时）
        if (event.code === 'Enter' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
            this.addNewRow();
        }
        
        // Esc键：关闭模态框
        if (event.code === 'Escape') {
            if (this.pasteLyricsModal && this.pasteLyricsModal.style.display === 'block') {
                this.hidePasteLyricsModal();
            }
            if (this.helpModal && this.helpModal.style.display === 'block') {
                this.hideHelpModal();
            }
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.lrcEditor = new LrcEditor();
});