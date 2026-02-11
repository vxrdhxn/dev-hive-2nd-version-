# KTP React Frontend
This is the new React-based frontend for the Knowledge Transfer Platform (KTP).

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
   The backend API is proxied to `http://localhost:5000` automatically.

## Building for Production
To create a production build:
```bash
npm run build
```
The output will be in the `dist` directory.

## Project Structure
- `src/pages`: Main application views (Dashboard, Search, Ask, Integrations)
- `src/components`: Reusable UI components
- `src/services`: API communication layer
- `src/App.jsx`: Routing configuration

## Tech Stack
- React 18+
- Vite
- TailwindCSS
- React Router v6
