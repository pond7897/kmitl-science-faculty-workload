'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { wrapper: 'w-10 h-10', icon: 'w-4 h-4', text: 'text-lg' },
  md: { wrapper: 'w-20 h-20 sm:w-24 sm:h-24', icon: 'w-8 h-8', text: 'text-2xl' },
  lg: { wrapper: 'w-24 h-24 sm:w-28 sm:h-28', icon: 'w-10 h-10', text: 'text-4xl' },
};

export function ProfileAvatar({ src, name, size = 'lg', className }: ProfileAvatarProps) {
  const { wrapper, icon, text } = sizeMap[size];
  const initial = name ? name.charAt(0).toUpperCase() : null;

  return (
    <div
      className={cn(
        wrapper,
        'relative rounded-full bg-gray-100 dark:bg-[#3d3533] flex items-center justify-center overflow-hidden ring-4 ring-[#F27F0D]/30 dark:ring-[#C96442]/20 shadow-md shrink-0',
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? 'Avatar'}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, 112px"
        />
      ) : initial ? (
        <span className={cn(text, 'font-bold text-[#F27F0D] dark:text-[#C96442]')}>{initial}</span>
      ) : (
        <User className={cn(icon, 'text-gray-400 dark:text-[#8b7f77]')} />
      )}
    </div>
  );
}
