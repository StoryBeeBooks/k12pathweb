'use client';

import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Languages, 
  Calendar, 
  MessageSquare, 
  Users,
  LucideIcon 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { FeaturesData } from '@/types';

interface FeaturesProps {
  data: Record<'en' | 'zh', FeaturesData>;
}

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  BookOpen,
  Languages,
  Calendar,
  MessageSquare,
  Users,
};

const badgeColors: Record<string, string> = {
  'Popular': 'bg-primary-100 text-primary-700',
  '热门': 'bg-primary-100 text-primary-700',
  'New': 'bg-green-100 text-green-700',
  '新功能': 'bg-green-100 text-green-700',
  'Coming Soon': 'bg-yellow-100 text-yellow-700',
  '即将推出': 'bg-yellow-100 text-yellow-700',
};

export default function Features({ data }: FeaturesProps) {
  const { locale } = useLanguage();
  const content = data[locale];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600">
            {content.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || BookOpen;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Badge */}
                {feature.badge && (
                  <div className={`absolute -top-3 right-4 px-3 py-1 text-xs font-semibold rounded-full ${badgeColors[feature.badge] || 'bg-gray-100 text-gray-700'}`}>
                    {feature.badge}
                  </div>
                )}

                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-7 h-7 text-primary-600" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-4 flex items-center text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm">{locale === 'en' ? 'Learn more' : '了解更多'}</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
