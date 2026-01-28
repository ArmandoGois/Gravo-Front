/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';
import { MessageContentPayload } from '@/domain/entities/message.entity';


export const MarkdownRenderer = ({ content }: { content: string | MessageContentPayload }) => {
    let text = "";
    if (typeof content === 'string') {
        text = content;
    } else if (content && typeof content === 'object' && 'text' in content) {
        text = content.text;
    } else {
        return <>{JSON.stringify(content)}</>;
    }

    return (
        <div className="prose prose-sm max-w-none wrap-break-word text-current prose-p:text-current prose-headings:text-current prose-strong:text-current prose-li:text-current prose-code:text-current">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    code({ inline, className, children, node, ...props }: ComponentPropsWithoutRef<'code'> & { inline?: boolean, node?: object }) {
                        const match = /language-(\w+)/.exec(className || '');

                        return !inline && match ? (
                            <div className="rounded-lg overflow-hidden my-3 shadow-md border border-gray-700/50 not-prose">
                                <div className="bg-[#2d2d2d] px-3 py-1 text-xs text-gray-400 border-b border-gray-700">
                                    {match[1]}
                                </div>
                                <SyntaxHighlighter
                                    style={atomDark}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, borderRadius: 0 }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code
                                className={`${className} bg-black/10 dark:bg-white/10 rounded px-1.5 py-0.5 font-mono text-[0.9em] font-semibold`}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    // --- IMAGES ---
                    img({ node, ...props }: ComponentPropsWithoutRef<'img'> & { node?: object }) {
                        return (
                            <div className="relative mt-3 mb-3 rounded-xl overflow-hidden border border-gray-200/50 shadow-sm bg-white/50 not-prose">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    {...props}
                                    alt={props.alt || "Image"}
                                    className="w-full h-auto max-h-125 object-contain mx-auto"
                                    loading="lazy"
                                />
                            </div>
                        );
                    },

                    // --- RESTO DE COMPONENTES (Simplificados para heredar) ---
                    a({ node, ...props }: ComponentPropsWithoutRef<'a'> & { node?: object }) {
                        return <a {...props} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:opacity-80 break-all" />;
                    },

                    // Solo necesitamos overrides si queremos estructura específica, el color ya se hereda
                    table({ node, ...props }: ComponentPropsWithoutRef<'table'> & { node?: object }) {
                        return (
                            <div className="overflow-x-auto my-4 rounded-lg border border-current/20">
                                <table className="min-w-full divide-y divide-current/20" {...props} />
                            </div>
                        );
                    },
                    thead({ node, ...props }: ComponentPropsWithoutRef<'thead'> & { node?: object }) {
                        return <thead className="bg-black/5" {...props} />;
                    },
                    th({ node, ...props }: ComponentPropsWithoutRef<'th'> & { node?: object }) {
                        return <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70" {...props} />;
                    },
                    tbody({ node, ...props }: ComponentPropsWithoutRef<'tbody'> & { node?: object }) {
                        return <tbody className="divide-y divide-current/10" {...props} />;
                    },
                    tr({ node, ...props }: ComponentPropsWithoutRef<'tr'> & { node?: object }) {
                        return <tr className="hover:bg-black/5 transition-colors" {...props} />;
                    },
                    td({ node, ...props }: ComponentPropsWithoutRef<'td'> & { node?: object }) {
                        return <td className="px-4 py-2 whitespace-nowrap text-sm" {...props} />;
                    },
                    p({ node, ...props }: ComponentPropsWithoutRef<'p'> & { node?: object }) {
                        return <p className="mb-2 last:mb-0 leading-relaxed" {...props} />;
                    },
                    ul({ node, ...props }: ComponentPropsWithoutRef<'ul'> & { node?: object }) {
                        return <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />;
                    },
                    ol({ node, ...props }: ComponentPropsWithoutRef<'ol'> & { node?: object }) {
                        return <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />;
                    }
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
};