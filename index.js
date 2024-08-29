const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

// Endpoint untuk mendownload video dan audio
app.get('/api/yt', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Mengambil informasi video
        const info = await ytdl.getInfo(url);

        // Mendapatkan format MP4 dan MP3
        const mp4Format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
        const mp3Format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

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

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

