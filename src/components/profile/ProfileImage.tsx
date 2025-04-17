'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ProfileImageProps {
  currentImageUrl?: string;
  onImageChange?: (file: File) => void;
}

export function ProfileImage({ currentImageUrl, onImageChange }: ProfileImageProps) {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call the parent handler
    onImageChange?.(file);
  };

  return (
    <Card className="p-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
          onClick={handleImageClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl text-gray-400">👤</span>
            </div>
          )}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
              <span className="text-white text-sm">Change Photo</span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <Button
          variant="outline"
          onClick={handleImageClick}
          className="w-full"
        >
          Upload New Picture
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Click on the image or button to upload a new profile picture
        </p>
      </div>
    </Card>
  );
} 