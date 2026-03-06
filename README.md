# webext-search-bar

[![npm version](https://img.shields.io/npm/v/webext-search-bar)](https://npmjs.com/package/webext-search-bar)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

Search bar component for Chrome extensions. Autocomplete, substring matching, search history, keyboard navigation, and result highlighting for Manifest V3.

INSTALL

```bash
npm install webext-search-bar
```

QUICK START

```typescript
import { SearchBar } from 'webext-search-bar';

const bar = new SearchBar(['Settings', 'Profile', 'Dashboard', 'Logout'], 10);

const results = bar.search('set');
// => ['Settings']

const highlighted = SearchBar.highlight('Settings', 'set');
// => '<mark>Set</mark>tings'

bar.addToHistory('Settings');
bar.getHistory();
// => ['Settings']

await bar.saveHistory('my_history_key');
await bar.loadHistory('my_history_key');

bar.render('search-container', (selected) => {
  console.log('User selected:', selected);
});
```

API

SearchBar class

`new SearchBar(items?: string[], maxHistory?: number)`

Creates a new instance. `items` defaults to an empty array. `maxHistory` defaults to 20. Negative or non-finite values for `maxHistory` fall back to 20.

`setItems(items: string[]): this`

Replaces the searchable items list. Returns the instance for chaining. Non-array input is silently replaced with an empty array.

`search(query: string): string[]`

Performs a case-insensitive substring search across all items. Results are sorted by match position so earlier matches rank higher. Returns an empty array for empty or non-string queries.

`static highlight(text: string, query: string): string`

Wraps matching portions of text in `<mark>` tags. Special regex characters in the query are escaped automatically. Returns the original text if the query is empty or if the regex fails.

`addToHistory(query: string): void`

Pushes a query to the front of the search history. Duplicates are removed and the list is capped at `maxHistory`.

`getHistory(): string[]`

Returns a copy of the current search history array.

`clearHistory(): void`

Clears all search history entries.

`saveHistory(key?: string): Promise<void>`

Persists history to `chrome.storage.local`. The key defaults to `'__search_history__'`. Throws `SearchBarError` with code `STORAGE_ERROR` if storage is unavailable or the key is invalid.

`loadHistory(key?: string): Promise<void>`

Loads history from `chrome.storage.local`. Same key default and error behavior as `saveHistory`.

`render(containerId: string, onSelect: (item: string) => void): void`

Renders an interactive search bar with a dropdown into a DOM container. The container is looked up by `document.getElementById`. The input field triggers live search on every keystroke, and clicking a suggestion calls `onSelect` with the selected item and records it in history.

Throws `SearchBarError` with code `INVALID_CONTAINER` if the element is missing, `INVALID_CALLBACK` if `onSelect` is not a function, or `RENDER_ERROR` on DOM failures.

SearchBarError class

`new SearchBarError(message: string, code: string, operation: string, originalError?: Error)`

Custom error with structured fields. `code` is one of the `SearchBarErrorCode` values. `operation` is the method name that threw. `originalError` preserves the underlying cause when available.

SearchBarErrorCode

| Code | Meaning |
| -------------------- | ---------------------------------- |
| `STORAGE_ERROR` | chrome.storage read/write failure |
| `INVALID_CONTAINER` | Container element not found in DOM |
| `INVALID_CALLBACK` | Callback is not a function |
| `INVALID_QUERY` | Invalid search query |
| `RENDER_ERROR` | DOM rendering failure |

REQUIREMENTS

Your extension manifest needs the `storage` permission to use `saveHistory` and `loadHistory`.

```json
{
  "permissions": ["storage"]
}
```

LICENSE

MIT. See LICENSE file.

---

Built by theluckystrike / [zovo.one](https://zovo.one)
