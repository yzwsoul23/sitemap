let items = [];
let currentEditIndex = null;
let db;
let isAllCollapsed = false;
let saveItemTimeout = null;

const dataList = document.getElementById('dataList');
const itemInput = document.getElementById('itemInput');
const suggestions = document.getElementById('suggestions');
const exportButton = document.getElementById('exportButton');
const batchEditButton = document.getElementById('batchEditButton');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveEditButton = document.getElementById('saveEditButton');
const overlay = document.getElementById('overlay');
const editAllModal = document.getElementById('editAllModal');
const importModal = document.getElementById('importModal');
const importInput = document.getElementById('importInput');
const batchAddButton = document.getElementById('batchAddButton');
const savebatchAddButton = document.getElementById('savebatchAddButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const guideModal = document.getElementById('guideModal');
const closeGuideButton = document.getElementById('closeGuideButton');
const collapseAllButton = document.getElementById('collapseAllButton');
const searchButton = document.getElementById('searchButton');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const closeSearchButton = document.getElementById('closeSearchButton');
const locationEditModal = document.getElementById('locationEditModal');
const locationEditInput = document.getElementById('locationEditInput');
const saveLocationEditButton = document.getElementById('saveLocationEditButton');
let currentLocationEditIndex = -1;

let backupSettings = {
    enabled: true,
    frequency: 86400000,
    retention: 3,
    lastBackupTime: null
};
let backupTimer = null;
let backups = [];

const backupModal = document.getElementById('backupModal');
const lastBackupTimeSpan = document.getElementById('lastBackupTime');
const backupStatusSpan = document.getElementById('backupStatus');
const manualBackupButton = document.getElementById('manualBackupButton');
const restoreBackupButton = document.getElementById('restoreBackupButton');
const exportBackupButton = document.getElementById('exportBackupButton');
const importBackupButton = document.getElementById('importBackupButton');
const backupFileInput = document.getElementById('backupFileInput');
const autoBackupEnabledCheckbox = document.getElementById('autoBackupEnabled');
const backupFrequencySelect = document.getElementById('backupFrequency');
const backupRetentionSelect = document.getElementById('backupRetention');
const backupsList = document.getElementById('backupsList');
const closeBackupModalButton = document.getElementById('closeBackupModalButton');

function setupEventDelegation() {
    try {
        dataList.removeEventListener('click', handleListClick);
        dataList.removeEventListener('mousedown', handleListMouseDown);
        dataList.removeEventListener('mousemove', handleListMouseMove);
        dataList.removeEventListener('mouseup', handleListMouseUp);
        dataList.removeEventListener('mouseleave', handleListMouseLeave);
        dataList.removeEventListener('touchstart', handleListTouchStart);
        dataList.removeEventListener('touchmove', handleListTouchMove);
        dataList.removeEventListener('touchend', handleListTouchEnd);
        dataList.removeEventListener('touchcancel', handleListTouchCancel);
        dataList.removeEventListener('dblclick', handleListDblClick);
        
        dataList.addEventListener('click', handleListClick);
        dataList.addEventListener('mousedown', handleListMouseDown);
        dataList.addEventListener('mousemove', handleListMouseMove);
        dataList.addEventListener('mouseup', handleListMouseUp);
        dataList.addEventListener('mouseleave', handleListMouseLeave);
        dataList.addEventListener('touchstart', handleListTouchStart);
        dataList.addEventListener('touchmove', handleListTouchMove);
        dataList.addEventListener('touchend', handleListTouchEnd);
        dataList.addEventListener('touchcancel', handleListTouchCancel);
        dataList.addEventListener('dblclick', handleListDblClick);
        
        console.log('事件委托设置完成');
    } catch (error) {
        console.error('设置事件委托时出错:', error);
        
        try {
            const locationItems = document.querySelectorAll('.location-item');
            locationItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.closest('.location-edit-btn')) {
                        const locationIndex = parseInt(this.getAttribute('data-location-index'));
                        const assets = document.querySelectorAll(`[data-belongs-to="${locationIndex}"]`);
                        const collapseIcon = this.querySelector('.collapse-icon');
                        
                        const isCollapsed = assets.length > 0 && assets[0].style.display === 'none';
                        
                        assets.forEach(asset => {
                            asset.style.display = isCollapsed ? 'flex' : 'none';
                        });
                        
                        collapseIcon.textContent = isCollapsed ? '▼' : '▶';
                    }
                });
            });
            
            const editButtons = document.querySelectorAll('.location-edit-btn');
            editButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const locationIndex = parseInt(this.getAttribute('data-location'));
                    openLocationEditor(locationIndex);
                });
            });
            
            console.log('降级事件绑定设置完成');
        } catch (fallbackError) {
            console.error('降级事件绑定失败:', fallbackError);
        }
    }
}

const saveItem = (value) => {
    try {
        const transaction = db.transaction(['items'], 'readwrite');
        const store = transaction.objectStore('items');
        
        const request = store.add({ value });
        
        request.onerror = (event) => {
            console.error('保存数据错误：', event.target.error);
        };
        
        transaction.oncomplete = () => {
            console.log('数据保存成功，加载最新数据');
            loadItems();
        };
    } catch (error) {
        console.error('保存数据时出错:', error);
        alert('保存数据失败，请刷新页面后重试');
    }
};

const initDB = () => {
    try {
        const request = indexedDB.open('ItemsDB', 1);
        
        request.onerror = (event) => {
            console.error('数据库错误：', event.target.error);
            alert('无法打开数据库，请检查浏览器设置或刷新页面');
        };

        request.onupgradeneeded = (event) => {
            console.log('数据库升级中...');
            const db = event.target.result;
            if (!db.objectStoreNames.contains('items')) {
                db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
                console.log('创建items存储对象成功');
            }
        };

        request.onsuccess = (event) => {
            console.log('数据库打开成功');
            db = event.target.result;
            
            db.onversionchange = () => {
                db.close();
                alert('数据库已过时，请刷新页面');
            };
            
            loadItems();
            
            setupBackup();
        };
    } catch (error) {
        console.error('初始化数据库时出错:', error);
        alert('初始化数据库失败，请刷新页面后重试');
    }
};

const loadItems = () => {
    const transaction = db.transaction(['items'], 'readonly');
    const store = transaction.objectStore('items');
    const request = store.getAll();

    request.onerror = (event) => {
        console.error('加载数据错误：', event.target.error);
    };

    request.onsuccess = () => {
        items = request.result.map(item => item.value);
        console.log(`数据加载成功，共 ${items.length} 条记录`);
        refreshList();
        
        if (items.length === 0) {
            guideModal.style.display = 'block';
            overlay.style.display = 'block';
        }
    };
};

const updateItem = (index, newValue) => {
    try {
        const transaction = db.transaction(['items'], 'readwrite');
        const store = transaction.objectStore('items');
        
        const cursorRequest = store.openCursor();
        let count = 0;
        
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (count === index) {
                    cursor.update({ id: cursor.key, value: newValue });
                }
                count++;
                cursor.continue();
            }
        };

        transaction.oncomplete = () => {
            console.log('更新数据成功，重新加载数据');
            loadItems();
        };
    } catch (error) {
        console.error('更新数据时出错:', error);
        alert('更新数据失败，请刷新页面后重试');
    }
};

const deleteItem = (index) => {
    try {
        const transaction = db.transaction(['items'], 'readwrite');
        const store = transaction.objectStore('items');
        
        const cursorRequest = store.openCursor();
        let count = 0;
        
        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (count === index) {
                    cursor.delete();
                }
                count++;
                cursor.continue();
            }
        };

        transaction.oncomplete = () => {
            console.log('删除数据成功，重新加载数据');
            loadItems();
        };
    } catch (error) {
        console.error('删除数据时出错:', error);
        alert('删除数据失败，请刷新页面后重试');
    }
};

