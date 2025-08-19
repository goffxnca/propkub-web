import { useState, useEffect } from 'react';

const usePagination = (fetchFunction, initialPerPage = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async (pageNumber = page, pageSize = perPage) => {
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

  const goToPage = (newPage) => {
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

  const changePerPage = (newPerPage) => {
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
    refresh,
  };
};

export default usePagination; 