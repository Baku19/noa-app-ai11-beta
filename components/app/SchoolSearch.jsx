import React, { useState, useEffect, useRef } from 'react';
import { Search, X, School, MapPin, Loader2 } from 'lucide-react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.js';

// Common school name prefixes in Australia
const COMMON_PREFIXES = ['', 'St ', 'The ', 'Mount ', 'Holy ', 'Our ', 'Good ', 'North '];

export default function SchoolSearch({ value, onChange, placeholder = "Search school..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const schoolsRef = collection(db, 'schools');
        const searchTerm = toTitleCase(search);
        
        // Run queries with common prefixes
        const queries = COMMON_PREFIXES.map(prefix => 
          query(
            schoolsRef,
            where('name', '>=', prefix + searchTerm),
            where('name', '<=', prefix + searchTerm + '\uf8ff'),
            limit(5)
          )
        );
        
        const snapshots = await Promise.all(queries.map(q => getDocs(q)));
        
        const schoolsMap = new Map();
        snapshots.forEach(snap => {
          snap.docs.forEach(doc => {
            if (!schoolsMap.has(doc.id)) {
              schoolsMap.set(doc.id, {
                id: doc.id,
                name: doc.data().name,
                suburb: doc.data().suburb,
                state: doc.data().state,
                postcode: doc.data().postcode,
                acaraId: doc.data().acaraId
              });
            }
          });
        });
        
        // Sort alphabetically and limit to 10
        const sorted = Array.from(schoolsMap.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 10);
        
        setResults(sorted);
      } catch (error) {
        console.error('Error searching schools:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  const handleSelect = (school) => {
    onChange({
      id: school.id,
      name: school.name,
      suburb: school.suburb,
      state: school.state,
      postcode: school.postcode,
      acaraId: school.acaraId,
      isManual: false
    });
    setSearch('');
    setIsOpen(false);
    setManualEntry(false);
  };

  const handleManualEntry = () => {
    setManualEntry(true);
    setIsOpen(false);
  };

  const handleManualSave = (name) => {
    onChange({
      id: null,
      name: name,
      suburb: null,
      state: null,
      postcode: null,
      isManual: true
    });
  };

  const clearSelection = () => {
    onChange(null);
    setSearch('');
    setManualEntry(false);
  };

  if (value && !manualEntry) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
          <div className="flex items-center gap-3">
            <School className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-medium text-slate-800">{value.name}</p>
              {value.suburb && (
                <p className="text-sm text-slate-500">{value.suburb}, {value.state} {value.postcode}</p>
              )}
            </div>
          </div>
          <button 
            type="button"
            onClick={clearSelection}
            className="p-1 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    );
  }

  if (manualEntry) {
    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Enter school name manually"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => handleManualSave(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setManualEntry(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-700"
        >
          Search instead
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 animate-spin" />
        )}
      </div>

      {isOpen && (search.length >= 2) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((school) => (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => handleSelect(school)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                >
                  <School className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-800">{school.name}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {school.suburb}, {school.state} {school.postcode}
                    </p>
                  </div>
                </button>
              ))}
              <button
                type="button"
                onClick={handleManualEntry}
                className="w-full p-3 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors text-center font-medium"
              >
                Can't find school? Add manually
              </button>
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-slate-500 text-sm">No schools found for "{search}"</p>
              <button
                type="button"
                onClick={handleManualEntry}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Add school manually
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
