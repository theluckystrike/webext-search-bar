# webext-search-bar — Search Component for Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i webext-search-bar`

Fuzzy search with autocomplete dropdown, history, highlighting, and render-to-container.

```typescript
import { SearchBar } from 'webext-search-bar';
const search = new SearchBar(['Settings', 'History', 'Bookmarks']);
search.render('search-container', (item) => navigate(item));
```
MIT License
