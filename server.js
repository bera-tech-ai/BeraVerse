const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Proxy API routes
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q || 'trending';
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(query)}`;
        
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

app.get('/api/mp3', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) {
            return res.status(400).json({ error: 'Missing video URL' });
        }
        
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('MP3 error:', error);
        res.status(500).json({ error: 'Failed to get MP3 link' });
    }
});

app.get('/api/mp4', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) {
            return res.status(400).json({ error: 'Missing video URL' });
        }
        
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error('MP4 error:', error);
        res.status(500).json({ error: 'Failed to get MP4 link' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`BeraVerse server running at http://localhost:${port}`);
});
