# 左滑右滑操作实现指南

本文档详细说明了如何在Web应用中实现表格行的左滑右滑操作功能。

## 功能概述

左滑右滑操作允许用户通过滑动来快速标记商品状态：
- **左滑**：标记为有货（实际数量 = 应发数量）
- **右滑**：标记为无货（实际数量 = 0）

## 实现步骤

### 1. HTML结构

```html
<table id="dataTable">
    <tbody id="tableBody">
        <!-- 表格行会通过JavaScript动态生成 -->
    </tbody>
</table>
```

表格行结构示例：
```html
<tr class="table-row green" data-id="1" data-quantity="10" data-product="商品名称" data-price="1.0" data-date="">
    <td data-field="index" class="text-right">1</td>
    <td data-field="productName" class="text-left">商品名称</td>
    <td data-field="barcode" class="text-center">1234</td>
    <td data-field="quantity" class="text-right">10</td>
    <td data-field="price" class="text-center">1.0</td>
    <td data-field="actualQuantity" class="text-right">10</td>
</tr>
```

**关键属性说明：**
- `class="table-row"`：标识这是一个可滑动的表格行
- `data-status`：行的状态（green/red/yellow/white）
- `data-id`：行的唯一标识符
- `data-quantity`：应发数量
- `data-product`：商品名称
- `data-price`：价格
- `data-date`：生产日期

### 2. CSS样式

#### 基础样式

```css
#dataTable tbody tr {
    transition: transform 0.3s, background-color 0.3s;
    touch-action: pan-y manipulation;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
}
```

**样式说明：**
- `transition`：平滑的过渡动画
- `touch-action`：允许垂直滚动，禁用水平滚动
- `cursor: pointer`：鼠标悬停时显示手型光标
- `-webkit-tap-highlight-color`：禁用移动端点击高亮

#### 滑动状态样式

```css
#dataTable tbody tr.swiping {
    transition: none;
    z-index: 10;
}

#dataTable tbody tr.swipe-green {
    background-color: rgba(76, 175, 80, 0.25) !important;
}

#dataTable tbody tr.swipe-red {
    background-color: rgba(244, 67, 54, 0.25) !important;
}
```

**样式说明：**
- `.swiping`：滑动时禁用过渡效果，提高响应速度
- `.swipe-green`：左滑时的绿色背景提示
- `.swipe-red`：右滑时的红色背景提示

### 3. JavaScript实现

#### 3.1 全局变量

```javascript
let isSwiping = false;
let touchStartX = 0;
let touchCurrentX = 0;
let activeRow = null;
let lastTouchTime = 0;
let lastTouchRowId = null;
```

**变量说明：**
- `isSwiping`：是否正在滑动
- `touchStartX`：触摸起始X坐标
- `touchCurrentX`：当前触摸X坐标
- `activeRow`：当前操作的行元素
- `lastTouchTime`：上次触摸时间（用于双击检测）
- `lastTouchRowId`：上次触摸的行ID（用于双击检测）

#### 3.2 鼠标事件处理

##### 鼠标按下事件

```javascript
function handleRowMouseDown(e) {
    const row = e.target.closest('tr');
    if (!row) return;

    touchStartX = e.clientX;
    touchCurrentX = e.clientX;
    isSwiping = true;
    activeRow = row;
    row.classList.add('swiping');
}
```

**逻辑说明：**
1. 获取点击的目标行
2. 记录起始X坐标
3. 标记开始滑动状态
4. 添加滑动样式类

##### 鼠标移动事件

```javascript
function handleRowMouseMove(e) {
    if (!isSwiping || !activeRow) return;

    touchCurrentX = e.clientX;
    const diffX = touchCurrentX - touchStartX;

    if (Math.abs(diffX) < 60) {
        activeRow.style.transform = `translateX(${diffX}px)`;

        if (diffX < -20) {
            activeRow.classList.add('swipe-green');
            activeRow.classList.remove('swipe-red');
        } else if (diffX > 20) {
            activeRow.classList.add('swipe-red');
            activeRow.classList.remove('swipe-green');
        } else {
            activeRow.classList.remove('swipe-green');
            activeRow.classList.remove('swipe-red');
        }
    }
}
```

**逻辑说明：**
1. 检查是否在滑动状态
2. 计算滑动距离
3. 限制最大滑动距离为60px
4. 根据滑动方向和距离添加对应的颜色提示
   - 左滑超过20px：显示绿色提示
   - 右滑超过20px：显示红色提示
   - 小于20px：清除所有颜色提示

##### 鼠标释放事件

