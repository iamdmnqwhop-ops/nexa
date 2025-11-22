'use client';

import { WhopEmbeddedAuthProvider } from '@/components/whop/useWhopEmbeddedAuth';
import { ProtectedRoute } from '@/components/whop/ProtectedRoute';
import { FlowManager } from '@/components/nexa/FlowManager';

export default function Page() {
  return (
    <WhopEmbeddedAuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen nexa-bg-mesh flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 flex justify-center items-center border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/15">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-bold text-white">NEXA</h1>
            </div>
          </div>

          {/* Main NEXA Flow */}
          <div className="flex-1 flex flex-col">
            <FlowManager />
          </div>
        </div>
      </ProtectedRoute>
    </WhopEmbeddedAuthProvider>
  );
}