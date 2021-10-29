const indexedDBHelper = (() => {
  let db = null;
  let lastIndex = 0;

  function init() {
    //open the database
    indexedDBHelper.open();
  }

  const open = () => {
    const version = 1;

    const promise = new Promise((resolve, reject) => {
      //Opening the DB
      const request = indexedDB.open("CheckLinks", version);

      //Will be called if the database is new or the version is modified
      request.onupgradeneeded = ({target}) => {
        db = target.result;

        target.transaction.onerror = indexedDB.onerror;

        //Deleting DB if already exists
        if(db.objectStoreNames.contains("links")) {
          db.deleteObjectStore("links");
        }

        //Creating a new DB store with a paecified key property
        const store = db.createObjectStore("links",
          {keyPath: "id"});
        const linkIndex = store.createIndex("by_link", "link");
      };

      //If opening DB succeeds
      request.onsuccess = ({target}) => {
        db = target.result;
        resolve();
      };

      //If DB couldn't be opened for some reason
      request.onerror = e => {
        reject("Couldn't open DB");
      };
    });
    return promise;
  };

  const addLink = (linkURL, linkstatus) => {
    //Creating a transaction object to perform read-write operations
    const trans = db.transaction(["links"], "readwrite");
    const store = trans.objectStore("links");
    lastIndex++;

    //Wrapping logic inside a promise
    const promise = new Promise((resolve, reject) => {
      //Sending a request to add an item
      const request = store.put({
        "id": lastIndex,
        "link": linkURL,
        "timeStamp": new Date().getTime(),
        "status": linkstatus
      });

      //success callback
      request.onsuccess = e => {
        resolve();
      };

      //error callback
      request.onerror = ({value}) => {
        console.log(value);
        reject("Couldn't add the passed item");
      };
    });

    return promise;
  };

  const getAllLinks = () => {
    const linksArr = [];
    //Creating a transaction object to perform Read operations
    const trans = db.transaction(["links"], "readonly");
    //Getting a reference of the link store
    const store = trans.objectStore("links");

    //Wrapping all the logic inside a promise
    const promise = new Promise((resolve, reject) => {
      //Opening a cursor to fetch items from lower bound in the DB
      const keyRange = IDBKeyRange.lowerBound(0);
      const cursorRequest = store.openCursor(keyRange);

      //success callback
      cursorRequest.onsuccess = ({target}) => {
        const result = target.result;

        //Resolving the promise with link items when the result id empty
        if(result === null || result === undefined){
          resolve(linksArr);
        }
        //Pushing result into the link list
        else{
          linksArr.push(result.value);
          if(result.value.id > lastIndex){
            lastIndex = result.value.id;
          }
          result.continue();
        }
      };

      //Error callback
      cursorRequest.onerror = e => {
        reject("Couldn't fetch items from the DB");
      };
    });
    return promise;
  };

  const deleteObjectStore = id => {
    indexedDBHelper.open().then(() => {
      const promise = new Promise((resolve, reject) => {
        const trans = db.transaction(["links"], "readwrite");
        const store = trans.objectStore("links");
        const request = store.clear();

        request.onsuccess = e => {
          resolve();
        };

        request.onerror = e => {
          console.log(e);
          reject("Couldn't delete the item");
        };
      });
      return promise;
    }, err => {
      console.log(err);
    });
  };

  const getLink = url => {
    const linksArr = [];
    //Creating a transaction object to perform Read operations
    const trans = db.transaction(["links"], "readonly");
    //Getting a reference of the link store
    const store = trans.objectStore("links");

    //Wrapping all the logic inside a promise
    const promise = new Promise((resolve, reject) => {
      const index = store.index("by_link");
      const request = index.get(url);

      //success callback
      request.onsuccess = ({target}) => {
        const result = target.result;
        resolve(result);
      };

      //Error callback
      request.onerror = e => {
        reject("Couldn't fetch items from the DB");
      };
    });
    return promise;
  };

  const deleteLink = id => {

    const promise = new Promise((resolve, reject) => {
      const trans = db.transaction(["links"], "readwrite");
      const store = trans.objectStore("links");
      const request = store.delete(id);

      request.onsuccess = e => {
        resolve();
      };

      request.onerror = e => {
        console.log(e);
        reject("Couldn't delete the item");
      };
    });

    return promise;
  };

  return {
    init,
    open,
    addLink,
    getLink,
    getAllLinks,
    deleteLink,
    deleteObjectStore
  };

})();

indexedDBHelper.init();