```javascript
async function handleRowMouseUp(e) {
    if (!isSwiping || !activeRow) return;

    const diffX = touchCurrentX - touchStartX;
    const rowId = parseInt(activeRow.dataset.id);
    const quantity = parseInt(activeRow.dataset.quantity);

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';

    if (Math.abs(diffX) > 40) {
        if (diffX < -40) {
            // 左滑：标记为有货
            activeRow.style.transform = 'translateX(0)';
            await setRowData(rowId, quantity, undefined, true);
        } else if (diffX > 40) {
            // 右滑：标记为无货
            activeRow.style.transform = 'translateX(0)';
            await setRowData(rowId, 0, undefined, true);
        }
    } else {
        // 滑动距离不足，恢复原位
        activeRow.style.transform = 'translateX(0)';
    }

    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}
```

**逻辑说明：**
1. 计算滑动距离
2. 判断滑动方向和距离
   - 左滑超过40px：标记为有货
   - 右滑超过40px：标记为无货
   - 小于40px：取消操作
3. 重置行位置和样式
4. 清理状态变量

##### 鼠标离开事件

```javascript
function handleRowMouseLeave(e) {
    if (!isSwiping || !activeRow) return;

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';
    activeRow.style.transform = 'translateX(0)';
    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}
```

**逻辑说明：**
- 当鼠标离开行时，取消滑动操作
- 恢复行到原始位置
- 清理状态变量

#### 3.3 触摸事件处理

##### 触摸开始事件

```javascript
function handleRowTouchStart(e) {
    const row = e.target.closest('tr');
    if (!row) return;

    touchStartX = e.touches[0].clientX;
    touchCurrentX = e.touches[0].clientX;
    isSwiping = true;
    activeRow = row;
    row.classList.add('swiping');
}
```

**逻辑说明：**
- 与鼠标按下事件类似
- 使用 `e.touches[0].clientX` 获取触摸坐标

##### 触摸移动事件

```javascript
function handleRowTouchMove(e) {
    if (!isSwiping || !activeRow) return;

    touchCurrentX = e.touches[0].clientX;
    const diffX = touchCurrentX - touchStartX;

    if (Math.abs(diffX) < 60) {
        activeRow.style.transform = `translateX(${diffX}px)`;

        if (diffX < -20) {
            activeRow.classList.add('swipe-green');
            activeRow.classList.remove('swipe-red');
        } else if (diffX > 20) {
            activeRow.classList.add('swipe-red');
            activeRow.classList.remove('swipe-green');
        } else {
            activeRow.classList.remove('swipe-green');
            activeRow.classList.remove('swipe-red');
        }
    }
}
```

**逻辑说明：**
- 与鼠标移动事件类似
- 使用 `e.touches[0].clientX` 获取触摸坐标

##### 触摸结束事件

```javascript
async function handleRowTouchEnd(e) {
    if (!isSwiping || !activeRow) return;

    const diffX = touchCurrentX - touchStartX;
    const rowId = parseInt(activeRow.dataset.id);
    const quantity = parseInt(activeRow.dataset.quantity);
    const currentTime = new Date().getTime();

    // 双击检测
    if (Math.abs(diffX) < 10 && currentTime - lastTouchTime < 300 && lastTouchRowId === rowId) {
        activeRow.style.transform = 'translateX(0)';
        activeRow.classList.remove('swipe-green');
        activeRow.classList.remove('swipe-red');
        
        isSwiping = false;
        activeRow = null;
        
        setTimeout(() => {
            openEditModal(rowId);
        }, 50);
        return;
    }

    lastTouchTime = currentTime;
    lastTouchRowId = rowId;

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';

    if (Math.abs(diffX) > 40) {
        if (diffX < -40) {
            // 左滑：标记为有货
            activeRow.style.transform = 'translateX(0)';
            await setRowData(rowId, quantity, undefined, true);
        } else if (diffX > 40) {
            // 右滑：标记为无货
            activeRow.style.transform = 'translateX(0)';
            await setRowData(rowId, 0, undefined, true);
        }
    } else {
        // 滑动距离不足，恢复原位
        activeRow.style.transform = 'translateX(0)';
    }

    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}
```

**逻辑说明：**
1. 双击检测
   - 滑动距离小于10px
   - 两次触摸间隔小于300ms
   - 同一行
   - 如果满足条件，打开编辑弹窗
2. 记录触摸时间和行ID
3. 滑动操作逻辑与鼠标释放事件相同

##### 触摸取消事件

```javascript
function handleRowTouchCancel(e) {
    if (!isSwiping || !activeRow) return;

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';
    activeRow.style.transform = 'translateX(0)';
    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}
```

**逻辑说明：**
- 当触摸被取消时，取消滑动操作
- 与鼠标离开事件类似

#### 3.4 数据更新函数

