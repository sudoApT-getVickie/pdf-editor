import { usePdfThumbnail } from '../lib/pdfUtils';
import { useState } from 'react';
import { mergePdfs } from '../lib/pdfUtils';

export const PdfEditor = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles([...files, ...newFiles]);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleMergeAndDownload = async () => {
    if (files.length === 0) {
      return;
    }
    const pdfBuffers = await Promise.all(
      files.map(async (file) => {
        return new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as ArrayBuffer);
            }
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsArrayBuffer(file);
        });
      })
    );
    const mergedPdfBlob = await mergePdfs(pdfBuffers);
    const url = URL.createObjectURL(mergedPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-screen bg-brutalist-black text-brutalist-white font-mono">
      <nav className="flex items-center justify-between p-4 border-b border-gold">
        <h1 className="text-lg font-bold">PDF Editor</h1>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover-gold p-2">File</a>
          <a href="#" className="hover-gold p-2">Edit</a>
          <a href="#" className="hover-gold p-2">View</a>
        </div>
      </nav>
      <div className="flex flex-1">
        <aside className="w-1/4 p-4 border-r border-gold">
          <h2 className="text-md font-bold mb-4">Uploaded Files</h2>
          <div 
            className="border-2 border-dashed border-gold p-2 h-32 flex items-center justify-center mb-4"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <p>Drag and drop PDF files here</p>
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="border border-gold p-2">
                <p>{file.name}</p>
              </div>
            ))}
          </div>
          {files.length > 0 && (
            <button 
              onClick={handleMergeAndDownload} 
              className="w-full mt-4 bg-brutalist-gold text-brutalist-black font-bold py-2 px-4 hover-gold"
            >
              Merge and Download
            </button>
          )}
        </aside>
        <main className="w-3/4 p-4">
          <div className="border border-gold h-full flex items-center justify-center">
            <p>PDF Page Preview</p>
          </div>
        </main>
      </div>
    </div>
  );
};
