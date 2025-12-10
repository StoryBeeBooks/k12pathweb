'use client';

import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import type { HeroData } from '@/types';

interface HeroProps {
  data: Record<'en' | 'zh', HeroData>;
}

export default function Hero({ data }: HeroProps) {
  const { locale } = useLanguage();
  const content = data[locale];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl opacity-20"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              {content.badge}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {content.title.split(content.titleHighlight).map((part, index, array) => (
                <React.Fragment key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                      {content.titleHighlight}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {content.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button variant="primary" size="lg" href="/signup">
                {content.cta.primary}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" href="#demo">
                <Play className="w-5 h-5 mr-2" />
                {content.cta.secondary}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">K</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">K12Path</div>
                      <div className="text-xs text-gray-500">Dashboard</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Active
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
                  <div className="text-sm opacity-90 mb-1">Today&apos;s Progress</div>
                  <div className="text-2xl font-bold mb-2">5 Words Mastered</div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-3/4"></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-gray-900">127</div>
                    <div className="text-xs text-gray-500">Words Learned</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-2xl font-bold text-gray-900">7 🔥</div>
                    <div className="text-xs text-gray-500">Day Streak</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg">
                    Continue Learning
                  </button>
                  <button className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                    🏆
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-bounce">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <span className="text-sm font-semibold text-gray-900">+50 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
