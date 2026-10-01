# 搜索功能实现教程

## 功能概述

本项目实现了两种搜索功能：
1. **输入框智能提示** - 在输入时实时显示匹配的建议项
2. **资产搜索** - 在搜索模态框中搜索所有资产

## 一、输入框智能提示功能

### 功能说明
当用户在输入框中输入内容时，会实时显示匹配的历史数据项，用户可以点击选择。

### 实现步骤

#### 第1步：HTML结构
在输入框下方添加一个用于显示建议的容器：

```html
<div class="input-container">
    <input type="text" id="itemInput" placeholder="输入内容并选择建议项...">
    <div id="suggestions"></div>  <!-- 建议列表容器 -->
</div>
```

#### 第2步：CSS样式
为建议列表添加样式：

```css
#suggestions {
    position: absolute;           /* 绝对定位，相对于输入框 */
    background: white;            /* 白色背景 */
    border: 1px solid #ddd;     /* 灰色边框 */
    border-radius: 4px;          /* 圆角 */
    display: none;                /* 默认隐藏 */
    z-index: 100;                /* 层级，确保显示在最上层 */
    max-height: 200px;           /* 最大高度 */
    overflow-y: auto;            /* 超出时显示滚动条 */
    width: max-content;          /* 宽度根据内容自动调整 */
    min-width: 200px;           /* 最小宽度 */
    max-width: 100%;            /* 最大宽度不超过父元素 */
}

.suggestion-item {
    padding: 8px 12px;          /* 内边距 */
    cursor: pointer;              /* 鼠标悬停显示手型 */
}

.suggestion-item:hover {
    background-color: #f0f0f0;   /* 悬停时背景变灰 */
}
```

#### 第3步：JavaScript实现

##### 3.1 显示建议函数
```javascript
function showSuggestions(text) {
    // 1. 去除首尾空格
    text = text.trim();
    
    // 2. 如果输入为空，隐藏建议列表
    if (!text) {
        suggestions.style.display = 'none';
        return;
    }

    // 3. 将所有数据项倒序排列（最新的显示在前面）
    const reversedItems = [...items].reverse();
    
    // 4. 去重（使用Set去除重复项）
    const uniqueItems = [...new Set(reversedItems)];
    
    // 5. 过滤出包含输入关键词的项（不区分大小写）
    const filtered = uniqueItems.filter(item => 
        item.toLowerCase().includes(text.toLowerCase())
    );
    
    // 6. 如果没有匹配项，隐藏建议列表
    if (filtered.length === 0) {
        suggestions.style.display = 'none';
        return;
    }

    // 7. 生成建议列表的HTML
    suggestions.innerHTML = filtered.map(item => 
        `<div class="suggestion-item">${item}</div>`
    ).join('');
    
    // 8. 显示建议列表
    suggestions.style.display = 'block';

    // 9. 为每个建议项添加点击事件
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
        item.addEventListener('click', () => {
            // 10. 点击后，将建议项的内容填入输入框
            itemInput.value = item.textContent;
            // 11. 隐藏建议列表
            suggestions.style.display = 'none';
            // 12. 保持输入框焦点，方便继续编辑
            itemInput.focus();
        });
    });
}
```

##### 3.2 监听输入事件
```javascript
// 当用户在输入框中输入内容时，实时显示建议
itemInput.addEventListener('input', (e) => {
    showSuggestions(e.target.value);
});
```

##### 3.3 点击外部关闭建议列表
```javascript
// 当用户点击页面其他地方时，隐藏建议列表
document.addEventListener('click', (e) => {
    // 如果点击的不是建议列表或输入框，则隐藏建议列表
    if (!suggestions.contains(e.target) && e.target !== itemInput) {
        suggestions.style.display = 'none';
    }
});
```

### 工作流程图

```
用户输入 → 触发input事件 → 调用showSuggestions()
    ↓
检查输入是否为空 → 是 → 隐藏建议列表
    ↓ 否
倒序排列数据 → 去重 → 过滤匹配项
    ↓
生成HTML → 显示建议列表 → 添加点击事件
    ↓
用户点击建议项 → 填入输入框 → 隐藏建议列表
```

---

## 二、资产搜索功能