function deleteLocationAndAssets(locationIndex) {
    if (!items[locationIndex] || !items[locationIndex].startsWith('@')) {
        return;
    }
    
    if (locationIndex === 0) {
        showErrorToast('模板地点不能删除');
        return;
    }
    
    let nextLocationIndex = locationIndex + 1;
    while (nextLocationIndex < items.length && !items[nextLocationIndex].startsWith('@')) {
        nextLocationIndex++;
    }
    
    const deleteCount = nextLocationIndex - locationIndex;
    
    showToast('正在删除中...');
    
    const transaction = db.transaction(['items'], 'readwrite');
    const store = transaction.objectStore('items');
    
    const getAllRequest = store.getAll();
    
    getAllRequest.onsuccess = () => {
        const allItems = getAllRequest.result;
        
        store.clear().onsuccess = () => {
            for (let i = 0; i < locationIndex; i++) {
                store.add(allItems[i]);
            }
            
            for (let i = locationIndex + deleteCount; i < allItems.length; i++) {
                store.add(allItems[i]);
            }
            
            transaction.oncomplete = () => {
                loadItems();
                showToast(`已删除"${items[locationIndex]}"及其所有资产`);
            };
        };
    };
}

function refreshList() {
    console.log('刷新列表中，数据条数:', items.length);
    
    const useSimpleMode = true;
    
    if (useSimpleMode || items.length < 500) {
        renderSimpleList();
    } else {
        if (appSettings && typeof appSettings.adjustForDataSize === 'function') {
            appSettings.adjustForDataSize();
            
            if (appSettings.usePagination) {
                renderPaginatedItems();
            } else {
                renderBatchedItems();
            }
        } else {
            renderSimpleList();
        }
    }
}

function renderSimpleList() {
    const fragment = document.createDocumentFragment();
    let currentLocationIndex = -1;
    let assetCounter = 0;
    
    items.forEach((item, index) => {
        const listItem = document.createElement('div');
        
        if (item.startsWith('@')) {
            currentLocationIndex = index;
            assetCounter = 0;
            listItem.className = 'list-item location-item';
            listItem.setAttribute('data-location-index', index);
            listItem.setAttribute('data-index', index);
            
            listItem.innerHTML = `
                <div class="item-text">
                    <span class="collapse-icon">${index === 0 ? '▶' : '▼'}</span> ${item}
                </div>
                <button class="location-edit-btn" data-location="${index}" title="批量编辑此地点及资产">✏️</button>
            `;
        } else {
            assetCounter++;
            listItem.className = 'list-item asset-item';
            listItem.setAttribute('data-belongs-to', currentLocationIndex);
            listItem.setAttribute('data-index', index);
            
            if (currentLocationIndex === 0) {
                listItem.style.display = 'none';
            }
            
            listItem.innerHTML = `
                <div class="item-text"><span class="asset-number">${assetCounter}. </span>${item}</div>
            `;
        }
        
        fragment.appendChild(listItem);
    });
    
    dataList.innerHTML = '';
    dataList.appendChild(fragment);
    
    setupEventDelegation();
}

function renderPaginatedItems() {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / appSettings.pageSize);
    
    if (appSettings.currentPage < 1) appSettings.currentPage = 1;
    if (appSettings.currentPage > totalPages) appSettings.currentPage = totalPages;
    
    const startIdx = (appSettings.currentPage - 1) * appSettings.pageSize;
    const endIdx = Math.min(startIdx + appSettings.pageSize, totalItems);
    
    dataList.innerHTML = `
        <div class="pagination-controls">
            <span>总共 ${totalItems} 项，第 ${appSettings.currentPage}/${totalPages} 页</span>
            <div class="pagination-buttons">
                <button id="prevPage" ${appSettings.currentPage === 1 ? 'disabled' : ''}>上一页</button>
                <button id="nextPage" ${appSettings.currentPage === totalPages ? 'disabled' : ''}>下一页</button>
            </div>
        </div>
        <div class="loading-indicator">数据加载中，请稍候...</div>
    `;
    
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    prevPageBtn.addEventListener('click', () => {
        if (appSettings.currentPage > 1) {
            appSettings.currentPage--;
            refreshList();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (appSettings.currentPage < totalPages) {
            appSettings.currentPage++;
            refreshList();
        }
    });
    
    setTimeout(() => {
        const fragment = document.createDocumentFragment();
        let currentLocationIndex = -1;
        let assetCounter = 0;
        
        for (let i = startIdx - 1; i >= 0; i--) {
            if (items[i].startsWith('@')) {
                currentLocationIndex = i;
                
                for (let j = i + 1; j < startIdx; j++) {
                    if (!items[j].startsWith('@')) {
                        assetCounter++;
                    } else {
                        break;
                    }
                }
                break;
            }
        }
        
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'paginated-items';
        
        for (let i = startIdx; i < endIdx; i++) {
            const item = items[i];
            const listItem = document.createElement('div');
            
            if (item.startsWith('@')) {
                currentLocationIndex = i;
                assetCounter = 0;
                listItem.className = 'list-item location-item';
                listItem.setAttribute('data-location-index', i);
                listItem.setAttribute('data-index', i);
                
                listItem.innerHTML = `
                    <div class="item-text">
                        <span class="collapse-icon">${i === 0 ? '▶' : '▼'}</span> ${item}
                    </div>
                    <button class="location-edit-btn" data-location="${i}" title="批量编辑此地点及资产">✏️</button>
                `;
            } else {
                assetCounter++;
                listItem.className = 'list-item asset-item';
                listItem.setAttribute('data-belongs-to', currentLocationIndex);
                listItem.setAttribute('data-index', i);
                
                if (currentLocationIndex === 0) {
                    listItem.style.display = 'none';
                }
                
                listItem.innerHTML = `
                    <div class="item-text"><span class="asset-number">${assetCounter}. </span>${item}</div>
                `;
            }
            
            itemsContainer.appendChild(listItem);
        }
        
        fragment.appendChild(itemsContainer);
        dataList.appendChild(fragment);
        
        setupEventDelegation();
    }, 10);
}

function renderBatchedItems() {
    let batchSize = 100;
    let currentBatch = 0;
    let totalBatches = Math.ceil(items.length / batchSize);
    
    dataList.innerHTML = '<div class="loading-indicator">数据加载中，请稍候...</div>';
    
    function renderBatch() {
        if (currentBatch >= totalBatches) {
            setupEventDelegation();
            return;
        }
        
        const fragment = document.createDocumentFragment();
        let startIndex = currentBatch * batchSize;
        let endIndex = Math.min(startIndex + batchSize, items.length);
        let currentLocationIndex = -1;
        let assetCounter = 0;
        
        for (let i = startIndex - 1; i >= 0; i--) {
            if (items[i].startsWith('@')) {
                currentLocationIndex = i;
                
                for (let j = i + 1; j < startIndex; j++) {
                    if (!items[j].startsWith('@')) {
                        assetCounter++;
                    } else {
                        break;
                    }
                }
                break;
            }
        }
        
        if (currentBatch === 0) {
            dataList.innerHTML = '';
        }
        
        for (let i = startIndex; i < endIndex; i++) {
            const item = items[i];
            const listItem = document.createElement('div');
            
            if (item.startsWith('@')) {
                currentLocationIndex = i;
                assetCounter = 0;
                listItem.className = 'list-item location-item';
                listItem.setAttribute('data-location-index', i);
                listItem.setAttribute('data-index', i);
                
                listItem.innerHTML = `
                    <div class="item-text">
                        <span class="collapse-icon">${i === 0 ? '▶' : '▼'}</span> ${item}
                    </div>
                    <button class="location-edit-btn" data-location="${i}" title="批量编辑此地点及资产">✏️</button>
                `;
            } else {
                assetCounter++;
                listItem.className = 'list-item asset-item';
                listItem.setAttribute('data-belongs-to', currentLocationIndex);
                listItem.setAttribute('data-index', i);
                
                if (currentLocationIndex === 0) {
                    listItem.style.display = 'none';
                }
                
                listItem.innerHTML = `
                    <div class="item-text"><span class="asset-number">${assetCounter}. </span>${item}</div>
                `;
            }
            
            fragment.appendChild(listItem);
        }
        
        dataList.appendChild(fragment);
        
        currentBatch++;
        setTimeout(renderBatch, 0);
    }
    
    setTimeout(renderBatch, 0);
}

