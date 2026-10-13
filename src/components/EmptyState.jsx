import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = "No items found",
  description = "Explore our certified agricultural seed collection and start adding items to your list.",
  actionText = "Shop Now",
  actionLink = "/products",
  onAction = null
}) {
  return (
    <div className="bg-white rounded-lg p-10 text-center max-w-lg mx-auto my-8 shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 ring-8 ring-green-50/50">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {onAction ? (
        <button
          onClick={onAction}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-md shadow hover:shadow-md transition duration-200"
        >
          {actionText}
        </button>
      ) : (
        <Link
          to={actionLink}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-md shadow hover:shadow-md transition duration-200 inline-block"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
