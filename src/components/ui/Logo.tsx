import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl rotate-3 transform"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl -rotate-3 transform"></div>
        <span className="relative text-white font-bold text-xl z-10">K</span>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 leading-tight">
            K12<span className="text-primary-600">Path</span>
          </span>
          <span className="text-[10px] text-gray-500 tracking-wider uppercase">
            Education Guide
          </span>
        </div>
      )}
    </div>
  );
}
