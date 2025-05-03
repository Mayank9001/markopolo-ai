// src/hooks/usePaginatedUsers.js
import { useCallback, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

export const usePaginatedUsers = (search) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNextPage = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const response = await axios.get(API_URL, {
        params: {
          page,
          limit: 50,
          search,
        },
      });
      const newUsers = response.data.data;
      setUsers((prev) => [...prev, ...newUsers]);
      setHasMore(newUsers.length > 0);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, search]);

  const reset = useCallback(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return { users, fetchNextPage, hasMore, isLoading, error, reset };
};
