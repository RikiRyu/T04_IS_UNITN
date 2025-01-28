import React, { useState } from 'react';
import { X } from 'lucide-react';  // Import X icon for clear button

/**
 * FilterBar Component
 * Provides filtering functionality for events including search, date selection, and category filtering
 */

const FilterBar = ({ filters, setFilters }) => {
  // State for managing date input formatting
  const [dateInput, setDateInput] = useState('');

  /**
   * Handles date input formatting and validation
   * Formats input to dd/mm/yyyy pattern and validates date
   */
  const handleDateInput = (value) => {
    // Remove non-numeric characters
    let dateStr = value.replace(/\D/g, '');
    if (dateStr.length > 8) dateStr = dateStr.slice(0, 8);
    
    // Add slashes after day and month
    if (dateStr.length >= 2) {
      dateStr = dateStr.slice(0, 2) + '/' + dateStr.slice(2);
    }
    if (dateStr.length >= 5) {
      dateStr = dateStr.slice(0, 5) + '/' + dateStr.slice(5);
    }

    setDateInput(dateStr);

    // If input is complete, parse and validate date
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

  /**
   * Resets all filters to their default values
   */
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      date: '',
      category: ''
    });
    setDateInput('');
  };

  // Check if any filters are currently active
  const hasActiveFilters = filters.searchTerm || filters.date || filters.category;

  return (
    <div className="p-4"> {/* Container with padding */}
      {/* Filter controls container with flex layout */}
      <div className="flex items-center gap-4">
        {/* Search input field */}
        <input
          type="text"
          placeholder="Search events..."
          className="w-64 px-4 py-2 rounded bg-white" // 16rem width, padding, rounded corners
          value={filters.searchTerm || ''}
          onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
        />

        {/* Date input field */}
        <input
          type="text"
          placeholder="dd/mm/yyyy"
          className="w-36 px-4 py-2 rounded bg-white" // 9rem width, padding, rounded corners
          value={dateInput}
          onChange={(e) => handleDateInput(e.target.value)}
          maxLength={10}
        />

        {/* Category dropdown */}
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

      {/* Clear filters section - only shown when filters are active */}
      {hasActiveFilters && (
        <div className="flex items-center gap-4 mt-3">
          {/* Clear all button */}
          <button 
            className="flex items-center gap-2 text-white hover:text-gray-300" 
            onClick={clearFilters}
          >
            <X size={20} />
            Clear all
          </button>
          
          {/* Active category display */}
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