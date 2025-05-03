# User Directory with Infinite Scroll, Search, and Sorting

A responsive React application to view a large list of users with infinite scrolling, virtualized rows, sorting, and search functionality. Built with performance and scalability in mind.

---

## 🧩 Tech Stack

- **Frontend**: React + Vite + TailwindCSS  
- **Table Engine**: `@tanstack/react-table`  
- **Virtualization**: `@tanstack/react-virtual`  
- **Backend**: Mocked user API (can integrate any paginated backend)  
- **State & Fetching**: React hooks

---

## 🚀 Getting Started

### 🔧 Backend Setup (Optional if using mock API)

```bash
cd backend
npm install
npm run dev
```

- Ensure your backend supports pagination and query filtering (e.g., `/api/users?page=2&limit=100`).
- Update frontend API calls accordingly in `usePaginatedUsers.js`.
- Test API calls accordingly for error handling and success.

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App will run on `http://localhost:5173` (Vite default).

---

## 📁 Project Structure

```
.
├── components/             # Reusable UI components
│   ├── SearchBar.jsx
│   └── UserTable.jsx
├── hooks/
│   └── usePaginatedUsers.js  # Handles fetching + pagination
├── App.jsx
└── main.jsx
```

---

## ✨ Features

- 🔍 **Live Search** with debounce  
- ⬇️ **Infinite Scroll** with smooth loading  
- 🧭 **Column Sorting** with direction indicators  
- ⚡ **Virtualized Table** for fast performance on large datasets  
- 💅 Clean, responsive UI using TailwindCSS  
- 🛡️ Error and empty state handling  

---

## 🧠 Architecture & Optimization

### Virtual Scrolling
- Integrated `@tanstack/react-virtual` to render only visible rows.
- Improves performance when dealing with thousands of rows.

### Controlled Sorting
- Sorting is handled via `@tanstack/react-table` using controlled state.
- Visual indicators (`▲▼`) show current sort direction.

### Debounced Search
- Search input is manually debounced using `setTimeout`.
- Prevents excessive API requests on every keystroke.

### Lazy Pagination
- As the user scrolls, new pages are fetched and appended.
- Triggered 300px before bottom using scroll listener + debounce.

### Defensive Programming
- Handles missing or malformed data (e.g., null phone or missing address).
- Uses optional chaining to prevent crashes.

---

## 🏆 Bonus Features

- ✨ Sorting arrows (`▲▼`) always visible and toggle visually on click.
- 🎯 Search bar aligns right and is styled for clarity and focus.
- 💼 Company and city shown together in a custom-computed column.
- 🧪 Handles edge cases like:
  - API failure
  - Empty search results
  - Rapid input typing

---

## 📬 Contact

Made with ❤️ by Mayank Vishwakarma.  
