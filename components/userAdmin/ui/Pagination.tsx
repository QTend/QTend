'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Don't render pagination if there's only 1 page
  if (totalPages <= 1) return null;

  // Generate the page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // If we have 7 or fewer pages, just show all of them
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // If we are near the beginning
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    // If we are near the end
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // If we are somewhere in the middle
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-[#F0F0F0]">
      {/* Mobile-friendly brief text (hidden on larger screens) */}
      <div className="hidden sm:block">
        <p className="text-sm text-[#667085]">
          Showing page <span className="font-medium text-[#101828]">{currentPage}</span> of <span className="font-medium text-[#101828]">{totalPages}</span>
        </p>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="flex items-center justify-center w-10 h-10 text-[#667085]">
                  <MoreHorizontal size={16} />
                </div>
              );
            }

            const isCurrent = page === currentPage;

            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page as number)}
                className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-[#68A5441A] text-[#68A544]' // Using your brand green with opacity
                    : 'text-[#667085] hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}