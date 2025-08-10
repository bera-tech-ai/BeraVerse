const API_BASE = "https://apis.davidcyriltech.my.id/youtube";

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');
    const videoTitle = params.get('title');
    
    if (!videoId) return window.location.href = 'index.html';
    
    // Set up player
    document.getElementById('video-player').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    document.getElementById('video-title').textContent = decodeURIComponent(videoTitle);
    
    // Set up download buttons
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    document.getElementById('download-mp3').addEventListener('click', () => {
        downloadVideo(videoUrl, 'mp3');
    });
    
    document.getElementById('download-mp4').addEventListener('click', () => {
        downloadVideo(videoUrl, 'mp4');
    });
    
    async function downloadVideo(url, format) {
        try {
            showLoading();
            const response = await fetch(`${API_BASE}/${format}?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) throw new Error('Download failed');
            
            const { url: downloadUrl } = await response.json();
            
            if (downloadUrl) {
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `${videoTitle || 'video'}.${format}`;
                a.click();
            }
        } catch (error) {
            console.error('Download error:', error);
            alert(`Download failed: ${error.message}`);
        } finally {
            hideLoading();
        }
    }
    
    function showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = '<div class="loading-spinner"></div><p>Loading...</p>';
        document.body.appendChild(loading);
    }
    
    function hideLoading() {
        const loading = document.querySelector('.loading-overlay');
        if (loading) loading.remove();
    }
});