### 功能说明
在搜索模态框中输入关键词，实时搜索所有资产，并按地点分组显示结果。

### 实现步骤

#### 第1步：HTML结构
添加搜索模态框：

```html
<div id="searchModal">
    <input type="text" id="searchInput" placeholder="输入要搜索的资产关键词">
    <div id="searchResults"></div>  <!-- 搜索结果容器 -->
    <button id="closeSearchButton">关闭</button>
</div>
```

#### 第2步：CSS样式
```css
#searchModal {
    display: none;                    /* 默认隐藏 */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
}

#searchInput {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #007bff;
    border-radius: 4px;
    margin-bottom: 10px;
}

#searchResults {
    max-height: 400px;              /* 最大高度 */
    overflow-y: auto;               /* 超出显示滚动条 */
    margin-bottom: 10px;
}

.search-result-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
}

.search-result-location {
    color: #dc3545;               /* 红色，地点 */
    font-weight: bold;
    margin-bottom: 5px;
}

.search-result-asset {
    color: #28a745;               /* 绿色，资产 */
    margin-left: 20px;
}

.search-count {
    color: #007bff;                /* 蓝色，统计 */
    font-weight: bold;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
}
```

#### 第3步：JavaScript实现

##### 3.1 搜索函数
```javascript
function searchAssets(keyword) {
    // 1. 去除首尾空格
    if (!keyword.trim()) {
        searchResults.innerHTML = '<div class="search-count">请输入搜索关键词</div>';
        return;
    }

    // 2. 初始化变量
    let results = [];              // 搜索结果数组
    let currentLocation = null;     // 当前地点
    let totalCount = 0;           // 匹配总数
    let firstLocationIndex = -1;   // 第一个地点的索引
    let isFirstLocation = true;     // 是否是第一个地点

    // 3. 遍历所有数据项
    items.forEach((item, index) => {
        // 4. 如果是地点行（以@开头）
        if (item.startsWith('@')) {
            currentLocation = item;
            
            // 5. 记录第一个地点的索引（模板资产）
            if (isFirstLocation) {
                firstLocationIndex = index;
                isFirstLocation = false;
            }
        } 
        // 6. 如果是资产行，且包含搜索关键词
        else if (item.toLowerCase().includes(keyword.toLowerCase())) {
            // 7. 检查是否属于模板资产（排除模板资产）
            const belongsToFirstLocation = (
                firstLocationIndex !== -1 && 
                currentLocation === items[firstLocationIndex]
            );
            
            // 8. 如果不属于模板资产，则添加到结果中
            if (!belongsToFirstLocation) {
                results.push({
                    location: currentLocation,  // 所属地点
                    asset: item                // 资产内容
                });
                totalCount++;
            }
        }
    });

    // 9. 如果没有匹配结果，显示提示
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-count">未找到相关资产</div>';
        return;
    }

    // 10. 生成搜索结果的HTML
    let html = `<div class="search-count">找到 ${totalCount} 个相关资产</div>`;
    let currentDisplayLocation = null;  // 当前显示的地点

    // 11. 按地点分组显示结果
    results.forEach(result => {
        // 12. 如果地点发生变化，添加新的地点标题
        if (currentDisplayLocation !== result.location) {
            if (currentDisplayLocation) {
                html += '</div>';  // 关闭上一个地点的div
            }
            currentDisplayLocation = result.location;
            html += `
                <div class="search-result-item">
                    <div class="search-result-location">${result.location}</div>
            `;
        }
        // 13. 添加资产项
        html += `<div class="search-result-asset">${result.asset}</div>`;
    });
    html += '</div>';  // 关闭最后一个地点的div

    // 14. 将HTML插入到结果容器中
    searchResults.innerHTML = html;
}
```

##### 3.2 监听搜索输入事件
```javascript
// 实时搜索（每输入一个字符就搜索一次）
searchInput.addEventListener('input', (e) => {
    searchAssets(e.target.value);
});
```

### 工作流程图

```
用户输入关键词 → 触发input事件 → 调用searchAssets()
    ↓
检查输入是否为空 → 是 → 显示"请输入搜索关键词"
    ↓ 否
遍历所有数据项
    ↓
遇到地点行 → 记录当前地点
    ↓
遇到资产行 → 检查是否包含关键词
    ↓
包含关键词 → 排除模板资产 → 添加到结果数组
    ↓
遍历完成 → 按地点分组生成HTML → 显示结果
```

