# BookBase — Frontend

React + Vite frontend for the BookBase Library Management System.

## Tech

React 19, Vite, React Router, plain CSS (`src/index.css`).

## Run locally

```bash
npm install
cp .env.example .env      # set VITE_API_URL to your backend
npm run dev               # http://localhost:5173
```

The backend must be running (see the backend README).

## Environment variables

| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `VITE_API_URL` | Backend URL without `/api`, e.g. `http://localhost:5000` |

Vite reads this at build time, so set it on your hosting platform **before** building.

## Build

```bash
npm run build     # output in dist/
npm run preview   # serve the build locally
npm run lint
```

## Deploy

**Netlify:** build command `npm run build`, publish directory `dist`, add `VITE_API_URL`.
`public/_redirects` makes page refreshes work on routes like `/user/catalog`.

**Vercel:** framework preset Vite, add `VITE_API_URL`. `vercel.json` handles the same routing.

After deploying, put the frontend URL in the backend's `CLIENT_URL` so CORS allows it.

## Folder structure

```
src/
  api/client.js          fetch wrapper (adds the JWT, handles errors)
  context/               Auth, Settings (library info) and Toast providers
  hooks/useBorrow.js     borrow logic shared by catalog, search, details
  components/            layouts, ProtectedRoute, BookCover, forms, tables helpers
  pages/public/          Home, Login, Register, ForgotPassword, NotFound
  pages/user/            Dashboard, Catalog, BookDetails, SearchResults, MyBooks, Profile
  pages/admin/           Dashboard, ManageBooks, ManageUsers, UserDetails,
                         ManageBorrowings, Reports, Settings
  utils/format.js        date helpers, country list
```

## Roles

On registration the user chooses **Member** or **Librarian (Admin)**. Members are sent to
`/user/dashboard`, librarians to `/admin/dashboard`. `ProtectedRoute` stops each role from
opening the other's pages, and the backend checks the role again on every request.
