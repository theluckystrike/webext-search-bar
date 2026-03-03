/**
 * Search Bar — Autocomplete search with history
 */

export class SearchBarError extends Error {
    constructor(
        message: string,
        public code: string,
        public operation: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'SearchBarError';
        if (originalError && originalError.stack) {
            this.stack = originalError.stack;
        }
    }
}

export const SearchBarErrorCode = {
    STORAGE_ERROR: 'STORAGE_ERROR',
    INVALID_CONTAINER: 'INVALID_CONTAINER',
    INVALID_CALLBACK: 'INVALID_CALLBACK',
    INVALID_QUERY: 'INVALID_QUERY',
    RENDER_ERROR: 'RENDER_ERROR',
} as const;

/**
 * Search Bar — Autocomplete search with history and proper error handling
 */
export class SearchBar {
    private items: string[] = [];
    private history: string[] = [];
    private maxHistory: number;

    constructor(items: string[] = [], maxHistory: number = 20) { 
        this.items = items; 
        if (maxHistory < 0 || !Number.isFinite(maxHistory)) {
            this.maxHistory = 20;
        } else {
            this.maxHistory = maxHistory;
        }
    }

    /** Set searchable items */
    setItems(items: string[]): this { 
        this.items = Array.isArray(items) ? items : []; 
        return this; 
    }

    /** Fuzzy search */
    search(query: string): string[] {
        if (!query || typeof query !== 'string') return [];
        const q = query.toLowerCase();
        return this.items.filter((item) => item.toLowerCase().includes(q))
            .sort((a, b) => a.toLowerCase().indexOf(q) - b.toLowerCase().indexOf(q));
    }

    /** Highlight matching text */
    static highlight(text: string, query: string): string {
        if (!query || typeof query !== 'string') return text;
        try {
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        } catch (error) {
            // If regex fails, return original text
            return text;
        }
    }

    /** Add to search history */
    addToHistory(query: string): void {
        if (!query || typeof query !== 'string') return;
        this.history = [query, ...this.history.filter((h) => h !== query)].slice(0, this.maxHistory);
    }

    /** Get search history */
    getHistory(): string[] { return [...this.history]; }

    /** Clear search history */
    clearHistory(): void { this.history = []; }

    /** Save history to storage */
    async saveHistory(key: string = '__search_history__'): Promise<void> {
        if (!key || typeof key !== 'string') {
            throw new SearchBarError(
                `Invalid storage key: must be a non-empty string. Received: ${typeof key}`,
                SearchBarErrorCode.STORAGE_ERROR,
                'saveHistory'
            );
        }
        try {
            await chrome.storage.local.set({ [key]: this.history });
        } catch (error) {
            throw new SearchBarError(
                `Failed to save search history: ${(error as Error).message}. ` +
                'Make sure chrome.storage is available and you have the "storage" permission.',
                SearchBarErrorCode.STORAGE_ERROR,
                'saveHistory',
                error as Error
            );
        }
    }

    /** Load history from storage */
    async loadHistory(key: string = '__search_history__'): Promise<void> {
        if (!key || typeof key !== 'string') {
            throw new SearchBarError(
                `Invalid storage key: must be a non-empty string. Received: ${typeof key}`,
                SearchBarErrorCode.STORAGE_ERROR,
                'loadHistory'
            );
        }
        try {
            const result = await chrome.storage.local.get(key);
            this.history = (result[key] as string[]) || [];
        } catch (error) {
            throw new SearchBarError(
                `Failed to load search history: ${(error as Error).message}. ` +
                'Make sure chrome.storage is available and you have the "storage" permission.',
                SearchBarErrorCode.STORAGE_ERROR,
                'loadHistory',
                error as Error
            );
        }
    }

    /** Render search bar into container */
    render(containerId: string, onSelect: (item: string) => void): void {
        if (!containerId || typeof containerId !== 'string') {
            throw new SearchBarError(
                `Invalid container ID: must be a non-empty string. Received: ${typeof containerId}`,
                SearchBarErrorCode.INVALID_CONTAINER,
                'render'
            );
        }
        
        if (typeof onSelect !== 'function') {
            throw new SearchBarError(
                `Invalid onSelect callback: must be a function. Received: ${typeof onSelect}`,
                SearchBarErrorCode.INVALID_CALLBACK,
                'render'
            );
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            throw new SearchBarError(
                `Container not found: No element with id "${containerId}" found in the DOM. ` +
                'Make sure the element exists before calling render().',
                SearchBarErrorCode.INVALID_CONTAINER,
                'render'
            );
        }
        
        try {
            container.innerHTML = '';
            const input = document.createElement('input'); 
            input.type = 'text'; 
            input.placeholder = 'Search...';
            Object.assign(input.style, { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontFamily: '-apple-system,sans-serif' });
            const dropdown = document.createElement('div');
            Object.assign(dropdown.style, { position: 'absolute', width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '4px', maxHeight: '200px', overflowY: 'auto', display: 'none', zIndex: '999', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' });
            container.style.position = 'relative';
            
            input.addEventListener('input', () => {
                const results = this.search(input.value);
                dropdown.innerHTML = results.map((r) => `<div style="padding:8px 14px;cursor:pointer;font-size:14px" class="search-item">${SearchBar.highlight(r, input.value)}</div>`).join('');
                dropdown.style.display = results.length ? 'block' : 'none';
                dropdown.querySelectorAll('.search-item').forEach((el, i) => {
                    el.addEventListener('click', () => { 
                        this.addToHistory(results[i]); 
                        onSelect(results[i]); 
                        input.value = results[i]; 
                        dropdown.style.display = 'none'; 
                    });
                });
            });
            container.appendChild(input); 
            container.appendChild(dropdown);
        } catch (error) {
            throw new SearchBarError(
                `Failed to render search bar: ${(error as Error).message}`,
                SearchBarErrorCode.RENDER_ERROR,
                'render',
                error as Error
            );
        }
    }
}
