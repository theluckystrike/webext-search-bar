# webext-search-bar

[![npm version](https://img.shields.io/npm/v/webext-search-bar)](https://npmjs.com/package/webext-search-bar)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-search-bar?style=social)](https://github.com/theluckystrike/webext-search-bar)

> Search bar component for Chrome extensions -- autocomplete, fuzzy matching, search history, keyboard navigation, and result highlighting for MV3.

## Install

```bash
npm install webext-search-bar
```

## Usage

```typescript
import { SearchBar } from 'webext-search-bar';

// Create a search bar with items and max history size
const bar = new SearchBar(['Settings', 'Profile', 'Dashboard', 'Logout'], 10);

// Programmatic search with fuzzy matching
const results = bar.search('set');
// => ['Settings']

// Highlight matching text in results
const highlighted = SearchBar.highlight('Settings', 'set');
// => '<mark>Set</mark>tings'

// Manage search history
bar.addToHistory('Settings');
bar.getHistory();
// => ['Settings']

// Persist history to chrome.storage
await bar.saveHistory('my_history_key');
await bar.loadHistory('my_history_key');

// Render an interactive search bar into the DOM
bar.render('search-container', (selected) => {
  console.log('User selected:', selected);
});
```

## API

### `SearchBar` (class)

#### `new SearchBar(items?: string[], maxHistory?: number)`

Creates a new search bar instance.

- **items** (`string[]`, default `[]`) -- Initial list of searchable items.
- **maxHistory** (`number`, default `20`) -- Maximum number of history entries to retain.

#### `setItems(items: string[]): this`

Replaces the searchable items list. Returns the instance for chaining.

- **items** (`string[]`) -- The new list of searchable items.

#### `search(query: string): string[]`

Performs a case-insensitive substring search across all items, sorted by match position.

- **query** (`string`) -- The search query.
- **Returns** `string[]` -- Matching items sorted by relevance.

#### `static highlight(text: string, query: string): string`

Wraps matching portions of text in `<mark>` tags for display.

- **text** (`string`) -- The text to highlight within.
- **query** (`string`) -- The substring to highlight.
- **Returns** `string` -- HTML string with `<mark>` tags around matches.

#### `addToHistory(query: string): void`

Adds a query to the front of the search history, deduplicating and capping at `maxHistory`.

- **query** (`string`) -- The search query to record.

#### `getHistory(): string[]`

Returns a copy of the current search history array.

- **Returns** `string[]` -- The search history entries.

#### `clearHistory(): void`

Clears all search history entries.

#### `saveHistory(key?: string): Promise<void>`

Persists search history to `chrome.storage.local`.

- **key** (`string`, default `'__search_history__'`) -- The storage key.
- **Throws** `SearchBarError` with code `STORAGE_ERROR` if storage is unavailable or the key is invalid.

#### `loadHistory(key?: string): Promise<void>`

Loads search history from `chrome.storage.local`.

- **key** (`string`, default `'__search_history__'`) -- The storage key.
- **Throws** `SearchBarError` with code `STORAGE_ERROR` if storage is unavailable or the key is invalid.

#### `render(containerId: string, onSelect: (item: string) => void): void`

Renders an interactive search bar with dropdown suggestions into a DOM container.

- **containerId** (`string`) -- The `id` of the container element.
- **onSelect** (`(item: string) => void`) -- Callback invoked when the user selects a result.
- **Throws** `SearchBarError` with code `INVALID_CONTAINER` if the element is not found, `INVALID_CALLBACK` if `onSelect` is not a function, or `RENDER_ERROR` on DOM failures.

### `SearchBarError` (class)

Custom error class with structured metadata.

#### `new SearchBarError(message: string, code: string, operation: string, originalError?: Error)`

- **message** (`string`) -- Human-readable error message.
- **code** (`string`) -- One of the `SearchBarErrorCode` values.
- **operation** (`string`) -- The method name that threw the error.
- **originalError** (`Error`, optional) -- The underlying error, if any.

### `SearchBarErrorCode` (const object)

Error code constants:

| Code                 | Description                          |
| -------------------- | ------------------------------------ |
| `STORAGE_ERROR`      | chrome.storage read/write failure    |
| `INVALID_CONTAINER`  | Container element not found in DOM   |
| `INVALID_CALLBACK`   | Callback argument is not a function  |
| `INVALID_QUERY`      | Invalid search query                 |
| `RENDER_ERROR`       | DOM rendering failure                |

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built by [Zovo](https://zovo.one)

### Related Zovo Repositories

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Production-ready Chrome extension starter
- [awesome-chrome-extensions-dev](https://github.com/theluckystrike/awesome-chrome-extensions-dev) - Curated list of Chrome extension development resources
- [webext-toast-notifications](https://github.com/theluckystrike/webext-toast-notifications) - Toast notifications

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions

Visit [zovo.one](https://zovo.one) for more information.
