const _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-98457349-3']);
_gaq.push(['_trackPageview']);

(() => {
    const ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

chrome.extension.onMessage.addListener(onRequest);
const beginLinkCheck = function beginLinkCheck(tab) {
    _gaq.push(['_trackEvent', "LinkCheck", 'started']);
    chrome.tabs.executeScript(tab.id, { file: 'functions.js' });
    chrome.tabs.executeScript(tab.id, { file: 'check.js' }, () => {
        chrome.tabs.sendMessage(tab.id, { options: getOptions(), action: "initial" });
    });
};
chrome.tabs.onUpdated.addListener((tabid, {status}, tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, arrayOfTabs => {
        const activeTab = arrayOfTabs[0];
        //If the active tab was updated
        if (activeTab.id == tab.id) {
            const url = tab.url;
            if (url !== undefined && status == "complete" && getItem("autoCheck") == "true") {
                beginLinkCheck(tab);
            }
        }
    });
});

chrome.browserAction.onClicked.addListener(beginLinkCheck);
chrome.runtime.onInstalled.addListener(({reason, previousVersion}) => {
    if (reason == "install") {
        chrome.tabs.create({ url: "options.html?newinstall=yes" });
    } else if (reason == "update") {
        const thisVersion = chrome.runtime.getManifest().version;
        console.log(`Updated from ${previousVersion} to ${thisVersion}!`);
    }
});
