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
            
            const data = await response.json();
            
            // Handle different response formats
            const videos = Array.isArray(data) ? data : 
                         data.items ? data.items : 
                         data.videos ? data.videos : [];
            
            if (videos.length === 0) throw new Error('No videos found');
            
            displayVideos(videos);
        } catch (error) {
            console.error('Error:', error);
            videoGrid.innerHTML = `<p class="error">${error.message}</p>`;
        } finally {
            hideLoading();
        }
    }
    
    function displayVideos(videos) {
        if (!Array.isArray(videos)) {
            videoGrid.innerHTML = '<p class="error">Invalid video data format</p>';
            return;
        }
        
        videoGrid.innerHTML = videos.map(video => {
            // Ensure video has required properties
            const videoId = video.id || video.videoId || '';
            const title = video.title || 'Untitled';
            const thumbnail = video.thumbnail || 'https://via.placeholder.com/300x200';
            const channel = video.channel || video.channelTitle || 'Unknown channel';
            const url = video.url || `https://www.youtube.com/watch?v=${videoId}`;
            
            return `
                <div class="video-card">
                    <img class="video-thumbnail" src="${thumbnail}" alt="${title}">
                    <div class="video-info">
                        <h3 class="video-title">${title}</h3>
                        <p class="video-channel">${channel}</p>
                        <div class="video-actions">
                            <button class="watch-btn" onclick="window.location='watch.html?id=${videoId}&title=${encodeURIComponent(title)}'">
                                Watch
                            </button>
                            <button class="download-btn" onclick="downloadVideo('${url}', 'mp3')">
                                MP3
                            </button>
                            <button class="download-btn" onclick="downloadVideo('${url}', 'mp4')">
                                MP4
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Make downloadVideo available globally
    window.downloadVideo = async function(url, format) {
        try {
            showLoading();
            const response = await fetch(`${API_BASE}/${format}?url=${encodeURIComponent(url)}`);
            
            if (!response.ok) throw new Error('Download failed');
            
            const data = await response.json();
            const downloadUrl = data.url || data.link || data.downloadUrl;
            
            if (downloadUrl) {
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `video.${format}`;
                a.click();
            } else {
                throw new Error('No download link found');
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
