"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button, Card } from '@whop/react/components';
import { Loader2, Download, Copy, Eye, Clock, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const copySection = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(index);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadProduct = () => {
    // Function to clean markdown for plain text
    const cleanMarkdown = (text: string) => {
      return text
        // Bold text: **word** -> word (handle multiline)
        .replace(/\*\*(.*?)\*\*/gs, '$1')
        // Italic text: *word* -> word (avoid matching inside already processed bold)
        .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, '$1')
        // Headers: ### Heading -> Heading
        .replace(/^#{1,6}\s+/gm, '')
        // Code blocks: `code` -> code
        .replace(/`([^`]+)`/g, '$1')
        // Bullet points: * item -> • item
        .replace(/^\*\s+/gm, '• ')
        // Numbered lists: 1. item -> remove extra numbering if already numbered
        .replace(/^\d+\.\s+/gm, '• ')
        // Blockquotes: > text -> text
        .replace(/^>\s+/gm, '')
        // Clean up any remaining asterisks
        .replace(/\*/g, '')
        // Multiple newlines to single newline
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();
    };

    // Create a formatted text version with cleaned markdown
    let content = `${product.Title}\n`;
    content += "=".repeat(product.Title.length) + "\n\n";
    content += `${cleanMarkdown(product.Summary)}\n\n`;
    content += `Estimated Reading Time: ${product.EstimatedReadingTime}\n\n`;

    product.Sections.forEach((section, index) => {
      content += `${index + 1}. ${section.Heading}\n`;
      content += "-".repeat(section.Heading.length + 3) + "\n\n";
      content += `${cleanMarkdown(section.Content)}\n\n`;
    });

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.Title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show feedback modal after successful download
    setTimeout(() => {
      setShowFeedbackModal(true);
    }, 500);
  };

  
  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>

      {/* Main Content */}
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Product Title Card */}
        <Card
          className="nexa-gray-glow nexa-transition-slow relative overflow-hidden mb-8"
          style={{
            backgroundColor: '#111111',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '0'
          }}
        >
          <div style={{ padding: '2rem', position: 'relative', zIndex: 1 }}>
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h1
                  className="text-white mb-3"
                  style={{
                    fontSize: '2rem',
                    fontWeight: '600',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2'
                  }}
                >
                  {product.Title}
                </h1>
                <p
                  className="text-gray-400 mb-6"
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                  }}
                >
                  {product.Summary}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', border: '1px solid rgba(0, 123, 255, 0.2)', borderRadius: '999px' }}>
                    <Clock className="h-4 w-4" style={{ color: '#007BFF' }} />
                    <span className="text-gray-300 text-sm">{product.EstimatedReadingTime}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '999px' }}>
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{product.Sections.length} Sections</span>
                  </div>
                  <div className="px-3 py-1.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '999px' }}>
                    <span className="text-gray-300 text-sm font-medium">
                      {product.Sections.reduce((acc, s) => acc + s.Content.split(' ').length, 0).toLocaleString()} words
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Frosted overlay */}
          <div
            className="absolute inset-0 pointer-events-none nexa-inner-glow"
            style={{ borderRadius: '12px' }}
          />
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap mb-8">
          {onBack && (
            <Button
              variant="classic"
              size="3"
              onClick={onBack}
              className="flex items-center gap-2 nexa-transition"
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Button>
          )}
          <Button
            variant="classic"
            size="3"
            onClick={downloadProduct}
            className="flex items-center gap-2 nexa-transition"
          >
            <Download className="h-4 w-4" />
            Download as Text
          </Button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <h2
            className="text-white"
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}
          >
            Product Content
          </h2>

          {product.Sections.map((section, index) => (
            <Card
              key={index}
              className="nexa-gray-glow nexa-transition-slow relative overflow-hidden"
              style={{
                backgroundColor: '#111111',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '0'
              }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
                <div
                  className="cursor-pointer nexa-transition hover:nexa-hover-inner-glow"
                  style={{
                    padding: '1.5rem',
                    borderBottom: expandedSections.has(index) ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
                  }}
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-white flex items-center gap-3"
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'rgba(0, 123, 255, 0.15)',
                          borderRadius: '50%',
                          fontSize: '0.9rem',
                          fontWeight: '700'
                        }}
                      >
                        {index + 1}
                      </span>
                      {section.Heading}
                    </h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copySection(section.Content, index);
                        }}
                        className="nexa-transition p-2 rounded-lg hover:bg-white/5"
                        style={{
                          border: copiedSection === index ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: copiedSection === index ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                        }}
                      >
                        {copiedSection === index ? (
                          <span className="text-green-400 text-sm font-medium">Copied!</span>
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <div className="nexa-transition">
                        {expandedSections.has(index) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                {expandedSections.has(index) && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <div style={{ margin: '1rem 0' }} />
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-strong:text-white prose-em:text-gray-300 prose-p:text-gray-300 prose-li:text-gray-300 prose-blockquote:text-gray-400 prose-code:text-green-400 prose-pre:text-gray-300 leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {section.Content}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span className="text-xs text-gray-500">
                        {section.Content.split(' ').length} words
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Frosted overlay */}
              <div
                className="absolute inset-0 pointer-events-none nexa-inner-glow"
                style={{ borderRadius: '12px' }}
              />
            </Card>
          ))}
        </div>

        {/* Footer */}
        <Card
          className="nexa-gray-glow-subtle nexa-transition-slow relative overflow-hidden mt-12"
          style={{
            backgroundColor: '#111111',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '0'
          }}
        >
          <div style={{ padding: '2rem', position: 'relative', zIndex: 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 123, 255, 0.15)' }}
              >
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h3 className="font-semibold text-white">Generated by NEXA</h3>
            </div>
            <p
              className="text-gray-400"
              style={{ fontSize: '0.95rem', lineHeight: '1.5' }}
            >
              This digital product was generated using AI. Review and customize it to fit your specific needs and audience.
            </p>
          </div>

          {/* Frosted overlay */}
          <div
            className="absolute inset-0 pointer-events-none nexa-inner-glow"
            style={{ borderRadius: '12px' }}
          />
        </Card>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        productTitle={product.Title}
      />
    </div>
  );
}