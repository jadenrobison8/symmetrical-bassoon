const indexedDB = 
   window.indexedDB || 
   ;

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = (event) => {
   event.target.result.createObjectStore("pending", {
      keyPath: "id",
      autoIncrement: true
   });
};

request.onerror = (err) => {
   console.log(err.message);
};

request.onsuccess = (event) => {

};
