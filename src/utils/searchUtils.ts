// src/utils/searchUtils.ts

/**
 * Utility functions for search functionality
 */

export interface CategoryMatch {
    id: string;
    name: string;
    href: string;
    count?: number;
}

/**
 * Matches search query against categories
 * @param query - The search query
 * @param categories - Array of categories to match against
 * @returns Matched category or null
 */
export function matchCategory(query: string, categories: CategoryMatch[]): CategoryMatch | null {
    const normalizedQuery = query.trim().toLowerCase();
    
    if (!normalizedQuery || categories.length === 0) {
        return null;
    }

    // Exact ID match (highest priority)
    const exactIdMatch = categories.find(cat => cat.id === normalizedQuery);
    if (exactIdMatch) return exactIdMatch;

    // Exact name match (case insensitive)
    const exactNameMatch = categories.find(cat => 
        cat.name.toLowerCase() === normalizedQuery
    );
    if (exactNameMatch) return exactNameMatch;

    // Partial name match (contains query)
    const partialMatch = categories.find(cat => 
        cat.name.toLowerCase().includes(normalizedQuery)
    );
    if (partialMatch) return partialMatch;

    // Word match in name
    const words = normalizedQuery.split(' ');
    const wordMatch = categories.find(cat => 
        words.some(word => cat.name.toLowerCase().includes(word))
    );
    
    return wordMatch || null;
}

/**
 * Debounce function for search input
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Highlights search terms in text
 * @param text - Text to highlight
 * @param query - Search query
 * @returns Text with highlighted terms
 */
export function highlightSearchTerms(text: string, query: string): string {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Formats category name for display
 * @param categoryId - Category ID
 * @returns Formatted category name
 */
export function formatCategoryName(categoryId: string): string {
    const categoryNames: Record<string, string> = {
        'men': "Men's Perfumes",
        'women': "Women's Perfumes",
        'unisex': 'Unisex',
        'luxury': 'Luxury Collection',
        'body-sprays': 'Body Sprays',
        'gift-sets': 'Gift Sets'
    };
    
    return categoryNames[categoryId] || 
           categoryId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Validates search query
 * @param query - Search query to validate
 * @returns Object with validation result and message
 */
export function validateSearchQuery(query: string): { isValid: boolean; message?: string } {
    const trimmed = query.trim();
    
    if (!trimmed) {
        return { isValid: false, message: 'Search query cannot be empty' };
    }
    
    if (trimmed.length < 2) {
        return { isValid: false, message: 'Search query must be at least 2 characters' };
    }
    
    if (trimmed.length > 100) {
        return { isValid: false, message: 'Search query is too long' };
    }
    
    return { isValid: true };
}