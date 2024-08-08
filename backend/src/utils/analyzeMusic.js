const { getAudioDurationInSeconds } = require('get-audio-duration');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Opcjonalnie ustaw ścieżkę do ffmpeg, jeśli to konieczne
ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe'); // Zmień na odpowiednią ścieżkę

const analyzeMusic = async (filePath) => {
    try {
        const mm = await import('music-metadata');
        const metadata = await mm.parseFile(filePath);
        const duration = await getAudioDurationInSeconds(filePath);

        let wavFilePath;
        if (metadata.format.container === 'WAV') {
            wavFilePath = filePath;
        } else if (metadata.format.container === 'MPEG') {
            wavFilePath = await convertToWav(filePath);
        } else {
            throw new Error('Unsupported file format');
        }

        const analysis = await runPythonScript(wavFilePath);

        // Usuwanie pliku "converted" po analizie
        if (wavFilePath !== filePath) {
            fs.unlinkSync(wavFilePath);
        }

        return analysis;
    } catch (error) {
        console.error(error);
        throw new Error('Error analyzing music');
    }
};

const convertToWav = (filePath) => {
    return new Promise((resolve, reject) => {
        const outputFilePath = path.join('uploads', `${Date.now()}-converted.wav`);
        ffmpeg(filePath)
            .toFormat('wav')
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputFilePath))
            .save(outputFilePath);
    });
};

const runPythonScript = (filePath) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'analyze_music.py');
        const process = spawn('python', [scriptPath, filePath]);

        let output = '';
        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.stderr.on('data', (data) => {
            console.error(`Python error: ${data}`);
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve(JSON.parse(output));
            } else {
                reject(`Python script exited with code ${code}`);
            }
        });
    });
};

module.exports = { analyzeMusic };
