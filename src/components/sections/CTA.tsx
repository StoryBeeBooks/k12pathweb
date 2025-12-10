'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import type { CTAData } from '@/types';

interface CTAProps {
  data: Record<'en' | 'zh', CTAData>;
}

export default function CTA({ data }: CTAProps) {
  const { locale } = useLanguage();
  const content = data[locale];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Sparkle Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-8">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {content.title}
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
          {content.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            variant="secondary" 
            size="lg" 
            href="/signup"
            className="bg-white text-primary-700 hover:bg-gray-100"
          >
            {content.primaryButton}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            href="/demo"
            className="border-white text-white hover:bg-white/10"
          >
            {content.secondaryButton}
          </Button>
        </div>

        {/* Note */}
        <p className="text-sm text-primary-200">
          {content.note}
        </p>
      </div>
    </section>
  );
}