---

## 三、关键技术点解析

### 1. 模糊搜索实现
```javascript
// 使用includes()方法实现模糊搜索
// toLowerCase()实现不区分大小写
item.toLowerCase().includes(keyword.toLowerCase())

// 示例：
// 输入："电脑"
// 匹配："笔记本电脑"、"台式电脑"、"电脑配件"
// 不匹配："手机"、"平板"
```

### 2. 去重处理
```javascript
// 使用Set数据结构去重
const uniqueItems = [...new Set(array)];

// 示例：
// 原数组：["苹果", "香蕉", "苹果", "橙子"]
// 去重后：["苹果", "香蕉", "橙子"]
```

### 3. 倒序排列
```javascript
// 使用扩展运算符和reverse()倒序
const reversedItems = [...items].reverse();

// 示例：
// 原数组：["A", "B", "C", "D"]
// 倒序后：["D", "C", "B", "A"]
```

### 4. 实时搜索
```javascript
// 使用input事件监听器，每次输入都触发搜索
input.addEventListener('input', (e) => {
    searchAssets(e.target.value);
});

// 优点：实时反馈，用户体验好
// 注意：数据量大时可能需要防抖处理
```

### 5. 点击外部关闭
```javascript
// 监听document的点击事件
document.addEventListener('click', (e) => {
    // 检查点击目标是否在建议列表或输入框内
    if (!suggestions.contains(e.target) && e.target !== itemInput) {
        suggestions.style.display = 'none';
    }
});
```

---

## 四、完整示例代码

### 示例1：简单的输入提示

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .input-container {
            position: relative;
            width: 300px;
            margin: 20px;
        }
        
        #itemInput {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 2px solid #007bff;
            border-radius: 4px;
        }
        
        #suggestions {
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            display: none;
            z-index: 100;
            max-height: 200px;
            overflow-y: auto;
            width: 100%;
        }
        
        .suggestion-item {
            padding: 8px 12px;
            cursor: pointer;
        }
        
        .suggestion-item:hover {
            background-color: #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="input-container">
        <input type="text" id="itemInput" placeholder="输入内容...">
        <div id="suggestions"></div>
    </div>
    
    <script>
        // 模拟数据
        const items = [
            "笔记本电脑",
            "台式电脑",
            "手机",
            "平板电脑",
            "显示器",
            "键盘",
            "鼠标"
        ];
        
        const itemInput = document.getElementById('itemInput');
        const suggestions = document.getElementById('suggestions');
        
        function showSuggestions(text) {
            text = text.trim();
            if (!text) {
                suggestions.style.display = 'none';
                return;
            }
            
            // 模糊搜索
            const filtered = items.filter(item => 
                item.toLowerCase().includes(text.toLowerCase())
            );
            
            if (filtered.length === 0) {
                suggestions.style.display = 'none';
                return;
            }
            
            // 生成HTML
            suggestions.innerHTML = filtered.map(item => 
                `<div class="suggestion-item">${item}</div>`
            ).join('');
            
            suggestions.style.display = 'block';
            
            // 添加点击事件
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    itemInput.value = item.textContent;
                    suggestions.style.display = 'none';
                    itemInput.focus();
                });
            });
        }
        
        // 监听输入
        itemInput.addEventListener('input', (e) => {
            showSuggestions(e.target.value);
        });
        
        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!suggestions.contains(e.target) && e.target !== itemInput) {
                suggestions.style.display = 'none';
            }
        });
    </script>