function handleListClick(e) {
    try {
        const listItem = e.target.closest('.list-item');
        if (!listItem) return;
        
        if (listItem.classList.contains('location-item') && 
            !e.target.classList.contains('location-edit-btn')) {
            
            const locationIndex = parseInt(listItem.getAttribute('data-location-index'));
            const assets = document.querySelectorAll(`[data-belongs-to="${locationIndex}"]`);
            const collapseIcon = listItem.querySelector('.collapse-icon');
            
            console.log(`点击地点行 ${locationIndex}，找到 ${assets.length} 个资产项`);
            
            if (assets.length === 0) return;
            
            const isCollapsed = assets[0].style.display === 'none';
            
            assets.forEach(asset => {
                asset.style.display = isCollapsed ? 'flex' : 'none';
            });
            
            collapseIcon.textContent = isCollapsed ? '▼' : '▶';
        }
        
        if (e.target.classList.contains('location-edit-btn')) {
            e.stopPropagation();
            const locationIndex = parseInt(e.target.getAttribute('data-location'));
            openLocationEditor(locationIndex);
        }
    } catch (error) {
        console.error('点击事件处理出错:', error);
    }
}

function handleListDblClick(e) {
    const listItem = e.target.closest('.list-item');
    if (!listItem) return;
    
    if (e.target.classList.contains('action-btn') || 
        e.target.classList.contains('collapse-icon') ||
        e.target.classList.contains('location-edit-btn')) {
        return;
    }
    
    const text = listItem.querySelector('.item-text').textContent.trim();
    copyToClipboard(text);
    showToast('已复制到剪贴板！');
}

let touchStartX = 0;
let touchCurrentX = 0;
let isSwiping = false;
let activeItem = null;

function handleListMouseDown(e) {
    const listItem = e.target.closest('.list-item');
    if (!listItem) return;
    
    if (e.target.classList.contains('action-btn') || 
        e.target.classList.contains('collapse-icon') ||
        e.target.classList.contains('location-edit-btn')) {
        return;
    }
    
    touchStartX = e.clientX;
    touchCurrentX = e.clientX;
    isSwiping = true;
    activeItem = listItem;
}

function handleListMouseMove(e) {
    if (!isSwiping || !activeItem) return;
    
    touchCurrentX = e.clientX;
    const diffX = touchCurrentX - touchStartX;
    
    if (Math.abs(diffX) < 100) {
        activeItem.style.transform = `translateX(${diffX}px)`;
        
        if (diffX > 30) {
            activeItem.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
        } else if (diffX < -30) {
            activeItem.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
        } else {
            activeItem.style.backgroundColor = '';
        }
    }
}

function handleListMouseUp(e) {
    if (!isSwiping || !activeItem) return;
    
    const diffX = touchCurrentX - touchStartX;
    const itemIndex = parseInt(activeItem.getAttribute('data-index'));
    
    activeItem.style.transition = 'transform 0.3s, background-color 0.3s';
    activeItem.style.transform = 'translateX(0)';
    activeItem.style.backgroundColor = '';
    
    if (Math.abs(diffX) > 50) {
        if (diffX > 50) {
            if (activeItem.classList.contains('location-item')) {
                if (confirm('确定要删除此地点及其所有资产吗？此操作不可恢复！')) {
                    deleteLocationAndAssets(itemIndex);
                }
            } else {
                if (confirm('确定要删除这条记录吗？')) {
                    deleteItem(itemIndex);
                }
            }
        } else if (diffX < -50) {
            currentEditIndex = itemIndex;
            editInput.value = items[itemIndex];
            editModal.style.display = 'block';
            overlay.style.display = 'block';
            
            setTimeout(() => {
                editInput.focus();
                editInput.selectionStart = editInput.value.length;
                editInput.selectionEnd = editInput.value.length;
            }, 50);
        }
    }
    
    setTimeout(() => {
        if (activeItem) {
            activeItem.style.transition = '';
        }
    }, 300);
    
    isSwiping = false;
    activeItem = null;
}

function handleListMouseLeave(e) {
    if (!isSwiping || !activeItem) return;
    
    activeItem.style.transition = 'transform 0.3s, background-color 0.3s';
    activeItem.style.transform = 'translateX(0)';
    activeItem.style.backgroundColor = '';
    
    setTimeout(() => {
        if (activeItem) {
            activeItem.style.transition = '';
        }
    }, 300);
    
    isSwiping = false;
    activeItem = null;
}

function handleListTouchStart(e) {
    const listItem = e.target.closest('.list-item');
    if (!listItem) return;
    
    if (e.target.classList.contains('action-btn') || 
        e.target.classList.contains('collapse-icon') ||
        e.target.classList.contains('location-edit-btn')) {
        return;
    }
    
    touchStartX = e.touches[0].clientX;
    touchCurrentX = e.touches[0].clientX;
    isSwiping = true;
    activeItem = listItem;
}

function handleListTouchMove(e) {
    if (!isSwiping || !activeItem) return;
    
    touchCurrentX = e.touches[0].clientX;
    const diffX = touchCurrentX - touchStartX;
    
    if (Math.abs(diffX) < 100) {
        activeItem.style.transform = `translateX(${diffX}px)`;
        
        if (diffX > 30) {
            activeItem.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
        } else if (diffX < -30) {
            activeItem.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
        } else {
            activeItem.style.backgroundColor = '';
        }
    }
}

function handleListTouchEnd(e) {
    if (!isSwiping || !activeItem) return;
    
    const diffX = touchCurrentX - touchStartX;
    const itemIndex = parseInt(activeItem.getAttribute('data-index'));
    
    activeItem.style.transition = 'transform 0.3s, background-color 0.3s';
    activeItem.style.transform = 'translateX(0)';
    activeItem.style.backgroundColor = '';
    
    if (Math.abs(diffX) > 50) {
        if (diffX > 50) {
            if (activeItem.classList.contains('location-item')) {
                if (confirm('确定要删除此地点及其所有资产吗？此操作不可恢复！')) {
                    deleteLocationAndAssets(itemIndex);
                }
            } else {
                if (confirm('确定要删除这条记录吗？')) {
                    deleteItem(itemIndex);
                }
            }
        } else if (diffX < -50) {
            currentEditIndex = itemIndex;
            editInput.value = items[itemIndex];
            editModal.style.display = 'block';
            overlay.style.display = 'block';
            
            setTimeout(() => {
                editInput.focus();
                editInput.selectionStart = editInput.value.length;
                editInput.selectionEnd = editInput.value.length;
            }, 50);
        }
    }
    
    setTimeout(() => {
        if (activeItem) {
            activeItem.style.transition = '';
        }
    }, 300);
    
    isSwiping = false;
    activeItem = null;
}

