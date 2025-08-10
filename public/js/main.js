document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const videoFeed = document.getElementById('video-feed');
    
    // Load trending videos on page load
    fetchVideos('trending');
    
    // Search functionality
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchVideos(query);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                fetchVideos(query);
            }
        }
    });
    
    // Function to fetch videos from API
    async function fetchVideos(query) {
        try {
            videoFeed.innerHTML = '<div class="loading">Loading videos...</div>';
            
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data && data.videos && data.videos.length > 0) {
                displayVideos(data.videos);
            } else {
                videoFeed.innerHTML = '<div class="no-results">No videos found. Try a different search.</div>';
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            videoFeed.innerHTML = '<div class="error">Failed to load videos. Please try again later.</div>';
        }
    }
    
    // Function to display videos in the feed
    function displayVideos(videos) {
        videoFeed.innerHTML = '';
        
        videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-channel">${video.channel}</p>
                </div>
            `;
            
            videoCard.addEventListener('click', () => {
                window.location.href = `watch.html?videoId=${video.id}&title=${encodeURIComponent(video.title)}&channel=${encodeURIComponent(video.channel)}`;
            });
            
            videoFeed.appendChild(videoCard);
        });
    }
});