```javascript
async function setRowData(rowId, actualQuantity, productionDate, shouldSwitchView = false) {
    const tables = await getAllTables();
    const table = tables.find(t => t.id === currentTableId);
    if (!table) return;

    const row = table.data.rows.find(r => r.id === rowId);
    if (!row) return;

    if (actualQuantity !== null) {
        row.actualQuantity = actualQuantity;
    }
    
    if (productionDate !== undefined && productionDate !== null && productionDate !== '') {
        row.productionDate = productionDate;
    }

    row.status = calculateStatus(row.actualQuantity, row.quantity);

    table.updatedAt = new Date().toISOString();
    await saveTable(table);

    renderTable(table);

    if (checkTableCompleted(table) === 'completed') {
        showToast('当前表格已完成');
    }
}

function calculateStatus(actualQuantity, quantity) {
    if (actualQuantity === null || actualQuantity === undefined) {
        return 'white';
    }
    if (actualQuantity === 0) {
        return 'red';
    }
    if (actualQuantity >= quantity) {
        return 'green';
    }
    return 'yellow';
}
```

**逻辑说明：**
1. 从数据库获取表格数据
2. 找到对应的行
3. 更新实际数量和生产日期
4. 计算新的状态
5. 保存到数据库
6. 重新渲染表格
7. 如果表格完成，显示提示

#### 3.5 事件绑定

```javascript
function setupTableInteractions(table) {
    const tbody = document.getElementById('tableBody');
    const tableStatus = checkTableCompleted(table);
    const isAllMarked = tableStatus !== 'pending';

    tbody.querySelectorAll('tr').forEach(row => {
        // 双击事件（始终绑定）
        row.addEventListener('dblclick', handleRowDblClick);
        
        // 滑动事件（仅在未完成所有标记时绑定）
        if (!isAllMarked) {
            row.addEventListener('mousedown', handleRowMouseDown);
            row.addEventListener('mousemove', handleRowMouseMove);
            row.addEventListener('mouseup', handleRowMouseUp);
            row.addEventListener('mouseleave', handleRowMouseLeave);
            row.addEventListener('touchstart', handleRowTouchStart, { passive: true });
            row.addEventListener('touchmove', handleRowTouchMove, { passive: false });
            row.addEventListener('touchend', handleRowTouchEnd);
            row.addEventListener('touchcancel', handleRowTouchCancel);
        }
    });
}

function handleRowDblClick(e) {
    const row = e.target.closest('tr');
    if (!row || isSwiping) return;

    const rowId = parseInt(row.dataset.id);
    openEditModal(rowId);
}
```

**逻辑说明：**
1. 检查表格是否已完成所有标记
2. 如果已完成，只绑定双击事件
3. 如果未完成，绑定所有滑动事件
4. 双击事件始终绑定，用于打开编辑弹窗

## 关键技术点

### 1. 触摸事件 vs 鼠标事件

移动端和桌面端需要分别处理：
- **移动端**：使用 `touchstart`、`touchmove`、`touchend`、`touchcancel`
- **桌面端**：使用 `mousedown`、`mousemove`、`mouseup`、`mouseleave`

### 2. 触摸事件参数

```javascript
// 获取触摸坐标
e.touches[0].clientX
e.touches[0].clientY

// 获取触摸点数量
e.touches.length

// 阻止默认行为
e.preventDefault()
```

### 3. 事件选项

```javascript
// 被动事件监听器（提高滚动性能）
{ passive: true }

// 非被动事件监听器（允许调用preventDefault）
{ passive: false }
```

### 4. CSS Transform

```javascript
// 移动元素
element.style.transform = `translateX(${x}px)`;

// 恢复原位
element.style.transform = 'translateX(0)';
```

### 5. 过渡动画

```css
/* 滑动时：禁用过渡，提高响应速度 */
.swiping {
    transition: none;
}

/* 释放时：启用过渡，平滑恢复 */
tr {
    transition: transform 0.3s, background-color 0.3s;
}
```

## 注意事项

### 1. 防止误操作

- 设置合理的滑动阈值（40px）
- 提供视觉反馈（颜色变化）
- 支持取消操作（滑动距离不足时恢复）

### 2. 性能优化

- 使用 `transform` 而不是 `left`/`right`
- 滑动时禁用过渡动画
- 使用 `requestAnimationFrame` 优化动画（可选）

### 3. 兼容性

- 同时支持鼠标和触摸事件
- 处理 `touchcancel` 事件
- 使用 `e.target.closest()` 获取目标元素

### 4. 用户体验

- 提供视觉反馈（颜色变化）
- 支持双击编辑
- 完成表格后禁用滑动

### 5. 状态管理

- 使用全局变量跟踪滑动状态
- 及时清理状态变量
- 防止多个行同时滑动

## 完整示例代码