function handleListTouchCancel(e) {
    if (!isSwiping || !activeItem) return;
    
    activeItem.style.transition = 'transform 0.3s, background-color 0.3s';
    activeItem.style.transform = 'translateX(0)';
    activeItem.style.backgroundColor = '';
    
    setTimeout(() => {
        if (activeItem) {
            activeItem.style.transition = '';
        }
    }, 300);
    
    isSwiping = false;
    activeItem = null;
}

function openLocationEditor(locationIndex) {
    if (!items[locationIndex] || !items[locationIndex].startsWith('@')) {
        return;
    }
    
    const locationData = [items[locationIndex]];
    let nextIndex = locationIndex + 1;
    
    while (nextIndex < items.length && !items[nextIndex].startsWith('@')) {
        locationData.push(items[nextIndex]);
        nextIndex++;
    }
    
    locationEditInput.value = locationData.join('\n');
    
    currentLocationEditIndex = locationIndex;
    
    locationEditModal.style.display = 'block';
    overlay.style.display = 'block';
    
    setTimeout(() => {
        locationEditInput.focus();
        locationEditInput.selectionStart = locationEditInput.value.length;
        locationEditInput.selectionEnd = locationEditInput.value.length;
    }, 100);
}

function saveLocationEdit() {
    const editedText = locationEditInput.value.trim();
    if (!editedText) {
        showErrorToast('内容不能为空');
        return;
    }
    
    const editedItems = editedText.split('\n')
        .filter(item => item.trim())
        .map(item => normalizeSpaces(item.trim()));
    
    if (editedItems.length === 0) {
        showErrorToast('内容不能为空');
        return;
    }
    
    if (!editedItems[0].startsWith('@')) {
        showErrorToast('第一行必须是地点行（以@开头）');
        return;
    }
    
    const transaction = db.transaction(['items'], 'readwrite');
    const store = transaction.objectStore('items');
    
    const getAllRequest = store.getAll();
    
    getAllRequest.onsuccess = () => {
        const allDBItems = getAllRequest.result;
        const allItems = [];
        
        for (const item of allDBItems) {
            if (item.value !== undefined) {
                allItems.push(item.value);
            } else {
                console.error('找到异常数据项，没有value字段:', item);
            }
        }
        
        let startIndex = currentLocationEditIndex;
        let endIndex = startIndex + 1;
        
        while (endIndex < allItems.length && !allItems[endIndex].startsWith('@')) {
            endIndex++;
        }
        
        const deleteCount = endIndex - startIndex;
        
        console.log(`编辑地点位置: ${startIndex} 到 ${endIndex}, 共 ${deleteCount} 项`);
        console.log('编辑前数据:', allItems.slice(startIndex, endIndex));
        console.log('编辑后数据:', editedItems);
        
        store.clear().onsuccess = () => {
            try {
                let addedCount = 0;
                let errorCount = 0;
                
                for (let i = 0; i < startIndex; i++) {
                    try {
                        store.add({ value: allItems[i] });
                        addedCount++;
                    } catch(e) {
                        console.error(`添加编辑前数据出错 [${i}]:`, e);
                        errorCount++;
                    }
                }
                
                for (let i = 0; i < editedItems.length; i++) {
                    try {
                        store.add({ value: editedItems[i] });
                        addedCount++;
                    } catch(e) {
                        console.error(`添加编辑后数据出错 [${i}]:`, e);
                        errorCount++;
                    }
                }
                
                for (let i = endIndex; i < allItems.length; i++) {
                    try {
                        store.add({ value: allItems[i] });
                        addedCount++;
                    } catch(e) {
                        console.error(`添加剩余数据出错 [${i}]:`, e);
                        errorCount++;
                    }
                }
                
                console.log(`数据处理完成: 成功 ${addedCount} 项, 失败 ${errorCount} 项`);
                
                transaction.oncomplete = () => {
                    loadItems();
                    locationEditModal.style.display = 'none';
                    overlay.style.display = 'none';
                    showToast('地点及其资产已更新');
                };
                
                transaction.onerror = (event) => {
                    console.error('保存地点编辑事务出错:', event);
                    showErrorToast('保存失败: ' + (event.target.error?.message || '数据库错误'));
                };
            } catch(error) {
                console.error('批量保存地点编辑出错:', error);
                showErrorToast('保存失败: ' + error.message);
            }
        };
    };
}

function normalizeSpaces(text) {
    return text.replace(/\s{2,}/g, ' ');
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

function copyToClipboard(text) {
    text = text.replace(/[▼▶]/g, '').trim();
    
    text = text.replace(/^\d+\.\s+/g, '');
    
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    textarea.select();
    document.execCommand('copy');
    
    document.body.removeChild(textarea);
}

function showSuggestions(text) {
    text = text.trim();
    if (!text) {
        suggestions.style.display = 'none';
        return;
    }

    const reversedItems = [...items].reverse();
    const uniqueItems = [...new Set(reversedItems)];
    
    const filtered = uniqueItems.filter(item => 
        item.toLowerCase().includes(text.toLowerCase())
    );
    
    if (filtered.length === 0) {
        suggestions.style.display = 'none';
        return;
    }

    suggestions.innerHTML = filtered.map(item => 
        `<div class="suggestion-item">${item}</div>`
    ).join('');
    
    suggestions.style.display = 'block';

    const suggestionItems = document.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
        item.addEventListener('click', () => {
            itemInput.value = item.textContent;
            suggestions.style.display = 'none';
            itemInput.focus();
        });
    });
}

document.addEventListener('click', (e) => {
    if (!suggestions.contains(e.target) && e.target !== itemInput) {
        suggestions.style.display = 'none';
    }
});

itemInput.addEventListener('input', (e) => {
    showSuggestions(e.target.value);
});

function scrollToBottom() {
    dataList.scrollTop = dataList.scrollHeight;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(40, 167, 69, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => document.body.removeChild(toast), 500);
    }, 2000);
}

function checkDuplicateLocation(newItem) {
    if (!newItem.startsWith('@')) {
        return false;
    }
    
    const newLocation = newItem.substring(1, newItem.indexOf(' ') > 0 ? newItem.indexOf(' ') : newItem.length);
    
    return items.some(item => {
        if (item.startsWith('@')) {
            const existingLocation = item.substring(1, item.indexOf(' ') > 0 ? item.indexOf(' ') : item.length);
            return existingLocation === newLocation;
        }
        return false;
    });
}

function addNewItem() {
    let newItem = itemInput.value.trim();
    if (newItem) {
        try {
            newItem = normalizeSpaces(newItem);
            
            if (checkDuplicateLocation(newItem)) {
                showErrorToast('该地点已存在，请勿重复添加！');
                return;
            }
            
            console.log('添加新项目:', newItem);
            saveItem(newItem);
            itemInput.value = '';
            suggestions.style.display = 'none';
            itemInput.focus();
            
            setTimeout(() => {
                scrollToBottom();
                showToast('添加成功！');
            }, 200);
        } catch (error) {
            console.error('添加新项目时出错:', error);
            showErrorToast('添加失败，请重试');
        }
    }
}

