import React from 'react';
import { Sprout } from 'lucide-react';

export default function LoadingSpinner({ message = "Loading high-yield seeds..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-4">
        <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="w-6 h-6 text-green-600 animate-pulse" />
        </div>
      </div>
      <p className="text-gray-600 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}
