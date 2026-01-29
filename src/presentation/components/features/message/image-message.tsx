// src/presentation/components/features/message/image-message.tsx
'use client';

import React from 'react';

import { MessageContentPayload } from '@/domain/entities/message.entity';

interface ImageMessageProps {
    content: string | MessageContentPayload;
}

export const ImageMessage = ({ content }: ImageMessageProps) => {
    const text = typeof content === 'string' ? content : content.text;
    let imageUrl = text;
    let altText = "Generated Image";

    const markdownMatch = text.match(/!\[(.*?)\]\((.*?)\)/);
    if (markdownMatch) {
        altText = markdownMatch[1];
        imageUrl = markdownMatch[2];
    }

    if (!imageUrl) return null;

    return (
        <div className="relative mt-2 mb-2 rounded-xl overflow-hidden border border-white/20 shadow-sm bg-black/5 dark:bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imageUrl}
                alt={altText}
                className="w-full h-auto max-h-125 object-contain mx-auto"
                loading="lazy"
            />
        </div>
    );
};