function exportToTxt() {
    if (items.length === 0) {
        showErrorToast('没有数据可导出！');
        return;
    }

    let startIndex = -1;
    let foundFirst = false;
    for (let i = 0; i < items.length; i++) {
        if (items[i].startsWith('@')) {
            if (!foundFirst) {
                foundFirst = true;
            } else {
                startIndex = i;
                break;
            }
        }
    }

    if (startIndex === -1) {
        showErrorToast('没有可导出的数据！');
        return;
    }

    const exportItems = items.slice(startIndex).map(item => normalizeSpaces(item));
    const content = exportItems.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = '数据表.txt';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('导出成功！');
}

exportButton.addEventListener('click', exportToTxt);

function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(220, 53, 69, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
}

const bulkUpdateItems = (values) => {
    return new Promise((resolve) => {
        const transaction = db.transaction(['items'], 'readwrite');
        const store = transaction.objectStore('items');
        
        const newLocations = new Set();
        const duplicateLocations = [];
        
        const processedValues = values.map(value => normalizeSpaces(value.trim()));
        
        for (const value of processedValues) {
            if (value.startsWith('@')) {
                const location = value.substring(1, value.indexOf(' ') > 0 ? value.indexOf(' ') : value.length);
                
                if (newLocations.has(location)) {
                    duplicateLocations.push(location);
                    continue;
                }
                
                newLocations.add(location);
            }
        }
        
        if (duplicateLocations.length > 0) {
            showErrorToast(`发现重复地点: "${duplicateLocations.join('", "')}"，请修正后重试`);
            resolve(false);
            return;
        }
        
        showToast('正在处理数据...');
        
    store.clear().onsuccess = () => {
        let addedCount = 0;
        const addItems = processedValues.map(value => {
            return new Promise((resolve) => {
                if (value) {
                    const request = store.add({ value: value });
                    request.onsuccess = () => {
                        addedCount++;
                        resolve();
                    };
                    request.onerror = () => {
                        console.error('添加数据失败:', value);
                        resolve();
                    };
                } else {
                    resolve();
                }
            });
        });
        
        Promise.all(addItems).then(() => {
            transaction.oncomplete = () => {
                loadItems();
                showToast(`批量修改成功，共更新${addedCount}条数据！`);
            };
        });
    };
    return true;
})
}

batchEditButton.addEventListener('click', () => {
    editAllModal.style.display = 'block';
    overlay.style.display = 'block';
    editAllInput.value = items.join('\n');
    
    setTimeout(() => {
        editAllInput.scrollTop = editAllInput.scrollHeight;
    }, 100);
});

saveEditAllButton.addEventListener('click', () => {
    const editAllText = editAllInput.value;
    const editAllItems = editAllText.split('\n').filter(item => item.trim());
    
    if (editAllItems.length === 0) {
        showErrorToast('请输入要修改的数据！');
        return;
    }
    
    if (bulkUpdateItems(editAllItems)) {
        editAllModal.style.display = 'none';
        overlay.style.display = 'none';
        editAllInput.value = '';
    }
});

saveEditButton.addEventListener('click', () => {
    let newItem = editInput.value.trim();
    if (newItem) {
        newItem = normalizeSpaces(newItem);
        updateItem(currentEditIndex, newItem);
        editInput.value = '';
        editModal.style.display = 'none';
        overlay.style.display = 'none';
    }
});

overlay.addEventListener('click', () => {
    editModal.style.display = 'none';
    importModal.style.display = 'none';
    editAllModal.style.display = 'none';
    guideModal.style.display = 'none';
    searchModal.style.display = 'none';
    locationEditModal.style.display = 'none';
    overlay.style.display = 'none';
});

const bulkSaveItems = (values) => {
    return new Promise((resolve) => {
        const transaction = db.transaction(['items'], 'readwrite');
        const store = transaction.objectStore('items');
        
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
            const existingItems = getAllRequest.result.map(item => item.value);
            const existingLocations = new Set();
            const newLocations = new Set();
            const duplicateLocations = [];
            
            const processedValues = values.map(value => normalizeSpaces(value.trim()));
            
            existingItems.forEach(item => {
                if (item.startsWith('@')) {
                    const location = item.substring(1, item.indexOf(' ') > 0 ? item.indexOf(' ') : item.length);
                    existingLocations.add(location);
                }
            });
            
            for (const value of processedValues) {
                if (value.startsWith('@')) {
                    const location = value.substring(1, value.indexOf(' ') > 0 ? value.indexOf(' ') : value.length);
                    
                    if (existingLocations.has(location)) {
                        duplicateLocations.push(`${location}(已存在)`);
                        continue;
                    }
                    
                    if (newLocations.has(location)) {
                        duplicateLocations.push(`${location}(重复)`);
                        continue;
                    }
                    
                    newLocations.add(location);
                }
            }
            
            if (duplicateLocations.length > 0) {
                showErrorToast(`发现重复地点: "${duplicateLocations.join('", "')}"，请修正后重试`);
                resolve(false);
                return;
            }
            
            showToast('正在导入数据...');
            
            let addedCount = 0;
            const addItems = processedValues.map(value => {
                return new Promise((resolve) => {
                if (value) {
                                const request = store.add({ value: value });
                                request.onsuccess = () => {
                                    addedCount++;
                                    resolve();
                                };
                                request.onerror = () => {
                                    console.error('添加数据失败:', value);
                                    resolve();
                                };
                            } else {
                                resolve();
                            }
                        });
                    });
                    
                    Promise.all(addItems).then(() => {
            transaction.oncomplete = () => {
                loadItems();
                            showToast(`批量添加成功，共添加${addedCount}条数据！`);
                            resolve(true);
            };
                    });
                };
            });
        };

batchAddButton.addEventListener('click', () => {
    importModal.style.display = 'block';
    overlay.style.display = 'block';
    importInput.value = '';
});

savebatchAddButton.addEventListener('click', async () => {
    const importText = importInput.value;
    const importItems = importText.split('\n').filter(item => item.trim());
    
    if (importItems.length === 0) {
        showErrorToast('请输入要导入的数据！');
        return;
    }
    
    const success = await bulkSaveItems(importItems);
    if (success) {
            importModal.style.display = 'none';
            overlay.style.display = 'none';
            importInput.value = '';
            setTimeout(() => {
                scrollToBottom();
            }, 100);
            }
});

overlay.addEventListener('click', () => {
    editModal.style.display = 'none';
    importModal.style.display = 'none';
    editAllModal.style.display = 'none';
    guideModal.style.display = 'none';
    searchModal.style.display = 'none';
    backupModal.style.display = 'none';
    locationEditModal.style.display = 'none';
    overlay.style.display = 'none';
});

const deleteAllItems = () => {
    let startIndex = -1;
    let foundFirst = false;
    for (let i = 0; i < items.length; i++) {
        if (items[i].startsWith('@')) {
            if (!foundFirst) {
                foundFirst = true;
            } else {
                startIndex = i;
                break;
            }
        }
    }

    if (startIndex === -1) {
        showErrorToast('没有可删除的数据！');
        return;
    }

    const transaction = db.transaction(['items'], 'readwrite');
    const store = transaction.objectStore('items');
    
    const getAllRequest = store.getAll();
    
    getAllRequest.onsuccess = () => {
        store.clear().onsuccess = () => {
            const templateItems = items.slice(0, startIndex);
            
            templateItems.forEach(value => {
                store.add({ value });
            });
            
            transaction.oncomplete = () => {
                loadItems();
                        showToast('删除成功！');
                    };
                };
            };
};

