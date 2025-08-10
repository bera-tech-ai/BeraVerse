document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    const videoTitle = decodeURIComponent(urlParams.get('title') || 'Video');
    const videoChannel = decodeURIComponent(urlParams.get('channel') || 'Unknown channel');
    
    const videoPlayer = document.getElementById('video-player');
    const titleElement = document.getElementById('video-title');
    const channelElement = document.getElementById('video-channel');
    const mp3Button = document.getElementById('download-mp3');
    const mp4Button = document.getElementById('download-mp4');
    const saveButton = document.getElementById('save-offline');
    
    if (!videoId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set video info
    titleElement.textContent = videoTitle;
    channelElement.textContent = videoChannel;
    
    // Embed YouTube player
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    // Set up download buttons
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    mp3Button.addEventListener('click', () => downloadVideo(videoUrl, 'mp3'));
    mp4Button.addEventListener('click', () => downloadVideo(videoUrl, 'mp4'));
    
    // Set up offline save
    saveButton.addEventListener('click', () => saveVideoForOffline({
        id: videoId,
        title: videoTitle,
        channel: videoChannel,
        url: videoUrl
    }));
    
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
                a.download = `beraverse-${videoTitle.substring(0, 20)}-${Date.now()}.${format}`;
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
        // Implement loading indicator for watch page
        const loading = document.createElement('div');
        loading.id = 'watch-loading';
        loading.textContent = 'Loading...';
        document.body.appendChild(loading);
    }
    
    function hideLoading() {
        const loading = document.getElementById('watch-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    async function saveVideoForOffline(video) {
        try {
            showLoading();
            await saveVideoToDB(video);
            alert('Video saved for offline viewing!');
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Failed to save video for offline viewing.');
        } finally {
            hideLoading();
        }
    }
});
