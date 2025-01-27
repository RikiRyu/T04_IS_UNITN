import React, { useState } from 'react';
import { X } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {
  const [dateInput, setDateInput] = useState('');

  const handleDateInput = (value) => {
    let dateStr = value.replace(/\D/g, '');
    if (dateStr.length > 8) dateStr = dateStr.slice(0, 8);
    
    if (dateStr.length >= 2) {
      dateStr = dateStr.slice(0, 2) + '/' + dateStr.slice(2);
    }
    if (dateStr.length >= 5) {
      dateStr = dateStr.slice(0, 5) + '/' + dateStr.slice(5);
    }

    setDateInput(dateStr);

    if (dateStr.length === 10) {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        setFilters(prev => ({...prev, date}));
      }
    } else {
      setFilters(prev => ({...prev, date: ''}));
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      date: '',
      category: ''
    });
    setDateInput('');
  };

  const hasActiveFilters = filters.searchTerm || filters.date || filters.category;

  return (
    <div className="p-4">
      {/* Filters row */}
      <div className="flex items-center gap-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search events..."
          className="w-64 px-4 py-2 rounded bg-white"
          value={filters.searchTerm || ''}
          onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
        />

        {/* Date input */}
        <input
          type="text"
          placeholder="dd/mm/yyyy"
          className="w-36 px-4 py-2 rounded bg-white"
          value={dateInput}
          onChange={(e) => handleDateInput(e.target.value)}
          maxLength={10}
        />

        {/* Category select */}
        <select
          className="w-48 px-4 py-2 rounded bg-white appearance-none cursor-pointer"
          value={filters.category || ''}
          onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
        >
          <option value="">Tutti i tipi</option>
          <option value="cultura">Cultura</option>
          <option value="sport">Sport</option>
          <option value="musica">Musica</option>
          <option value="enogastronomia">Enogastronomia</option>
          <option value="arte e mostre">Arte e mostre</option>
          <option value="mostre">Mostre</option>
          <option value="incontri, convegni e conferenze">Incontri, convegni e conferenze</option>
          <option value="iniziative varie">Iniziative varie</option>
          <option value="feste, mercati e fiere">Feste, mercati e fiere</option>
        </select>
      </div>

      {/* Clear button and active filters row */}
      {hasActiveFilters && (
        <div className="flex items-center gap-4 mt-3">
          <button 
            className="flex items-center gap-2 text-white hover:text-gray-300" 
            onClick={clearFilters}
          >
            <X size={20} />
            Clear all
          </button>
          
          {filters.category && (
            <span className="text-blue-300">
              {filters.category}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;