deleteAllButton.addEventListener('click', () => {
    let startIndex = -1;
    let foundFirst = false;
    for (let i = 0; i < items.length; i++) {
        if (items[i].startsWith('@')) {
            if (!foundFirst) {
                foundFirst = true;
            } else {
                startIndex = i;
                break;
            }
        }
    }
    
    if (startIndex === -1) {
        showErrorToast('没有可删除的数据！');
        return;
    }
    
    if (confirm('确定要删除所有数据吗？（模板资产将保留）此操作不可恢复！')) {
        deleteAllItems();
    }
});

closeGuideButton.addEventListener('click', () => {
    guideModal.style.display = 'none';
    overlay.style.display = 'none';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        editModal.style.display = 'none';
        importModal.style.display = 'none';
        editAllModal.style.display = 'none';
        guideModal.style.display = 'none';
        searchModal.style.display = 'none';
        locationEditModal.style.display = 'none';
        overlay.style.display = 'none';
    }
});

function toggleAllLocations() {
    try {
        const locationItems = document.querySelectorAll('.location-item');
        if (locationItems.length === 0) {
            console.log('未找到地点行，无法执行折叠/展开操作');
            return;
        }
        
        isAllCollapsed = !isAllCollapsed;
        console.log(`执行${isAllCollapsed ? '折叠' : '展开'}所有地点操作`);
        
        locationItems.forEach(item => {
            if (item.getAttribute('data-location-index') === '0') {
                return;
            }
            
            const locationIndex = item.getAttribute('data-location-index');
            const assets = document.querySelectorAll(`[data-belongs-to="${locationIndex}"]`);
            const collapseIcon = item.querySelector('.collapse-icon');
            
            if (assets.length > 0) {
                assets.forEach(asset => {
                    asset.style.display = isAllCollapsed ? 'none' : 'flex';
                });
                collapseIcon.textContent = isAllCollapsed ? '▶' : '▼';
            }
        });
        
        collapseAllButton.textContent = isAllCollapsed ? '▶' : '▼';
    } catch (error) {
        console.error('折叠/展开所有地点时出错:', error);
    }
}

collapseAllButton.addEventListener('click', toggleAllLocations);

setInterval(() => {
    if (appSettings.autoReleaseMemory && items.length > 500) {
        console.log('执行定期内存清理...');
        nodeCache = {};
        
        if (perfMonitor.enabled && perfMonitor.memoryUsage.length > 0) {
            const latestMemory = perfMonitor.memoryUsage[perfMonitor.memoryUsage.length - 1];
            if (latestMemory.used > 200) {
                perfMonitor.releaseResources();
            }
        }
    }
}, 60000);

itemInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const newItem = itemInput.value.trim();
        if (newItem) {
            addNewItem();
        }
    }
});

editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        saveEditButton.click();
    }
});

saveLocationEditButton.addEventListener('click', saveLocationEdit);

searchButton.addEventListener('click', () => {
    searchModal.style.display = 'block';
    overlay.style.display = 'block';
    searchInput.value = '';
    searchInput.focus();
    searchResults.innerHTML = '<div class="search-count">请输入搜索关键词</div>';
});

searchInput.addEventListener('input', (e) => {
    searchAssets(e.target.value);
});

closeSearchButton.addEventListener('click', () => {
    searchModal.style.display = 'none';
    overlay.style.display = 'none';
});

let perfMonitor = {
    lastRefreshTime: 0,
    frameCount: 0,
    memoryUsage: [],
    enabled: false,
    
    init() {
        this.lastRefreshTime = performance.now();
        this.frameCount = 0;
        this.memoryUsage = [];
        this.enabled = false;
    },
    
    record() {
        if (!this.enabled) return;
        
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastRefreshTime >= 1000) {
            const fps = Math.round(this.frameCount * 1000 / (currentTime - this.lastRefreshTime));
            console.log(`性能监控: FPS = ${fps}`);
            
            if (window.performance && window.performance.memory) {
                const memory = window.performance.memory;
                const memoryUsed = Math.round(memory.usedJSHeapSize / (1024 * 1024));
                const memoryTotal = Math.round(memory.totalJSHeapSize / (1024 * 1024));
                console.log(`内存使用: ${memoryUsed}MB / ${memoryTotal}MB`);
                
                this.memoryUsage.push({
                    time: new Date(),
                    used: memoryUsed,
                    total: memoryTotal
                });
                
                if (this.memoryUsage.length > 10) {
                    this.memoryUsage.shift();
                }
            }
            
            this.frameCount = 0;
            this.lastRefreshTime = currentTime;
            
            this.checkMemory();
        }
        
        requestAnimationFrame(() => this.record());
    },
    
    checkMemory() {
        if (this.memoryUsage.length < 2) return;
        
        const latest = this.memoryUsage[this.memoryUsage.length - 1];
        const previous = this.memoryUsage[this.memoryUsage.length - 2];
        
        if (latest.used > previous.used * 1.2 && latest.used > 200) {
            console.log('检测到内存使用量大幅增加，尝试优化...');
            this.releaseResources();
        }
    },
    
    releaseResources() {
        nodeCache = {};
        
        if (dataList.children.length > 500) {
            setupEventDelegation();
        }
        
        const largeArray = [];
        for (let i = 0; i < 10000; i++) {
            largeArray.push(new Array(10000).fill(0));
        }
        largeArray.length = 0;
    },
    
    enable() {
        this.enabled = true;
        this.record();
        console.log('性能监控已启用');
    },
    
    disable() {
        this.enabled = false;
        console.log('性能监控已停用');
    }
};

let nodeCache = {};

function getNode(selector) {
    if (!nodeCache[selector]) {
        nodeCache[selector] = document.querySelector(selector);
    }
    return nodeCache[selector];
}

let appSettings = {
    usePagination: false,
    pageSize: 200,
    currentPage: 1,
    batchSize: 100,
    lazyLoadImages: true,
    autoReleaseMemory: true,
    
    adjustForDataSize() {
        if (items.length > 1000) {
            this.usePagination = true;
            this.pageSize = 200;
            this.batchSize = 100;
            perfMonitor.enable();
        } else if (items.length > 500) {
            this.usePagination = false;
            this.batchSize = 100;
            perfMonitor.disable();
        } else {
            this.usePagination = false;
            this.batchSize = items.length;
            perfMonitor.disable();
        }
    }
};

perfMonitor.init();

addScrollBottomButton();

window.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，初始化应用');
    
    initDB();
    
    itemInput.addEventListener('input', (e) => {
        showSuggestions(e.target.value);
    });
    
    itemInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const newItem = itemInput.value.trim();
            if (newItem) {
                addNewItem();
            }
        }
    });
    
    exportButton.addEventListener('click', exportToTxt);
    batchAddButton.addEventListener('click', () => {
        importModal.style.display = 'block';
        overlay.style.display = 'block';
        importInput.value = '';
    });
});

function checkAndRepairDisplay() {
    console.log('检查数据显示状态...');
    
    if (dataList.children.length === 0 && items.length > 0) {
        console.log('检测到数据未显示，重新渲染');
        renderSimpleList();
        return true;
    }
    
    const locationItems = document.querySelectorAll('.location-item');
    locationItems.forEach(item => {
        const locationIndex = item.getAttribute('data-location-index');
        const assets = document.querySelectorAll(`[data-belongs-to="${locationIndex}"]`);
        const collapseIcon = item.querySelector('.collapse-icon');
        
        if (assets.length > 0) {
            const isHidden = assets[0].style.display === 'none';
            collapseIcon.textContent = isHidden ? '▶' : '▼';
        }
    });
    
    return false;
}

