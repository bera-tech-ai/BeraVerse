const API_BASE = "https://apis.davidcyriltech.my.id/youtube";

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const videoGrid = document.getElementById('video-grid');
    
    // Load default content
    fetchVideos('music');
    
    // Search functionality
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) fetchVideos(query);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchButton.click();
    });
    
    async function fetchVideos(query) {
        try {
            showLoading();
            const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
            
            if (!response.ok) throw new Error('API request failed');
            
            const videos = await response.json();
            displayVideos(videos);
        } catch (error) {
            console.error('Error:', error);
            videoGrid.innerHTML = `<p class="error">Error loading videos: ${error.message}</p>`;
        } finally {
            hideLoading();
        }
    }
    
    function displayVideos(videos) {
        videoGrid.innerHTML = videos.map(video => `
            <div class="video-card">
                <img class="video-thumbnail" src="${video.thumbnail}" alt="${video.title}">
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-channel">${video.channel || 'Unknown channel'}</p>
                    <div class="video-actions">
                        <button class="watch-btn" onclick="window.location='watch.html?id=${video.id}&title=${encodeURIComponent(video.title)}'">
                            Watch
                        </button>
                        <button class="download-btn" onclick="downloadVideo('${video.url}', 'mp3')">
                            MP3
                        </button>
                        <button class="download-btn" onclick="downloadVideo('${video.url}', 'mp4')">
                            MP4
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    async function downloadVideo(url, format) {
        try {
            showLoading();
            const response = await fetch(`${API_BASE}/${format}?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) throw new Error('Download failed');
            
            const { url: downloadUrl } = await response.json();
            
            if (downloadUrl) {
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `video.${format}`;
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
        document.getElementById('loading').classList.remove('hidden');
    }
    
    function hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
});
