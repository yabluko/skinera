'use client';

import { memo } from 'react';

interface CategoryButtonProps {
  onClick: () => void;
  selectedCategories: string[];
  totalCategories: number;
}

const CategoryButton = memo(({ onClick, selectedCategories }: CategoryButtonProps) => {
  return (
    <div
      onClick={onClick}
      className="
        md:hidden flex items-center justify-between gap-4 px-4 py-3 
        bg-white border border-gray-200 rounded-xl 
        hover:border-pink-300 hover:bg-white 
        transition-all duration-300 group
        shadow-xs hover:shadow-md
        flex-1 min-w-0
      "
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg">🏷️</span>
        <div className="text-left">
          <div className="font-medium text-gray-700">Категорії</div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Active filters indicator */}
        {selectedCategories.length > 0 && (
          <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-semibold">
            {selectedCategories.length}
          </span>
        )}
      </div>
    </div>
  );
});

CategoryButton.displayName = 'CategoryButton';

export default CategoryButton;
