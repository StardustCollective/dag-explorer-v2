import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleSearch } from '../SearchBar/SearchBar';
import { useNetwork } from '../../context/NetworkContext';

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { network } = useNetwork();

  const searchTerm = searchParams.get('term');

  const isSameLocation = (url: string) => url === location.pathname;

  const performAction = (url: string) => {
    isSameLocation(url) ? window.location.reload() : navigate(url);
  };

  useEffect(() => {
    if (!searchTerm) navigate(-1);
    handleSearch(searchTerm, performAction, network);
  }, [navigate, searchTerm]);

  return null;
};
