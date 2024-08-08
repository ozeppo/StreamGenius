const getMetadata = async (filePath) => {
    try {
        const mm = await import('music-metadata');
        const metadata = await mm.parseFile(filePath);
        return {
            title: metadata.common.title,
            artist: metadata.common.artist,
            album: metadata.common.album,
            genre: metadata.common.genre ? metadata.common.genre[0] : 'Unknown'
        };
    } catch (err) {
        console.error(err);
        return {};
    }
};

module.exports = { getMetadata };
