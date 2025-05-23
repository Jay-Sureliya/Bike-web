import { useState, useEffect } from 'react';

const SearchBar = ({ isVisible, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) setShow(true);
    else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      onClose();
    }
  };

  return (
    <div
      className={`overflow-hidden bg-gray-100 transition-all duration-300 ease-in-out ${
        isVisible ? 'max-h-20 p-2 opacity-100' : 'max-h-0 p-0 opacity-0'
      }`}
      style={{ transitionProperty: 'max-height, opacity, padding' }}
    >
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-grow p-2 border border-gray-300 rounded focus:outline-none"
          autoFocus
        />
        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 px-3 rounded hover:bg-gray-300"
          aria-label="Close search"
        >
          ×
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
