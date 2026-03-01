/**
 * Search Bar — Autocomplete search with history
 */
export class SearchBar {
    private items: string[] = [];
    private history: string[] = [];
    private maxHistory: number;

    constructor(items: string[] = [], maxHistory: number = 20) { this.items = items; this.maxHistory = maxHistory; }

    /** Set searchable items */
    setItems(items: string[]): this { this.items = items; return this; }

    /** Fuzzy search */
    search(query: string): string[] {
        if (!query) return [];
        const q = query.toLowerCase();
        return this.items.filter((item) => item.toLowerCase().includes(q))
            .sort((a, b) => a.toLowerCase().indexOf(q) - b.toLowerCase().indexOf(q));
    }

    /** Highlight matching text */
    static highlight(text: string, query: string): string {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /** Add to search history */
    addToHistory(query: string): void {
        this.history = [query, ...this.history.filter((h) => h !== query)].slice(0, this.maxHistory);
    }

    /** Get search history */
    getHistory(): string[] { return [...this.history]; }

    /** Clear search history */
    clearHistory(): void { this.history = []; }

    /** Save history to storage */
    async saveHistory(key: string = '__search_history__'): Promise<void> {
        await chrome.storage.local.set({ [key]: this.history });
    }

    /** Load history from storage */
    async loadHistory(key: string = '__search_history__'): Promise<void> {
        const result = await chrome.storage.local.get(key);
        this.history = (result[key] as string[]) || [];
    }

    /** Render search bar into container */
    render(containerId: string, onSelect: (item: string) => void): void {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        const input = document.createElement('input'); input.type = 'text'; input.placeholder = 'Search...';
        Object.assign(input.style, { width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', fontFamily: '-apple-system,sans-serif' });
        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, { position: 'absolute', width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '4px', maxHeight: '200px', overflowY: 'auto', display: 'none', zIndex: '999', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' });
        container.style.position = 'relative';
        input.addEventListener('input', () => {
            const results = this.search(input.value);
            dropdown.innerHTML = results.map((r) => `<div style="padding:8px 14px;cursor:pointer;font-size:14px" class="search-item">${SearchBar.highlight(r, input.value)}</div>`).join('');
            dropdown.style.display = results.length ? 'block' : 'none';
            dropdown.querySelectorAll('.search-item').forEach((el, i) => {
                el.addEventListener('click', () => { this.addToHistory(results[i]); onSelect(results[i]); input.value = results[i]; dropdown.style.display = 'none'; });
            });
        });
        container.appendChild(input); container.appendChild(dropdown);
    }
}
