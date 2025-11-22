"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download, Copy, Clock, BookOpen, CheckCircle, Sparkles } from "lucide-react";
import { FeedbackModal } from './FeedbackModal';

interface ProductData {
  Title: string;
  Summary: string;
  EstimatedReadingTime: string;
  Sections: Array<{
    Heading: string;
    Content: string;
  }>;
}

interface ProductPreviewProps {
  product: ProductData;
  onBack?: () => void;
}

export function ProductPreview({ product, onBack }: ProductPreviewProps) {
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const copySection = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(index);
      setTimeout(() => setCopiedSection(null), 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadProduct = () => {
    const cleanMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/gs, '$1')
        .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\*\s+/gm, '• ')
        .replace(/^\d+\.\s+/gm, '• ')
        .replace(/^>\s+/gm, '')
        .replace(/\*/g, '')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();
    };

    let content = `${product.Title}\n`;
    content += "=".repeat(product.Title.length) + "\n\n";
    content += `${cleanMarkdown(product.Summary)}\n\n`;
    content += `Estimated Reading Time: ${product.EstimatedReadingTime}\n\n`;

    product.Sections.forEach((section, index) => {
      content += `${index + 1}. ${section.Heading}\n`;
      content += "-".repeat(section.Heading.length + 3) + "\n\n";
      content += `${cleanMarkdown(section.Content)}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.Title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowFeedbackModal(true);
  };

  const totalWords = product.Sections.reduce((acc, s) => acc + s.Content.split(' ').length, 0);

  return (
    <div className="min-h-screen flex flex-col relative pb-32">
      {/* Header Section */}
      <div className="pt-16 pb-12 text-center px-4 animate-float">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight mb-6">
          Your Product is Ready
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light mb-8">
          {product.Title}
        </p>

        {/* Metadata Pills */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-gray-300 text-sm">{product.EstimatedReadingTime}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <BookOpen className="h-4 w-4 text-purple-400" />
            <span className="text-gray-300 text-sm">{product.Sections.length} Sections</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-gray-300 text-sm">{totalWords.toLocaleString()} words</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 max-w-4xl mx-auto w-full">
        {/* Summary */}
        {product.Summary && (
          <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{product.Summary}</p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {product.Sections.map((section, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all"
            >
              {/* Section Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{section.Heading}</h3>
                  </div>
                </div>
                <button
                  onClick={() => copySection(section.Content, index)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  {copiedSection === index ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 text-sm font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Section Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mb-3 mt-6" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mb-2 mt-4" {...props} />,
                    p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />,
                    li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                    strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                    code: ({ node, ...props }) => <code className="bg-white/10 px-2 py-1 rounded text-blue-400" {...props} />,
                  }}
                >
                  {section.Content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-2xl pointer-events-auto flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Start Over
            </button>
          )}
          <button
            onClick={downloadProduct}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all text-white font-bold flex items-center gap-2 shadow-2xl shadow-green-500/50"
          >
            <Download className="h-5 w-5" />
            Download Product
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  );
}