</body>
</html>
```

### 示例2：带分组显示的搜索

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        #searchModal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 600px;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        
        #searchInput {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #007bff;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        
        #searchResults {
            max-height: 400px;
            overflow-y: auto;
            margin-bottom: 10px;
        }
        
        .search-result-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }
        
        .search-result-location {
            color: #dc3545;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .search-result-asset {
            color: #28a745;
            margin-left: 20px;
        }
        
        .search-count {
            color: #007bff;
            font-weight: bold;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        
        #closeSearchButton {
            width: 100%;
            padding: 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <button onclick="openSearch()">打开搜索</button>
    
    <div id="searchModal">
        <input type="text" id="searchInput" placeholder="输入要搜索的资产关键词">
        <div id="searchResults"></div>
        <button id="closeSearchButton">关闭</button>
    </div>
    
    <script>
        // 模拟数据
        const items = [
            "@办公室",
            "笔记本电脑",
            "台式电脑",
            "显示器",
            "@仓库",
            "手机",
            "平板电脑",
            "配件"
        ];
        
        const searchModal = document.getElementById('searchModal');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const closeSearchButton = document.getElementById('closeSearchButton');
        
        function openSearch() {
            searchModal.style.display = 'block';
            searchInput.value = '';
            searchInput.focus();
            searchResults.innerHTML = '<div class="search-count">请输入搜索关键词</div>';
        }
        
        function searchAssets(keyword) {
            if (!keyword.trim()) {
                searchResults.innerHTML = '<div class="search-count">请输入搜索关键词</div>';
                return;
            }
            
            let results = [];
            let currentLocation = null;
            let totalCount = 0;
            let firstLocationIndex = -1;
            let isFirstLocation = true;
            
            items.forEach((item, index) => {
                if (item.startsWith('@')) {
                    currentLocation = item;
                    
                    if (isFirstLocation) {
                        firstLocationIndex = index;
                        isFirstLocation = false;
                    }
                } else if (item.toLowerCase().includes(keyword.toLowerCase())) {
                    const belongsToFirstLocation = (
                        firstLocationIndex !== -1 && 
                        currentLocation === items[firstLocationIndex]
                    );
                    
                    if (!belongsToFirstLocation) {
                        results.push({
                            location: currentLocation,
                            asset: item
                        });
                        totalCount++;
                    }
                }
            });
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-count">未找到相关资产</div>';
                return;
            }
            
            let html = `<div class="search-count">找到 ${totalCount} 个相关资产</div>`;
            let currentDisplayLocation = null;
            
            results.forEach(result => {
                if (currentDisplayLocation !== result.location) {
                    if (currentDisplayLocation) {
                        html += '</div>';
                    }
                    currentDisplayLocation = result.location;
                    html += `
                        <div class="search-result-item">
                            <div class="search-result-location">${result.location}</div>
                    `;
                }
                html += `<div class="search-result-asset">${result.asset}</div>`;
            });
            html += '</div>';
            
            searchResults.innerHTML = html;
        }
        
        // 监听输入
        searchInput.addEventListener('input', (e) => {
            searchAssets(e.target.value);
        });
        
        // 关闭按钮
        closeSearchButton.addEventListener('click', () => {
            searchModal.style.display = 'none';
        });
    </script>
</body>
</html>
```

---

## 五、常见问题

### Q1: 为什么搜索时使用toLowerCase()？
**A:** 为了实现不区分大小写的搜索。例如，输入"电脑"可以匹配"电脑"和"电脑"，输入"Computer"可以匹配"computer"和"Computer"。

### Q2: 如何提高搜索性能？
**A:** 
1. 对于大数据量，使用防抖（debounce）技术
2. 使用更高效的搜索算法（如Trie树）
3. 限制搜索结果数量
4. 使用Web Worker进行后台搜索

### Q3: 如何添加拼音搜索支持？
**A:** 需要引入拼音转换库，如pinyin.js：
```javascript
import pinyin from 'pinyin';

// 将中文转换为拼音
const pinyinText = pinyin.convertToPinyin(chineseText);
// 然后进行拼音匹配
```

### Q4: 如何添加搜索高亮？
**A:** 使用正则表达式替换匹配文本：
```javascript
function highlightText(text, keyword) {
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}
```

---

## 六、总结

### 核心要点
1. **模糊搜索**：使用`includes()`方法实现
2. **实时反馈**：监听`input`事件
3. **用户体验**：点击外部关闭、键盘支持
4. **性能优化**：去重、限制结果数量

### 适用场景
- 搜索框智能提示
- 自动补全功能
- 数据筛选
- 关键词搜索

### 扩展方向
- 添加拼音搜索
- 添加搜索历史
- 添加搜索高亮
- 添加高级搜索选项
