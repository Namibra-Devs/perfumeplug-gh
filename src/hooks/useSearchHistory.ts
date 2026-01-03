// src/hooks/useSearchHistory.ts
import { useState, useEffect, useCallback } from 'react';

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  count: number; // How many times this search was performed
}

const SEARCH_HISTORY_KEY = 'perfumeplug_search_history';
const MAX_HISTORY_ITEMS = 10;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SearchHistoryItem[];
        // Sort by count (most searched) and then by timestamp (most recent)
        const sorted = parsed.sort((a, b) => {
          if (a.count !== b.count) {
            return b.count - a.count; // Higher count first
          }
          return b.timestamp - a.timestamp; // More recent first
        });
        setSearchHistory(sorted);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
      setSearchHistory([]);
    }
  }, []);

  // Save search history to localStorage
  const saveToStorage = useCallback((history: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }, []);

  // Add a search term to history
  const addSearchTerm = useCallback((query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    
    // Don't add empty queries or very short queries
    if (!trimmedQuery || trimmedQuery.length < 2) {
      return;
    }

    setSearchHistory(prevHistory => {
      // Check if this search term already exists
      const existingIndex = prevHistory.findIndex(item => 
        item.query.toLowerCase() === trimmedQuery
      );

      let newHistory: SearchHistoryItem[];

      if (existingIndex >= 0) {
        // Update existing item - increment count and update timestamp
        newHistory = [...prevHistory];
        newHistory[existingIndex] = {
          ...newHistory[existingIndex],
          count: newHistory[existingIndex].count + 1,
          timestamp: Date.now()
        };
      } else {
        // Add new item
        const newItem: SearchHistoryItem = {
          id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          query: trimmedQuery,
          timestamp: Date.now(),
          count: 1
        };
        newHistory = [newItem, ...prevHistory];
      }

      // Sort by count (descending) and then by timestamp (descending)
      newHistory.sort((a, b) => {
        if (a.count !== b.count) {
          return b.count - a.count;
        }
        return b.timestamp - a.timestamp;
      });

      // Limit to MAX_HISTORY_ITEMS
      if (newHistory.length > MAX_HISTORY_ITEMS) {
        newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
      }

      // Save to localStorage
      saveToStorage(newHistory);
      
      return newHistory;
    });
  }, [saveToStorage]);

  // Remove a specific search term
  const removeSearchTerm = useCallback((id: string) => {
    setSearchHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== id);
      saveToStorage(newHistory);
      return newHistory;
    });
  }, [saveToStorage]);

  // Clear all search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }, []);

  // Get popular search terms (most searched)
  const getPopularSearches = useCallback((limit: number = 6) => {
    return searchHistory
      .filter(item => item.count > 1) // Only show terms searched more than once
      .slice(0, limit);
  }, [searchHistory]);

  // Get recent search terms
  const getRecentSearches = useCallback((limit: number = 6) => {
    return [...searchHistory]
      .sort((a, b) => b.timestamp - a.timestamp) // Sort by most recent
      .slice(0, limit);
  }, [searchHistory]);

  return {
    searchHistory,
    addSearchTerm,
    removeSearchTerm,
    clearSearchHistory,
    getPopularSearches,
    getRecentSearches,
    hasHistory: searchHistory.length > 0
  };
}