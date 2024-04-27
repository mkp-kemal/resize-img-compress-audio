import { useState } from 'react';
import Dropzone from 'react-dropzone';
import swal from 'sweetalert';
import ffmpeg from 'ffmpeg.js/ffmpeg-mp4.js'; // untuk mengubah ukuran audio dan mengambil audio

const AudioProcessor = () => {
    const [compressedFile, setCompressedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const compressAudio = async (file) => {
        setLoading(true);

        try {
            if (file.type !== 'audio/mpeg') {
                swal("File Error", "Format file tidak sesuai. Hanya file dengan format MP3 yang diizinkan.", "error");
                setLoading(false);
                return;
            }

            const reader = new FileReader();
            reader.onload = async (event) => {
                const result = event.target.result;
                const transcode = ffmpeg({
                    MEMFS: [{ name: file.name, data: result }],
                    arguments: ['-i', file.name, '-b:a', '64k', '-f', 'mp3', 'output.mp3'], // Example: Compress to 64kbps MP3
                });

                const { MEMFS } = transcode;
                const compressedBlob = new Blob([MEMFS[0].data], { type: 'audio/mp3' });
                setCompressedFile(compressedBlob);
                setLoading(false);
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error compressing audio:', error);
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Compress Audio</h2>
            <Dropzone onDrop={(acceptedFiles) => compressAudio(acceptedFiles[0])}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} style={{ cursor: 'pointer', padding: '20px', border: '2px dashed #007bff', borderRadius: '5px', marginBottom: '20px' }}>
                        <input {...getInputProps()} />
                        <p>Drag and drop some audio here, or click to select audio</p>
                    </div>
                )}
            </Dropzone>
            {loading ? (
                <p style={{ color: '#007bff', marginTop: '10px' }}>Proses kompresi sedang berlangsung...</p>
            ) : (
                <>
                    {compressedFile && (
                        <>
                            <audio controls src={URL.createObjectURL(compressedFile)} style={{ marginTop: '20px' }} />
                            <a href={URL.createObjectURL(compressedFile)} download="compressed_audio.mp3" style={{ display: 'block', marginTop: '10px', textDecoration: 'none', color: '#28a745' }}>
                                Download Compressed Audio
                            </a>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default AudioProcessor;
