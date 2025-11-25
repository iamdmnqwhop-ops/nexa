'use client';

import { useState } from 'react';
import { ProductSpec, ConceptData } from '../hooks/useNexaFlow';
import { Play, Sparkles, Lock } from 'lucide-react';
import { useWhopEmbeddedAuth } from '../../whop/useWhopEmbeddedAuth';
import { usePaymentStatus } from '../../whop/usePaymentStatus';
import { PaymentModal } from '../../whop/PaymentModal';

interface ProductSpecPreviewProps {
  productSpec: ProductSpec;
  selectedConcept: ConceptData;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

export const ProductSpecPreview = ({
  productSpec,
  selectedConcept,
  onGenerate,
  onBack,
  isGenerating
}: ProductSpecPreviewProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useWhopEmbeddedAuth();
  const { hasPaid, isChecking: isPaymentChecking, markAsPaid } = usePaymentStatus(user?.id);

  // DEV MODE BYPASS - Remove this in production
  const devBypassPayment = false; // Always enforce payment check

  const handleGenerate = () => {
    if (isPaymentChecking) return; // Prevent action while checking

    if (!hasPaid && !devBypassPayment) {
      setShowPaymentModal(true);
      return;
    }
    onGenerate();
  };

  const handlePaymentSuccess = () => {
    markAsPaid();
    setShowPaymentModal(false);
    onGenerate();
  };
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header Section - Centered & Large */}
      <div className="pt-16 pb-12 text-center px-4 animate-float">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight mb-6">
          Product Specification
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
          Your validated specification is ready. Review the details below and generate your complete product.
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-32 max-w-5xl mx-auto w-full">
        {/* Selected Concept Header */}
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
              {productSpec.selected_option}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{productSpec.title}</h2>
              <p className="text-gray-400">Format: <span className="text-blue-400 font-medium capitalize">{productSpec.product_type}</span></p>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">{productSpec.unique_value}</p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Audience */}
          <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">👥</span>
              <h3 className="text-xl font-bold text-white">Target Audience</h3>
            </div>
            <p className="text-gray-300 text-lg">{productSpec.audience}</p>
          </div>

          {/* Core Problem */}
          <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎯</span>
              <h3 className="text-xl font-bold text-white">Core Problem</h3>
            </div>
            <p className="text-red-300 text-lg">{productSpec.core_problem}</p>
          </div>

          {/* Transformation */}
          <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⚡</span>
              <h3 className="text-xl font-bold text-white">Transformation Promise</h3>
            </div>
            <p className="text-yellow-300 text-lg">{productSpec.transformation}</p>
          </div>

          {/* Pain Points */}
          <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔴</span>
              <h3 className="text-xl font-bold text-white">Key Pain Points</h3>
              <span className="ml-auto bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold">
                {productSpec.pain_points.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {productSpec.pain_points.map((point, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-red-400 font-bold text-sm">{index + 1}.</span>
                  <span className="text-gray-300 text-sm">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Framework */}
          <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏗️</span>
              <h3 className="text-xl font-bold text-white">Signature Framework</h3>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
              <div>
                <p className="text-purple-300 font-bold text-lg">{productSpec.signature_framework_name}</p>
                <p className="text-purple-400 text-sm">Proprietary methodology</p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="text-xl font-bold text-white">Use Cases</h3>
              <span className="ml-auto bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                {productSpec.use_cases.length}
              </span>
            </div>
            <div className="space-y-2">
              {productSpec.use_cases.map((useCase, index) => (
                <div key={index} className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-yellow-400 font-bold text-sm">{index + 1}.</span>
                  <span className="text-gray-300 text-sm">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-2xl pointer-events-auto max-w-2xl w-full mx-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isPaymentChecking}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-8 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/50"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Building Your Product...</span>
              </>
            ) : (
              <>
                {!hasPaid && !isPaymentChecking && !devBypassPayment ? (
                  <Lock className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                <div className="text-left">
                  <div className="font-bold text-lg">
                    {!hasPaid && !isPaymentChecking && !devBypassPayment
                      ? "Unlock & Generate Product"
                      : "Generate Complete Product"}
                  </div>
                  <div className="text-xs opacity-90">
                    {!hasPaid && !isPaymentChecking && !devBypassPayment
                      ? "Get full access for $14"
                      : "Ready to build • 7 comprehensive sections"}
                  </div>
                </div>
              </>
            )}
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