function showErrorToast(message) {
    console.error('错误:', message);
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(220, 53, 69, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
    
    setTimeout(checkAndRepairDisplay, 1000);
}

function setupBackup() {
    loadBackupSettings();
    
    loadBackups();
    
    setupBackupTimer();
    
    addBackupButton();
    
    manualBackupButton.addEventListener('click', () => createBackup(false));
    restoreBackupButton.addEventListener('click', promptRestoreBackup);
    exportBackupButton.addEventListener('click', exportBackup);
    importBackupButton.addEventListener('click', () => backupFileInput.click());
    backupFileInput.addEventListener('change', importBackup);
    closeBackupModalButton.addEventListener('click', () => {
        backupModal.style.display = 'none';
        overlay.style.display = 'none';
    });
    
    autoBackupEnabledCheckbox.addEventListener('change', updateBackupSettings);
    backupFrequencySelect.addEventListener('change', updateBackupSettings);
    backupRetentionSelect.addEventListener('change', updateBackupSettings);
    
    console.log('备份系统已初始化');
}

function addScrollBottomButton() {
    const scrollBottomButton = document.createElement('button');
    scrollBottomButton.id = 'scrollBottomButton';
    scrollBottomButton.title = '回到列表底部';
    scrollBottomButton.textContent = '↓';
    
    scrollBottomButton.addEventListener('mouseover', () => {
        scrollBottomButton.style.backgroundColor = 'rgba(40, 167, 69, 1)';
        scrollBottomButton.style.transform = 'translateY(-2px)';
        scrollBottomButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    });
    
    scrollBottomButton.addEventListener('mouseout', () => {
        scrollBottomButton.style.backgroundColor = 'rgba(40, 167, 69, 0.8)';
        scrollBottomButton.style.transform = '';
        scrollBottomButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    });
    
    scrollBottomButton.addEventListener('click', () => {
        scrollToBottom();
        showToast('已滚动到底部');
    });
    
    document.body.appendChild(scrollBottomButton);
}

function addBackupButton() {
    const backupButton = document.createElement('button');
    backupButton.id = 'backupButton';
    backupButton.title = '数据备份与恢复';
    backupButton.textContent = '💾';
    backupButton.style.cssText = `
        position: fixed;
        left: 20px;
        bottom: 20px;
        width: 40px;
        height: 40px;
        background-color: rgba(0, 123, 255, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    backupButton.addEventListener('mouseover', () => {
        backupButton.style.backgroundColor = 'rgba(0, 123, 255, 1)';
        backupButton.style.transform = 'translateY(-2px)';
        backupButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    });
    
    backupButton.addEventListener('mouseout', () => {
        backupButton.style.backgroundColor = 'rgba(0, 123, 255, 0.8)';
        backupButton.style.transform = '';
        backupButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    });
    
    backupButton.addEventListener('click', openBackupModal);
    
    document.body.appendChild(backupButton);
}

function openBackupModal() {
    updateBackupsList();
    updateBackupUI();
    
    backupModal.style.display = 'block';
    overlay.style.display = 'block';
}

function updateBackupUI() {
    lastBackupTimeSpan.textContent = backupSettings.lastBackupTime 
        ? new Date(backupSettings.lastBackupTime).toLocaleString() 
        : '无';
        
    backupStatusSpan.textContent = backupSettings.enabled ? '已启用' : '已禁用';
    autoBackupEnabledCheckbox.checked = backupSettings.enabled;
    backupFrequencySelect.value = backupSettings.frequency.toString();
    backupRetentionSelect.value = backupSettings.retention.toString();
}

function loadBackupSettings() {
    try {
        const savedSettings = localStorage.getItem('backupSettings');
        if (savedSettings) {
            backupSettings = JSON.parse(savedSettings);
            console.log('已加载备份设置:', backupSettings);
        }
    } catch (error) {
        console.error('加载备份设置出错:', error);
        backupSettings = {
            enabled: true,
            frequency: 86400000,
            retention: 3,
            lastBackupTime: null
        };
    }
}

function saveBackupSettings() {
    try {
        localStorage.setItem('backupSettings', JSON.stringify(backupSettings));
        console.log('备份设置已保存');
    } catch (error) {
        console.error('保存备份设置出错:', error);
        showErrorToast('保存备份设置失败');
    }
}

function updateBackupSettings() {
    backupSettings.enabled = autoBackupEnabledCheckbox.checked;
    backupSettings.frequency = parseInt(backupFrequencySelect.value);
    backupSettings.retention = parseInt(backupRetentionSelect.value);
    
    saveBackupSettings();
    setupBackupTimer();
    updateBackupUI();
    
    showToast('备份设置已更新');
}

function setupBackupTimer() {
    if (backupTimer) {
        clearInterval(backupTimer);
        backupTimer = null;
    }
    
    if (backupSettings.enabled) {
        backupTimer = setInterval(() => {
            console.log('执行自动备份...');
            createBackup(true);
        }, backupSettings.frequency);
        
        console.log(`自动备份已设置，频率: ${backupSettings.frequency / (1000 * 60 * 60)} 小时`);
    } else {
        console.log('自动备份已禁用');
    }
}

function createBackup(isAuto = false) {
    try {
        if (!db) {
            showErrorToast('数据库未准备好，无法备份');
            return;
        }
        
        const transaction = db.transaction(['items'], 'readonly');
        const store = transaction.objectStore('items');
        const request = store.getAll();
        
        request.onsuccess = () => {
            const currentData = request.result;
            
            if (!currentData || currentData.length === 0) {
                showErrorToast('没有数据可备份');
                return;
            }
            
            const timestamp = new Date().getTime();
            const backupName = `backup_${timestamp}`;
            const backup = {
                id: backupName,
                timestamp: timestamp,
                description: isAuto ? '自动备份' : '手动备份',
                data: currentData,
                itemCount: currentData.length
            };
            
            try {
                localStorage.setItem(backupName, JSON.stringify(backup));
                
                loadBackups();
                
                backupSettings.lastBackupTime = timestamp;
                saveBackupSettings();
                
                manageBackups();
                
                console.log(`备份创建成功: ${backupName}, 包含 ${currentData.length} 条记录`);
                
                if (!isAuto) {
                    showToast('备份创建成功！');
                    updateBackupUI();
                    updateBackupsList();
                }
            } catch (error) {
                console.error('保存备份到localStorage出错:', error);
                
                if (error.name === 'QuotaExceededError') {
                    showErrorToast('存储空间不足，尝试导出到文件');
                    exportBackupToFile(backup);
                } else {
                    showErrorToast('创建备份失败: ' + error.message);
                }
            }
        };
        
        request.onerror = (event) => {
            console.error('获取备份数据出错:', event.target.error);
            showErrorToast('获取备份数据失败');
        };
    } catch (error) {
        console.error('创建备份时出错:', error);
        showErrorToast('创建备份失败');
    }
}

function exportBackupToFile(backup) {
    try {
        const backupBlob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(backupBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `快速库存清单_备份_${new Date(backup.timestamp).toLocaleString().replace(/[\/\s:]/g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('备份已导出到文件');
    } catch (error) {
        console.error('导出备份到文件出错:', error);
        showErrorToast('导出备份失败: ' + error.message);
    }
}

function manageBackups() {
    try {
        backups.sort((a, b) => b.timestamp - a.timestamp);
        
        if (backups.length > backupSettings.retention) {
            console.log(`备份数量(${backups.length})超过保留限制(${backupSettings.retention})，删除旧备份`);
            
            const backupsToRemove = backups.slice(backupSettings.retention);
            backupsToRemove.forEach(backup => {
                try {
                    localStorage.removeItem(backup.id);
                    console.log(`已删除旧备份: ${backup.id}`);
                } catch (error) {
                    console.error(`删除备份 ${backup.id} 出错:`, error);
                }
            });
            
            loadBackups();
        }
    } catch (error) {
        console.error('管理备份数量出错:', error);
    }
}

function loadBackups() {
    try {
        backups = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            if (key.startsWith('backup_')) {
                try {
                    const backup = JSON.parse(localStorage.getItem(key));
                    backups.push(backup);
                } catch (error) {
                    console.error(`解析备份 ${key} 出错:`, error);
                }
            }
        }
        
        backups.sort((a, b) => b.timestamp - a.timestamp);
        console.log(`已加载 ${backups.length} 个备份`);
        
        return backups;
    } catch (error) {
        console.error('加载备份列表出错:', error);
        return [];
    }
}

function updateBackupsList() {
    try {
        backupsList.innerHTML = '';
        
        if (backups.length === 0) {
            backupsList.innerHTML = '<div class="no-backup">暂无备份</div>';
            return;
        }
        
        backups.forEach(backup => {
            const backupItem = document.createElement('div');
            backupItem.className = 'backup-item';
            
            const dateStr = new Date(backup.timestamp).toLocaleString();
            const itemCount = backup.itemCount || '未知';
            
            backupItem.innerHTML = `
                <div class="backup-item-info">
                    <div class="backup-item-time">${dateStr}</div>
                    <div class="backup-item-desc">${backup.description}</div>
                    <div class="backup-item-count">项目数: ${itemCount}</div>
                </div>
                <div class="backup-item-actions">
                    <button class="backup-restore-btn" data-id="${backup.id}">恢复</button>
                    <button class="backup-export-btn" data-id="${backup.id}">导出</button>
                    <button class="backup-delete-btn" data-id="${backup.id}">删除</button>
                </div>
            `;
            
            backupsList.appendChild(backupItem);
        });
        
        document.querySelectorAll('.backup-restore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const backupId = e.target.getAttribute('data-id');
                restoreBackup(backupId);
            });
        });
        
        document.querySelectorAll('.backup-export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const backupId = e.target.getAttribute('data-id');
                const backup = backups.find(b => b.id === backupId);
                if (backup) {
                    exportBackupToFile(backup);
                }
            });
        });
        
        document.querySelectorAll('.backup-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const backupId = e.target.getAttribute('data-id');
                if (confirm('确定要删除此备份吗？')) {
                    deleteBackup(backupId);
                }
            });
        });
    } catch (error) {
        console.error('更新备份列表UI出错:', error);
        backupsList.innerHTML = '<div class="backup-error">加载备份列表出错</div>';
    }
}

