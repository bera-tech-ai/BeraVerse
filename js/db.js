// Initialize IndexedDB for offline storage
let db;

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('BeraVerseDB', 1);
        
        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject('Failed to open database');
        };
        
        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('videos')) {
                db.createObjectStore('videos', { keyPath: 'id' });
            }
        };
    });
};

const saveVideoToDB = async (video) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        
        const request = store.put(video);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            console.error('Error saving video:', event.target.error);
            reject(event.target.error);
        };
    });
};

const getVideoFromDB = async (videoId) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['videos'], 'readonly');
        const store = transaction.objectStore('videos');
        
        const request = store.get(videoId);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => {
            console.error('Error getting video:', event.target.error);
            reject(event.target.error);
        };
    });
};

const getAllVideosFromDB = async () => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['videos'], 'readonly');
        const store = transaction.objectStore('videos');
        
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => {
            console.error('Error getting videos:', event.target.error);
            reject(event.target.error);
        };
    });
};

const deleteVideoFromDB = async (videoId) => {
    if (!db) await initDB();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        
        const request = store.delete(videoId);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            console.error('Error deleting video:', event.target.error);
            reject(event.target.error);
        };
    });
};

// Initialize DB when this file loads
initDB().catch(console.error);
