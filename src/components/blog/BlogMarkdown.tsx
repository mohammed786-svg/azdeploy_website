"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

const mdClass = {
  h1: "text-2xl sm:text-3xl font-bold text-white mt-10 mb-4 tracking-tight",
  h2: "text-xl sm:text-2xl font-semibold text-[#e8eef5] mt-8 mb-3 border-b border-white/[0.08] pb-2",
  h3: "text-lg font-semibold text-[#cbd5e1] mt-6 mb-2",
  p: "text-[#94a3b8] leading-relaxed mb-4 text-[15px] sm:text-base",
  ul: "list-disc pl-6 mb-4 text-[#94a3b8] space-y-2",
  ol: "list-decimal pl-6 mb-4 text-[#94a3b8] space-y-2",
  li: "leading-relaxed",
  a: "text-[#00d4ff] underline underline-offset-2 hover:text-[#7dd3fc]",
  code: "font-mono text-[13px] bg-white/[0.06] px-1.5 py-0.5 rounded text-[#fde68a]",
  pre: "bg-[#0a0a12] border border-white/[0.08] rounded-xl p-4 overflow-x-auto mb-4 text-sm",
  blockquote: "border-l-4 border-[#00d4ff]/40 pl-4 italic text-[#94a3b8] my-4",
  hr: "border-white/[0.1] my-8",
  strong: "text-white font-semibold",
};

export default function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className="blog-md max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => <h2 className={mdClass.h1}>{children}</h2>,
          h2: ({ children }) => <h2 className={mdClass.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={mdClass.h3}>{children}</h3>,
          p: ({ children }) => <p className={mdClass.p}>{children}</p>,
          ul: ({ children }) => <ul className={mdClass.ul}>{children}</ul>,
          ol: ({ children }) => <ol className={mdClass.ol}>{children}</ol>,
          li: ({ children }) => <li className={mdClass.li}>{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className={mdClass.a} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = /language-/.test(className || "");
            if (isBlock) {
              return (
                <code className={`${className} block text-[13px] text-[#e2e8f0]`} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={mdClass.code} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className={mdClass.pre}>{children}</pre>,
          blockquote: ({ children }) => <blockquote className={mdClass.blockquote}>{children}</blockquote>,
          hr: () => <hr className={mdClass.hr} />,
          strong: ({ children }) => <strong className={mdClass.strong}>{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
