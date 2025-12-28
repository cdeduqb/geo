'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100  rounded-2xl overflow-hidden flex items-center justify-center text-gray-400">
                暂无图片
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 主图 */}
            <div className="aspect-square bg-gray-100  rounded-2xl overflow-hidden relative">
                <img
                    src={selectedImage}
                    alt={productName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 缩略图 */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`aspect-square bg-gray-100  rounded-lg overflow-hidden cursor-pointer transition-all ${selectedImage === img
                                    ? 'ring-2 ring-blue-600 opacity-100'
                                    : 'hover:opacity-75'
                                }`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img}
                                alt={`${productName} - ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
