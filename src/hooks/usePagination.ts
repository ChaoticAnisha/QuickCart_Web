'use client';

import { useState, useMemo } from 'react';
import { calculatePagination } from '@/lib/utils';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationData = useMemo(() => {
    return calculatePagination(totalItems, currentPage, itemsPerPage);
  }, [totalItems, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (paginationData.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationData.hasPrev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(paginationData.totalPages);
  };

  const reset = () => {
    setCurrentPage(initialPage);
  };

  return {
    currentPage,
    totalPages: paginationData.totalPages,
    hasNext: paginationData.hasNext,
    hasPrev: paginationData.hasPrev,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    reset,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: currentPage * itemsPerPage,
  };
}