# webext-search-bar — Search Component for Extensions

[![npm version](https://img.shields.io/npm/v/webext-search-bar)](https://npmjs.com/package/webext-search-bar)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/webext-search-bar/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-search-bar/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-search-bar?style=social)](https://github.com/theluckystrike/webext-search-bar)

> Fuzzy search with autocomplete dropdown, history, highlighting, and render-to-container.

**webext-search-bar** provides a powerful search component for Chrome extensions. Implement fuzzy search, autocomplete dropdowns, search history, and text highlighting with a simple, customizable API.

Part of the [Zovo](https://zovo.one) developer tools family.

## Features

- ✅ **Fuzzy Search** - Smart matching with typos
- ✅ **Autocomplete Dropdown** - Show results as you type
- ✅ **Search History** - Remember recent searches
- ✅ **Text Highlighting** - Highlight matched text
- ✅ **Render-to-Container** - Render anywhere in DOM
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install webext-search-bar
```

## Quick Start

```typescript
import { SearchBar } from 'webext-search-bar';

const search = new SearchBar(['Settings', 'History', 'Bookmarks']);
search.render('search-container', (item) => navigate(item));
```

## Usage Examples

### Basic Search

```typescript
const search = new SearchBar([
  { id: 1, title: 'Settings', category: 'General' },
  { id: 2, title: 'History', category: 'Privacy' },
  { id: 3, title: 'Bookmarks', category: 'Tools' },
]);

search.render('search-container', (item) => {
  console.log('Selected:', item.title);
});
```

### With Fuzzy Matching

```typescript
const search = new SearchBar(items, {
  fuzzy: true,
  threshold: 0.4,  // Similarity threshold (0-1)
});

// Now searches match partial and fuzzy matches
search.search('stngs');  // Matches 'Settings'
```

### With Autocomplete

```typescript
const search = new SearchBar(items, {
  autocomplete: true,
  maxResults: 10,
  showCategories: true,
});
```

### Search History

```typescript
const search = new SearchBar(items, {
  history: true,
  historySize: 20,  // Max history items
  persistHistory: true,  // Save to chrome.storage
});
```

### Custom Rendering

```typescript
const search = new SearchBar(items, {
  renderItem: (item) => {
    return `<div class="result-item">
      <span class="title">${item.title}</span>
      <span class="category">${item.category}</span>
    </div>`;
  },
  highlightMatches: true,
  highlightClass: 'match-highlight',
});
```

## API

### SearchBar Class

| Method | Description |
|--------|-------------|
| `new SearchBar(items, options?)` | Create search bar |
| `search.render(container, onSelect)` | Render to container |
| `search.setItems(items)` | Update search items |
| `search.clearHistory()` | Clear search history |
| `search.destroy()` | Cleanup event listeners |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| fuzzy | boolean | false | Enable fuzzy matching |
| threshold | number | 0.3 | Match threshold (0-1) |
| autocomplete | boolean | false | Show dropdown |
| maxResults | number | 5 | Max results to show |
| history | boolean | false | Enable search history |
| highlightMatches | boolean | false | Highlight matched text |

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/search-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/search-feature`
7. **Submit** a Pull Request

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [chrome-tab-search](https://github.com/theluckystrike/chrome-tab-search) - Tab search
- [webext-quick-settings](https://github.com/theluckystrike/webext-quick-settings) - Settings panel
- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)

---

*Built by developers, for developers. No compromises on privacy.*
