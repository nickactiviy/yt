const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/yt', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Mengambil informasi video
        const info = await ytdl.getInfo(url);

        // Mencoba mendapatkan format video dan audio yang lebih umum
        const mp4Format = ytdl.chooseFormat(info.formats, { quality: '134' }); // Misalnya: 134 adalah 360p
        const mp3Format = ytdl.chooseFormat(info.formats, { quality: '140' }); // Misalnya: 140 adalah audio m4a

        if (!mp4Format || !mp3Format) {
            return res.status(404).json({ error: 'No suitable format found' });
        }

        // Mengirimkan respons JSON
        res.json({
            title: info.videoDetails.title,
            description: info.videoDetails.description,
            videoUrl: url,
            downloadLinks: {
                mp4: mp4Format.url,
                mp3: mp3Format.url
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
