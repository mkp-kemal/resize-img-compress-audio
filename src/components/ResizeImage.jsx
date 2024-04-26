import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createCanvas, loadImage } from 'canvas';
import swal from 'sweetalert';

const ResizeImage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resizedImage, setResizedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resizing, setResizing] = useState(false);

    const onDrop = (acceptedFiles) => {
        if (!acceptedFiles[0]) {
            swal("File Error", "Format file tidak sesuai. Hanya file dengan format PNG atau JPG yang diizinkan.", "error");
            return;
        }
        setSelectedFile(acceptedFiles[0]);
        setResizedImage(null);
        setPreviewImage(URL.createObjectURL(acceptedFiles[0])); // Menampilkan gambar yang dipilih sebagai preview
    };

    const handleResize = async () => {
        if (!selectedFile) {
            swal("Error", "Tidak ada file yang dipilih.", "error");
            return;
        }

        setResizing(true);

        try {
            const canvas = createCanvas(200, 200);
            const ctx = canvas.getContext('2d');

            const img = await loadImage(URL.createObjectURL(selectedFile));
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const resizedImageUrl = canvas.toDataURL('image/jpeg', 0.8);

            setResizedImage(resizedImageUrl);
        } catch (error) {
            console.error('Error resizing image:', error);
            swal("Error", "Terjadi kesalahan saat mengunggah file.", "error");
        } finally {
            setResizing(false);
        }
    };

    const handleDownload = () => {
        if (resizedImage) {
            const downloadLink = document.createElement('a');
            downloadLink.href = resizedImage;
            downloadLink.download = 'resized_image.jpg'; // Nama file saat diunduh
            downloadLink.click();
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png' // Batasi jenis file yang diizinkan menjadi png dan jpg
    });

    return (
        <div style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Resize Gambar</h2>
            <div {...getRootProps()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', padding: '20px', border: '2px dashed #007bff', borderRadius: '5px', cursor: 'pointer' }}>
                <input {...getInputProps()} />
                {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '5px' }} />}
                {!previewImage && <p style={{ margin: 0 }}>Drag and drop some files here, or click to select files</p>}
            </div>

            {selectedFile && (
                <button style={{ display: 'block', margin: '0 auto', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleResize} disabled={!selectedFile || loading}>
                    {resizing ? 'Resizing...' : 'Resize'}
                </button>
            )}

            {resizedImage && (
                <>
                    <button style={{ margin: '20px auto 0', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: resizing ? 'none' : 'block' }} onClick={handleDownload}>
                        Download Resized Image
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h3 style={{ color: '#333' }}>Hasil Resize:</h3>
                        <img src={resizedImage} alt="Resized" style={{ maxWidth: '100%', border: '1px solid #ccc', borderRadius: '5px' }} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ResizeImage;