```javascript
// 全局变量
let isSwiping = false;
let touchStartX = 0;
let touchCurrentX = 0;
let activeRow = null;

// 鼠标事件
function handleRowMouseDown(e) {
    const row = e.target.closest('tr');
    if (!row) return;

    touchStartX = e.clientX;
    touchCurrentX = e.clientX;
    isSwiping = true;
    activeRow = row;
    row.classList.add('swiping');
}

function handleRowMouseMove(e) {
    if (!isSwiping || !activeRow) return;

    touchCurrentX = e.clientX;
    const diffX = touchCurrentX - touchStartX;

    if (Math.abs(diffX) < 60) {
        activeRow.style.transform = `translateX(${diffX}px)`;

        if (diffX < -20) {
            activeRow.classList.add('swipe-green');
            activeRow.classList.remove('swipe-red');
        } else if (diffX > 20) {
            activeRow.classList.add('swipe-red');
            activeRow.classList.remove('swipe-green');
        } else {
            activeRow.classList.remove('swipe-green');
            activeRow.classList.remove('swipe-red');
        }
    }
}

async function handleRowMouseUp(e) {
    if (!isSwiping || !activeRow) return;

    const diffX = touchCurrentX - touchStartX;
    const rowId = parseInt(activeRow.dataset.id);
    const quantity = parseInt(activeRow.dataset.quantity);

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';

    if (Math.abs(diffX) > 40) {
        if (diffX < -40) {
            activeRow.style.transform = 'translateX(0)';
            await setRowData(rowId, quantity, undefined, true);
        } else if (diffX > 40) {
            activeRow.style.transform = 'translateX(0)';
            await setRowData(rowId, 0, undefined, true);
        }
    } else {
        activeRow.style.transform = 'translateX(0)';
    }

    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}

// 触摸事件
function handleRowTouchStart(e) {
    const row = e.target.closest('tr');
    if (!row) return;

    touchStartX = e.touches[0].clientX;
    touchCurrentX = e.touches[0].clientX;
    isSwiping = true;
    activeRow = row;
    row.classList.add('swiping');
}

function handleRowTouchMove(e) {
    if (!isSwiping || !activeRow) return;

    touchCurrentX = e.touches[0].clientX;
    const diffX = touchCurrentX - touchStartX;

    if (Math.abs(diffX) < 60) {
        activeRow.style.transform = `translateX(${diffX}px)`;

        if (diffX < -20) {
            activeRow.classList.add('swipe-green');
            activeRow.classList.remove('swipe-red');
        } else if (diffX > 20) {
            activeRow.classList.add('swipe-red');
            activeRow.classList.remove('swipe-green');
        } else {
            activeRow.classList.remove('swipe-green');
            activeRow.classList.remove('swipe-red');
        }
    }
}

async function handleRowTouchEnd(e) {
    if (!isSwiping || !activeRow) return;

    const diffX = touchCurrentX - touchStartX;
    const rowId = parseInt(activeRow.dataset.id);
    const quantity = parseInt(activeRow.dataset.quantity);

    activeRow.style.transition = 'transform 0.3s, background-color 0.3s';

    if (Math.abs(diffX) > 40) {
        if (diffX < -40) {
            activeRow.style.transform = 'translateX(0)';
            await setRowData(rowId, quantity, undefined, true);
        } else if (diffX > 40) {
            activeRow.style.transform = 'translateX(0)';
            await setRowData(rowId, 0, undefined, true);
        }
    } else {
        activeRow.style.transform = 'translateX(0)';
    }

    activeRow.classList.remove('swipe-green');
    activeRow.classList.remove('swipe-red');

    setTimeout(() => {
        if (activeRow) {
            activeRow.style.transition = '';
        }
    }, 300);

    isSwiping = false;
    activeRow = null;
}

// 事件绑定
function setupTableInteractions(table) {
    const tbody = document.getElementById('tableBody');
    
    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('mousedown', handleRowMouseDown);
        row.addEventListener('mousemove', handleRowMouseMove);
        row.addEventListener('mouseup', handleRowMouseUp);
        row.addEventListener('mouseleave', handleRowMouseLeave);
        row.addEventListener('touchstart', handleRowTouchStart, { passive: true });
        row.addEventListener('touchmove', handleRowTouchMove, { passive: false });
        row.addEventListener('touchend', handleRowTouchEnd);
        row.addEventListener('touchcancel', handleRowTouchCancel);
        row.addEventListener('dblclick', handleRowDblClick);
    });
}
```

## 总结

左滑右滑操作的核心要点：

1. **同时支持鼠标和触摸事件**
2. **提供视觉反馈**（颜色变化）
3. **设置合理的阈值**（40px触发操作）
4. **支持取消操作**（滑动距离不足时恢复）
5. **性能优化**（使用transform，滑动时禁用过渡）
6. **状态管理**（全局变量跟踪滑动状态）
7. **用户体验**（双击编辑，完成表格后禁用滑动）

按照本文档的步骤和代码示例，你可以在任何Web应用中实现类似的左滑右滑操作功能。
