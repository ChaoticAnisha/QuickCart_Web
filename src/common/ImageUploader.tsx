'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
  maxSize?: number; // in MB
  aspectRatio?: string;
}

export default function ImageUploader({
  onImageSelect,
  currentImage,
  maxSize = 5,
  aspectRatio = 'aspect-square'
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onImageSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="space-y-4">
      <div className={`relative ${aspectRatio} w-full max-w-md overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#FFA500] transition-colors`}>
        {displayImage ? (
          <>
            <Image
              src={displayImage}
              alt="Upload preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center h-full cursor-pointer p-8">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 text-center mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 text-center">
              PNG, JPG, WEBP up to {maxSize}MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}

      {!displayImage && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-3 border-2 border-[#FFA500] text-[#FFA500] rounded-xl font-semibold hover:bg-[#FFA500] hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ImageIcon className="w-5 h-5" />
          Choose Image
        </button>
      )}
    </div>
  );
}