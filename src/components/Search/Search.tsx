import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleSearch } from '../SearchBar/SearchBar';

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('term');

  const isSameLocation = (url: string) => url === location.pathname;

  const performAction = (url: string) => {
    isSameLocation(url) ? window.location.reload() : navigate(url);
  };

  useEffect(() => {
    if (!searchTerm) navigate(-1);

    handleSearch(searchTerm, performAction);
  }, [navigate, searchTerm]);

  return null;
};
