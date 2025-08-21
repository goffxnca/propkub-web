import { useState, useEffect } from 'react';

interface PaginationResponse {
  items: any[];
  total_count: number;
}

interface UsePaginationReturn {
  data: any[];
  loading: boolean;
  error: string;
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (newPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePerPage: (newPerPage: number) => void;
  refresh: () => void;
}

const usePagination = (
  fetchFunction: (
    pageNumber: number,
    pageSize: number
  ) => Promise<PaginationResponse>,
  initialPerPage: number = 10
): UsePaginationReturn => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(initialPerPage);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchData = async (
    pageNumber: number = page,
    pageSize: number = perPage
  ) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchFunction(pageNumber, pageSize);
      setData(response.items || []);
      setTotalCount(response.total_count || 0);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, perPage]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalCount / perPage)) {
      setPage(newPage);
    }
  };

  const nextPage = () => {
    goToPage(page + 1);
  };

  const prevPage = () => {
    goToPage(page - 1);
  };

  const changePerPage = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing page size
  };

  const refresh = () => {
    fetchData();
  };

  const totalPages = Math.ceil(totalCount / perPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    data,
    loading,
    error,
    page,
    perPage,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    changePerPage,
    refresh
  };
};

export default usePagination;
