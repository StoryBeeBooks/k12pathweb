'use client';

import React from 'react';
import { MessageCircleQuestion, Compass, Clock, Users, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { PainPointsData } from '@/types';

interface PainPointsProps {
  data: Record<'en' | 'zh', PainPointsData>;
}

const iconMap: Record<string, LucideIcon> = {
  MessageCircleQuestion,
  Compass,
  Clock,
  Users,
};

export default function PainPoints({ data }: PainPointsProps) {
  const { locale } = useLanguage();
  const content = data[locale];

  return (
    <section className="py-20 bg-gray-50">
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

        {/* Pain Points Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.items.map((item, index) => {
            const IconComponent = iconMap[item.icon] || MessageCircleQuestion;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-100"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <IconComponent className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Transition Text */}
        <div className="mt-16 text-center">
          <p className="text-xl text-gray-700 font-medium">
            {locale === 'en' 
              ? "You don't have to figure this out alone. K12Path is here to help." 
              : "您不必独自面对这些。K12Path在这里帮助您。"
            }
          </p>
          <div className="mt-4">
            <span className="text-4xl">👇</span>
          </div>
        </div>
      </div>
    </section>
  );
}
