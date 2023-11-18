/* global chrome */

chrome.runtime.onInstalled.addListener(function() {
    // 创建父菜单
    chrome.contextMenus.create({
        id: "syncNote",
        title: "SyncNote",
        contexts: ["selection"]
    });

    // 创建子菜单
    chrome.contextMenus.create({
        id: "sendToAll",
        parentId: "syncNote",
        title: "发送到全部",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "sendToCurrent",
        parentId: "syncNote",
        title: "发送到当前",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "sendToAll" || info.menuItemId === "sendToCurrent") {
        // 发送选中的文本到后端服务器
        fetch('https://www.baidu.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: info.selectionText })
        }).then(response => {
            console.log('Text sent successfully');
        }).catch(error => {
            console.log('Error sending text:', error);
        });
    }
});
