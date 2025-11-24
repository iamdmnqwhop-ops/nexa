'use client';

import { useState, useRef, useEffect } from 'react';
import { useWhopEmbeddedAuth } from '../../whop/useWhopEmbeddedAuth';
import { usePaymentStatus } from '../../whop/usePaymentStatus';
import { PaymentModal } from '../../whop/PaymentModal';
import { ShimmerEffect } from '../../ui/ShimmerEffect';

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const IdeaInput = ({ onSubmit, onCancel, isGenerating }: IdeaInputProps) => {
  const [idea, setIdea] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [showRefinementResults, setShowRefinementResults] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useWhopEmbeddedAuth();
  const { hasPaid, isChecking: isPaymentChecking, markAsPaid } = usePaymentStatus(user?.id);

  // DEV MODE BYPASS - Remove this in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const devBypassPayment = false; // Always enforce payment check

  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [idea]);

  // LINEAR PIPELINE: Submit idea → trigger payment → refinement
  const handleSubmit = async () => {
    if (!idea.trim()) return;

    // HIGH-CONVERSION PLACEMENT: Show payment immediately after idea submission
    if (!hasPaid && !isPaymentChecking && !devBypassPayment) {
      setShowPaymentModal(true);
      return;
    }

    // Call onSubmit which will trigger the flow (useNexaFlow handles the API call)
    onSubmit(idea.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaymentSuccess = async () => {
    markAsPaid();
    setShowPaymentModal(false);
    // User has paid - trigger the flow immediately
    if (idea.trim()) {
      onSubmit(idea.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative w-full max-w-5xl mx-auto">
      {/* Middle Section: Greeting & Inspiration */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[400px] gap-12">
        {/* Greeting */}
        <div className="text-center space-y-6 animate-float">
          <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
            {greeting}
          </h2>
          <p className="text-2xl md:text-3xl text-gray-400 max-w-2xl mx-auto font-light">
            What are we working on today?
          </p>
        </div>

        {/* Inspiration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          {[
            { label: "Productivity Guide", desc: "Create a comprehensive guide for efficiency" },
            { label: "Recipe eBook", desc: "Compile your favorite recipes into a book" },
            { label: "Business Template", desc: "Design professional templates for startups" },
            { label: "Course Outline", desc: "Structure a complete educational course" }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setIdea(`Create a ${item.label.toLowerCase()}`)}
              className="group text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                {item.label}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section: Input Only */}
      <div className="w-full p-6 pb-12 flex flex-col gap-6">
        {/* Input Area */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-4 transition-all duration-300 focus-within:bg-white/15 focus-within:border-blue-500/40 focus-within:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
            <textarea
              ref={textareaRef}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your idea... (e.g., A fitness guide for new moms)"
              disabled={isGenerating}
              className="w-full bg-transparent border-none outline-none text-xl text-white placeholder-gray-400 resize-none min-h-[60px] max-h-[200px] py-2 hide-scrollbar leading-relaxed"
              rows={1}
            />

            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500 font-medium px-2">
                NEXA AI
              </div>
              <button
                onClick={handleSubmit}
                disabled={!idea.trim() || isGenerating || (!hasPaid && !isPaymentChecking && !devBypassPayment)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-blue-600 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform group-hover/btn:translate-x-0.5 transition-transform">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Required Indicator */}
        {!hasPaid && !isPaymentChecking && !devBypassPayment && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-base">
              <span>🔒</span>
              <span>Unlock full access for $14</span>
            </div>
          </div>
        )}
      </div>

      {/* Refinement Loading Overlay */}
      {isRefining && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="nexa-glass rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500/20 flex items-center justify-center animate-pulse-glow">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-white rounded-full animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Idea</h3>
              <p className="text-gray-400 text-sm mb-6">
                Running Layer 3 UVZ analysis to identify strategic opportunities...
              </p>

              <div className="space-y-3 max-w-xs mx-auto">
                <ShimmerEffect delay={200}>
                  <div className="h-2 bg-blue-500/20 rounded-full w-full" />
                </ShimmerEffect>
                <ShimmerEffect delay={400}>
                  <div className="h-2 bg-blue-500/20 rounded-full w-4/5 mx-auto" />
                </ShimmerEffect>
                <ShimmerEffect delay={600}>
                  <div className="h-2 bg-blue-500/20 rounded-full w-3/5 mx-auto" />
                </ShimmerEffect>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};