function promptRestoreBackup() {
    if (backups.length === 0) {
        showErrorToast('没有可用的备份');
        return;
    }
    
    if (confirm('确定要恢复备份吗？当前数据将被替换。')) {
        restoreBackup(backups[0].id);
    }
}

function restoreBackup(backupId) {
    try {
        const backupJson = localStorage.getItem(backupId);
        
        if (!backupJson) {
            showErrorToast('找不到指定的备份');
            return;
        }
        
        const backup = JSON.parse(backupJson);
        
        if (!backup.data || backup.data.length === 0) {
            showErrorToast('备份数据为空或无效');
            return;
        }
        
        if (!confirm(`确定要从"${new Date(backup.timestamp).toLocaleString()}"的备份恢复${backup.data.length}条数据吗？当前数据将被替换。`)) {
            return;
        }
        
        showToast('正在恢复数据...');
        
        setTimeout(() => {
            try {
                const transaction = db.transaction(['items'], 'readwrite');
                const store = transaction.objectStore('items');
                
                transaction.onerror = (event) => {
                    console.error('恢复备份事务错误:', event.target.error);
                    showErrorToast('恢复过程中发生错误：' + event.target.error.message);
                };
                
                const clearRequest = store.clear();
                
                clearRequest.onerror = (event) => {
                    console.error('清除数据错误:', event.target.error);
                    showErrorToast('清除现有数据失败：' + event.target.error.message);
                    return;
                };
                
                clearRequest.onsuccess = () => {
                    let addedCount = 0;
                    let errorCount = 0;
                    const batchSize = 50;
                    
                    function processBatch(startIndex) {
                        let endIndex = Math.min(startIndex + batchSize, backup.data.length);
                        console.log(`处理备份数据批次 ${startIndex} - ${endIndex}`);
                        
                        for (let i = startIndex; i < endIndex; i++) {
                            const item = backup.data[i];
                            try {
                                const request = store.add(item);
                                request.onsuccess = () => { addedCount++; };
                                request.onerror = (event) => {
                                    console.error(`添加数据项 ${i} 失败:`, event.target.error);
                                    errorCount++;
                                };
                            } catch (err) {
                                console.error(`处理数据项 ${i} 出错:`, err);
                                errorCount++;
                            }
                        }
                        
                        if (endIndex < backup.data.length) {
                            setTimeout(() => processBatch(endIndex), 10);
                        }
                    }
                    
                    processBatch(0);
                    
                    transaction.oncomplete = () => {
                        console.log(`备份恢复完成: 添加 ${addedCount} 项，失败 ${errorCount} 项`);
                        
                        backupModal.style.display = 'none';
                        overlay.style.display = 'none';
                        
                        loadItems();
                        showToast(`备份恢复成功，共恢复 ${addedCount} 条数据！`);
                    };
                };
            } catch (innerError) {
                console.error('恢复过程中发生错误:', innerError);
                showErrorToast('恢复失败: ' + innerError.message);
            }
        }, 100);
        
    } catch (error) {
        console.error('恢复备份出错:', error);
        showErrorToast('恢复备份失败: ' + error.message);
    }
}

function deleteBackup(backupId) {
    try {
        localStorage.removeItem(backupId);
        console.log(`备份 ${backupId} 已删除`);
        
        loadBackups();
        updateBackupsList();
        showToast('备份已删除');
    } catch (error) {
        console.error('删除备份出错:', error);
        showErrorToast('删除备份失败: ' + error.message);
    }
}

function exportBackup() {
    try {
        const transaction = db.transaction(['items'], 'readonly');
        const store = transaction.objectStore('items');
        const request = store.getAll();
        
        request.onsuccess = () => {
            const currentData = request.result;
            
            if (!currentData || currentData.length === 0) {
                showErrorToast('没有数据可导出');
                return;
            }
            
            const timestamp = new Date().getTime();
            const backup = {
                id: `export_${timestamp}`,
                timestamp: timestamp,
                description: '手动导出',
                data: currentData,
                itemCount: currentData.length
            };
            
            exportBackupToFile(backup);
        };
    } catch (error) {
        console.error('导出备份出错:', error);
        showErrorToast('导出备份失败: ' + error.message);
    }
}

function importBackup(e) {
    try {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const backup = JSON.parse(event.target.result);
                
                if (!backup.data || !backup.timestamp) {
                    showErrorToast('备份文件格式无效');
                    return;
                }
                
                const backupId = `backup_${new Date().getTime()}`;
                backup.id = backupId;
                backup.description = '从文件导入';
                
                localStorage.setItem(backupId, JSON.stringify(backup));
                
                loadBackups();
                updateBackupsList();
                showToast('备份已导入');
            } catch (error) {
                console.error('解析备份文件出错:', error);
                showErrorToast('备份文件格式错误');
            }
        };
        
        reader.onerror = () => {
            showErrorToast('读取备份文件失败');
        };
        
        reader.readAsText(file);
        
        e.target.value = '';
    } catch (error) {
        console.error('导入备份出错:', error);
        showErrorToast('导入备份失败: ' + error.message);
    }
}
