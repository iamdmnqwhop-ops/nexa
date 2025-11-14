'use client';

import { Button } from '@whop/react/components';

interface HeroProps {
  onStart: () => void;
}

export const Hero = ({ onStart }: HeroProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-5xl font-light tracking-tight text-gray-100 mb-4 leading-tight">
          Turn ideas into products
          <br />
          <span className="text-gray-400">Instantly</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
          Drop an idea. Choose a format. Get a structured, sellable product in one click.
        </p>

        <Button
          variant="classic"
          size="4"
          onClick={onStart}
          className="w-full max-w-xs h-12 text-base font-normal"
        >
          Describe Your Idea →
        </Button>
      </div>
    </div>
  );
};