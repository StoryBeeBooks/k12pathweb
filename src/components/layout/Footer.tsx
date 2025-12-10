'use client';

import React, { useState } from 'react';
import { Twitter, Facebook, Linkedin, Youtube, Send } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useLanguage } from '@/context/LanguageContext';
import navigationData from '@/data/navigation.json';
import type { NavigationData, FooterData } from '@/types';

const navData = navigationData as NavigationData;

const socialIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const { locale } = useLanguage();
  
  const footerContent: FooterData = navData.footer[locale];
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo className="[&_span]:text-white [&_.text-gray-900]:text-white [&_.text-gray-500]:text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              {footerContent.description}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {footerContent.social.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                  aria-label={social.label}
                >
                  {socialIcons[social.platform]}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerContent.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {footerContent.newsletter.title}
              </h3>
              <p className="text-sm text-gray-400">
                {footerContent.newsletter.subtitle}
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={footerContent.newsletter.placeholder}
                required
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{footerContent.newsletter.button}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} {footerContent.copyright}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-600">
                Made with ❤️ for immigrant families
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
