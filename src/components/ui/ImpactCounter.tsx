'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ImpactCounterProps {
  targetValue: number;
  label: string;
  suffix?: string;
}

export default function ImpactCounter({ targetValue, label, suffix = '' }: ImpactCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  function animateCount() {
    const duration = 1800;
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * targetValue);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(targetValue);
      }
    };

    requestAnimationFrame(updateCount);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [targetValue]);

  const formattedCount = new Intl.NumberFormat('pt-BR').format(count);

  return (
    <div 
      ref={containerRef} 
      className="bg-brand-gray-light p-8 rounded-2xl border border-brand-gray-surface shadow-sm flex flex-col justify-center items-center h-40 text-center hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
    >
      <div className="text-4xl sm:text-5xl font-black text-brand-teal tracking-tight group-hover:scale-105 transition-transform duration-300">
        {formattedCount}{suffix}
      </div>
      <div className="h-1 w-8 bg-brand-orange group-hover:w-12 transition-all duration-300 my-3 rounded-full" />
      <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
