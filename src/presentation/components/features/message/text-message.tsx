/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

import { MessageContentPayload } from '@/domain/entities/message.entity';

interface TextMessageProps {
    content: string | MessageContentPayload;
}

export const TextMessage = ({ content }: TextMessageProps) => {
    const text = typeof content === 'string' ? content : content.text;

    return (
        // Añadimos 'prose-headings', 'prose-p', etc para forzar herencia de colores
        <div className="prose prose-sm max-w-none wrap-break-word text-current dark:prose-invert prose-p:text-current prose-headings:text-current prose-strong:text-current prose-li:text-current prose-code:text-current prose-a:text-blue-500">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // 1. CÓDIGO (Estilo visual VSCode - Ligero)
                    code({ inline, className, children, node, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isMultiLine = !inline && match;

                        return isMultiLine ? (
                            <div className="rounded-lg overflow-hidden my-3 shadow-md border border-white/10 bg-[#1e1e1e] not-prose">
                                <div className="flex items-center justify-between px-3 py-1.5 bg-[#2d2d2d] border-b border-white/5">
                                    <span className="text-xs text-gray-400 font-mono">{match[1]}</span>
                                </div>
                                <div className="overflow-x-auto p-3">
                                    <code className="font-mono text-sm text-gray-200 block" {...props}>
                                        {children}
                                    </code>
                                </div>
                            </div>
                        ) : (
                            <code className="bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 font-mono text-[0.9em] font-semibold break-all" {...props}>
                                {children}
                            </code>
                        );
                    },

                    // 2. IMÁGENES (Protección contra URLs vacías)
                    img({ node, ...props }: ComponentPropsWithoutRef<'img'> & { node?: object }) {
                        if (!props.src) return null;
                        return (
                            <span className="block relative my-4 rounded-xl overflow-hidden border border-gray-200/20 shadow-sm bg-black/5 dark:bg-white/5 not-prose">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    {...props}
                                    alt={props.alt || "Image"}
                                    className="w-full h-auto max-h-125 object-contain mx-auto"
                                    loading="lazy"
                                />
                            </span>
                        );
                    },

                    // 3. TABLAS (Estilo limpio)
                    table({ node, ...props }: any) {
                        return <div className="overflow-x-auto my-4 rounded-lg border border-current/20 not-prose"><table className="min-w-full divide-y divide-current/20 text-sm" {...props} /></div>;
                    },
                    thead({ node, ...props }: any) { return <thead className="bg-black/5 dark:bg-white/5" {...props} />; },
                    th({ node, ...props }: any) { return <th className="px-4 py-3 font-semibold uppercase opacity-80" {...props} />; },
                    td({ node, ...props }: any) { return <td className="px-4 py-2 border-t border-current/10" {...props} />; },

                    // 4. ELEMENTOS TEXTO
                    a({ node, ...props }: any) { return <a {...props} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:opacity-80" />; },
                    p({ node, ...props }: any) { return <p className="mb-2 last:mb-0 leading-relaxed" {...props} />; }
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
};