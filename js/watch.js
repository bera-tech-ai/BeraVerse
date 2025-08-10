document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    const videoTitle = urlParams.get('title');
    const videoChannel = urlParams.get('channel');
    
    const videoPlayer = document.getElementById('video-player');
    const titleElement = document.getElementById('video-title');
    const descriptionElement = document.getElementById('video-description');
    const downloadMp3Btn = document.getElementById('download-mp3');
    const downloadMp4Btn = document.getElementById('download-mp4');
    
    // Set up the video player and info
    if (videoId) {
        videoPlayer.src = `https://www.youtube.com/embed/${videoId}`;
        titleElement.textContent = decodeURIComponent(videoTitle);
        descriptionElement.textContent = `By ${decodeURIComponent(videoChannel)}`;
        
        // Set up download buttons
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        downloadMp3Btn.addEventListener('click', async () => {
            try {
                downloadMp3Btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing download...';
                
                const response = await fetch(`/api/mp3?url=${encodeURIComponent(videoUrl)}`);
                const data = await response.json();
                
                if (data && data.url) {
                    window.open(data.url, '_blank');
                } else {
                    alert('Failed to get MP3 download link');
                }
            } catch (error) {
                console.error('MP3 download error:', error);
                alert('Failed to prepare MP3 download');
            } finally {
                downloadMp3Btn.innerHTML = '<i class="fas fa-music"></i> Download MP3';
            }
        });
        
        downloadMp4Btn.addEventListener('click', async () => {
            try {
                downloadMp4Btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing download...';
                
                const response = await fetch(`/api/mp4?url=${encodeURIComponent(videoUrl)}`);
                const data = await response.json();
                
                if (data && data.url) {
                    window.open(data.url, '_blank');
                } else {
                    alert('Failed to get MP4 download link');
                }
            } catch (error) {
                console.error('MP4 download error:', error);
                alert('Failed to prepare MP4 download');
            } finally {
                downloadMp4Btn.innerHTML = '<i class="fas fa-video"></i> Download MP4';
            }
        });
    } else {
        // No video ID provided, redirect to home
        window.location.href = '/';
    }
    
    // Search functionality (same as in main.js)
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `/?q=${encodeURIComponent(query)}`;
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/?q=${encodeURIComponent(query)}`;
            }
        }
    });
});
