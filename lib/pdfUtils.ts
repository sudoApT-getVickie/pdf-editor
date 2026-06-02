import { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const usePdfThumbnail = (file: File | null): [string | null, any] => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!file) {
      return;
    }

    const generateThumbnail = async () => {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
            const pdf: PDFDocumentProxy = await pdfjs.getDocument({ data: typedArray }).promise;
            const page = await pdf.getPage(1);

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
              throw new Error('Could not get canvas context');
            }

            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvas, canvasContext: context, viewport }).promise;

            setThumbnail(canvas.toDataURL());
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (e) {
        setError(e);
      }
    };

    generateThumbnail();

  }, [file]);

  return [thumbnail, error];
};

export const mergePdfs = async (pdfBuffers: ArrayBuffer[]): Promise<Blob> => {
  const mergedPdf = await PDFDocument.create();
  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
};
