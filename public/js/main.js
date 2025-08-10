document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const videoGrid = document.getElementById('video-grid');
    const loadingIndicator = document.getElementById('loading');
    
    // Load default content on page load
    loadDefaultContent();
    
    // Search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            searchVideos(query);
        }
    }
    
    async function searchVideos(query) {
        try {
            showLoading();
            const response = await fetch(`https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            displayVideos(data);
        } catch (error) {
            console.error('Search error:', error);
            videoGrid.innerHTML = '<p class="error">Failed to load videos. Please try again.</p>';
        } finally {
            hideLoading();
        }
    }
    
    async function loadDefaultContent() {
        try {
            showLoading();
            // You can change this to a default search term or implement trending videos
            const response = await fetch('https://apis.davidcyriltech.my.id/youtube/search?query=music');
            const data = await response.json();
            displayVideos(data);
        } catch (error) {
            console.error('Error loading default content:', error);
            videoGrid.innerHTML = '<p class="error">Failed to load videos. Please try again.</p>';
        } finally {
            hideLoading();
        }
    }
    
    function displayVideos(videos) {
        videoGrid.innerHTML = '';
        
        if (!videos || videos.length === 0) {
            videoGrid.innerHTML = '<p class="no-results">No videos found. Try a different search.</p>';
            return;
        }
        
        videos.forEach(video => {
            const videoCard = createVideoCard(video);
            videoGrid.appendChild(videoCard);
        });
    }
    
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        
        const thumbnail = document.createElement('img');
        thumbnail.className = 'video-thumbnail';
        thumbnail.src = video.thumbnail || 'assets/default-thumbnail.jpg';
        thumbnail.alt = video.title;
        
        const info = document.createElement('div');
        info.className = 'video-info';
        
        const title = document.createElement('h3');
        title.className = 'video-title';
        title.textContent = video.title;
        
        const channel = document.createElement('p');
        channel.className = 'video-channel';
        channel.textContent = video.channel || 'Unknown channel';
        
        const views = document.createElement('p');
        views.className = 'video-views';
        views.textContent = video.views || 'Views not available';
        
        const actions = document.createElement('div');
        actions.className = 'video-actions';
        
        const watchBtn = document.createElement('button');
        watchBtn.className = 'watch-btn';
        watchBtn.textContent = 'Watch';
        watchBtn.addEventListener('click', () => {
            window.location.href = `watch.html?id=${video.id}&title=${encodeURIComponent(video.title)}&channel=${encodeURIComponent(video.channel || 'Unknown')}`;
        });
        
        const mp3Btn = document.createElement('button');
        mp3Btn.className = 'download-btn';
        mp3Btn.textContent = 'MP3';
        mp3Btn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadVideo(video.url, 'mp3');
        });
        
        const mp4Btn = document.createElement('button');
        mp4Btn.className = 'download-btn';
        mp4Btn.textContent = 'MP4';
        mp4Btn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadVideo(video.url, 'mp4');
        });
        
        actions.append(watchBtn, mp3Btn, mp4Btn);
        info.append(title, channel, views, actions);
        card.append(thumbnail, info);
        
        return card;
    }
    
    async function downloadVideo(videoUrl, format) {
        try {
            showLoading();
            const apiUrl = `https://apis.davidcyriltech.my.id/youtube/${format}?url=${encodeURIComponent(videoUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.url) {
                // Create a temporary anchor element to trigger download
                const a = document.createElement('a');
                a.href = data.url;
                a.download = `beraverse-${Date.now()}.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert('Failed to get download link. Please try again.');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Download failed. Please try again.');
        } finally {
            hideLoading();
        }
    }
    
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
    }
    
    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }
});
