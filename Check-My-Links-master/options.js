const _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-98457349-3']);
_gaq.push(['_trackPageview']);

(() => {
    const ga = document.createElement( 'script' );
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    const s = document.getElementsByTagName( 'script' )[ 0 ];
    s.parentNode.insertBefore( ga, s );
})();

function loadOptions() {

  const bkg = chrome.runtime.getBackgroundPage(bkg => {
    const options = bkg.getOptions();

    if (options.cache == 'true') {
      document.getElementById("cache").checked = true;
    }

    if (options.noFollow == 'true') {
      document.getElementById("noFollow").checked = true;
    }

    if (options.parseDOM == 'true') {
      document.getElementById("parseDOM").checked = true;
    }

    if (options.trailingHash == 'true') {
      document.getElementById("trailingHash").checked = true;
    }

    if (options.emptyLink == 'true') {
      document.getElementById("emptyLink").checked = true;
    }

    if (options.noHrefAttr == 'true') {
      document.getElementById("noHrefAttr").checked = true;
    }
    if (options.autoCheck == 'true') {
      document.getElementById("autoCheck").checked = true;
    }

    document.getElementById("blacklistEntries").value = options.blacklist.split(" ");
    const requestType = document.getElementById("requestType");

    for (const requestTypechild of requestType.children) {
      if (requestTypechild.value == options.checkType) {
        requestTypechild.selected = "true";
        break;
      }
    }
  });
}

function saveOptions() {
  const bkg = chrome.runtime.getBackgroundPage(bkg => {
    const blacklistEntries = document.getElementById("blacklistEntries");
    const requestType = document.getElementById("requestType");

    // Save selected options to localstore
    bkg.setItem("blacklist", blacklistEntries.value);
    bkg.setItem("checkType", requestType.children[requestType.selectedIndex].value);

    if (document.getElementById("cache").checked) { bkg.setItem("cache", 'true'); } else { bkg.setItem("cache", 'false'); }
    if (document.getElementById("noFollow").checked) { bkg.setItem("noFollow", 'true'); } else { bkg.setItem("noFollow", 'false'); }
    if (document.getElementById("parseDOM").checked) { bkg.setItem("parseDOM", 'true'); } else { bkg.setItem("parseDOM", 'false'); }
    if (document.getElementById("trailingHash").checked) { bkg.setItem("trailingHash", 'true'); } else { bkg.setItem("trailingHash", 'false'); }
    if (document.getElementById("emptyLink").checked) { bkg.setItem("emptyLink", 'true'); } else { bkg.setItem("emptyLink", 'false'); }
    if (document.getElementById("noHrefAttr").checked) { bkg.setItem("noHrefAttr", 'true'); } else { bkg.setItem("noHrefAttr", 'false'); }
    if (document.getElementById("autoCheck").checked) { bkg.setItem("autoCheck", 'true'); } else { bkg.setItem("autoCheck", 'false'); }

    document.getElementById("msg").style.visibility = "visible";
    setTimeout(() => {
      document.getElementById("msg").style.visibility = "hidden";
    }, 2000);
  });
}

function deleteObjectStore() {
  indexedDBHelper.deleteObjectStore();
  console.log("Cleared IndexedDB Datastore");
  document.getElementById("msgCache").style.visibility = "visible";
  setTimeout(() => {
    document.getElementById("msgCache").style.visibility = "hidden";
  }, 2000);
}

document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clearCache').addEventListener('click', deleteObjectStore);

loadOptions();
