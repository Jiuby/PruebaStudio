
import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  image: string | undefined;
  onImageChange: (base64: string, file?: File) => void;
  label: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ image, onImageChange, label }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">{label}</label>
      <div
        className={`relative w-full aspect-video bg-brand-dark/30 border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${isDragging ? 'border-brand-bone bg-brand-dark/50' : 'border-brand-dark hover:border-brand-bone'
          }`}
        onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          id={`file-upload-${label}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
          }}
        />

        {image ? (
          <>
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-bold uppercase text-xs tracking-widest flex items-center gap-2 border border-white px-4 py-2">
                <Upload size={16} /> Change Image
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-brand-dark border border-brand-dark/50 flex items-center justify-center mx-auto mb-3 text-neutral-400 group-hover:text-brand-bone transition-colors">
              <ImageIcon size={24} />
            </div>
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Click to Upload</p>
            <p className="text-neutral-600 text-[10px] uppercase">or drag and drop image here</p>
          </div>
        )}
      </div>
    </div>
  );
};
