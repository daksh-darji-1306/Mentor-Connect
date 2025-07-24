# Mentor Connect Sign Up

A modern, animated sign-up form for mentors and mentees, built with React, Tailwind CSS, Framer Motion, and Radix UI.

## Features

- Role toggle: Mentor or Mentee
- Multi-step animated form
- Floating labels and validation
- Responsive, Studio Ghibli-inspired design
- File upload for profile picture

## Tech Stack

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [Vite](https://vitejs.dev/)

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm run dev
   ```

3. **Open [http://localhost:5173](http://localhost:5173) in your browser.**

## Build for Production

```sh
npm run build
```

## Project Structure

- [`main.jsx`](main.jsx): Entry point, renders [`SignUpMorphing`](SignUpMorphing.jsx)
- [`SignUpMorphing.jsx`](SignUpMorphing.jsx): Main animated sign-up component
- [`index.css`](index.css): Tailwind CSS imports
- [`index.html`](index.html): HTML template

## Customization

- **Form fields:** Edit or add fields in [`SignUpMorphing.jsx`](SignUpMorphing.jsx)
- **Styling:** Update Tailwind config in [`tailwind.config.js`](tailwind.config.js)
- **Animations:** Tweak Framer Motion props in [`SignUpMorphing.jsx`](SignUpMorphing.jsx)

## Deployment

This project is ready for deployment on [Vercel](https://vercel.com/) or any static hosting.
