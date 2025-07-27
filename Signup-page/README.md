# Mentor Connect – Animated Signup Page

A modern, multi-step signup form for mentors and mentees. Built with React and Framer Motion, featuring animated transitions, role selection, and responsive design.

## Features

- **Role Selection:** Choose Mentor or Mentee, with unique benefits for each role.
- **Multi-Step Form:** Collects basic info, profile details, and preferences.
- **Animated UI:** Smooth transitions and progress indicators using Framer Motion.
- **File Upload:** Mentors can upload resumes (PDF/DOC/DOCX, ≤10MB).
- **Responsive Design:** Works beautifully on desktop and mobile.
- **Validation:** Inline validation for all fields.

## Tech Stack

- [React](https://react.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- CSS Modules

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm start
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

- [`src/App.js`](src/App.js): Main app logic and routing.
- [`src/components/RoleSelectionPage.js`](src/components/RoleSelectionPage.js): Role selection UI.
- [`src/components/SignupForm.js`](src/components/SignupForm.js): Multi-step signup form.
- [`src/components/ProgressIndicator.js`](src/components/ProgressIndicator.js): Step progress bar.
- [`src/components/RoleSwitcher.js`](src/components/RoleSwitcher.js): Switch between Mentor/Mentee.
- [`src/components/SuccessScreen.js`](src/components/SuccessScreen.js): Success confirmation.
- [`src/form-steps/`](src/form-steps/): Individual form steps (`BasicInfoStep.js`, `ProfileDetailsStep.js`, `PreferencesStep.js`).
- [`public/index.html`](public/index.html): HTML template.

## Customization

- **Add/Edit Form Fields:** Update the relevant step in [`src/form-steps/`](src/form-steps/).
- **Change Role Benefits:** Edit the `roles` array in [`src/components/RoleSelectionPage.js`](src/components/RoleSelectionPage.js).
- **Styling:** Modify CSS files in [`src/components/`](src/components/) and [`src/form-steps/`](src/form-steps/).

## Deployment

Build for production:
```sh
npm run build
```
Deploy the contents of the `build/` folder to your preferred static host (Netlify, Vercel, GitHub Pages, etc).

## License

**Private – No Open Source**

This repository is private and not licensed for public use, distribution, or modification.
---

**Mentor Connect** – Empowering growth through mentorship.
