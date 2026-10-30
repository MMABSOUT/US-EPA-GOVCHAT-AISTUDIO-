import { IconX } from '@tabler/icons-react';
import { FC } from 'react';

import { useTranslation } from 'next-i18next';

interface Props {
  placeholder: string;
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}
const Search: FC<Props> = ({ placeholder, searchTerm, onSearch }) => {
  const { t } = useTranslation('sidebar');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  return (
    <div className="relative flex items-center">
      <input
        className="placeholder-neutral-700 w-full h-[42px] flex-1 rounded-md border border-neutral-200 px-4 py-3 pr-10 text-[14px] leading-3 text-black"
        type="text"
        placeholder={t(placeholder) || ''}
        value={searchTerm}
        onChange={handleSearchChange}
        title="Search"
        aria-label='Search'
      />

      {searchTerm && (
        <button
          type="button"
          aria-label={t('Clear search') || 'Clear search'}
          title={t('Clear search') || 'Clear search'}
          className="absolute right-3 rounded p-1 text-neutral-300 hover:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          onClick={clearSearch}
        >
          <IconX size={18} />
        </button>
      )}
    </div>
  );
};

export default Search;
