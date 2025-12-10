# eCOA Kaizen Lab UI

A modern, user-friendly interface for Electronic Clinical Outcome Assessment (eCOA) solutions built with React and Vite.

## Features

- Clean and intuitive login interface
- White and light orange color theme
- Responsive design
- Username and password authentication
- Form validation
- Password visibility toggle
- Support contact information

## Tech Stack

- **React 18.2** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM 6** - Routing
- **Tailwind CSS 3** - Styling framework
- **ESLint** - Code linting

## Project Structure

```
eCOA-kaizen-lab-UI/
├── docs/
│   ├── eCOA_Database_Schema.pdf
│   ├── eCOA_Solutions_PRD.pdf
│   ├── eCOA_Technical_Spec.pdf
│   ├── eCOA_User_Stories.pdf
│   └── eCOA_Wireframe_Guide.pdf
├── public/
│   └── vite.svg
├── src/
│   ├── pages/
│   │   └── Login/
│   │       ├── Login.jsx
│   │       └── Login.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .eslintrc.cjs
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eCOA-kaizen-lab-UI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Color Theme

The application uses a white and light orange color palette:

- **White**: `#FFFFFF` - Primary background
- **Light Orange**: `#FFE5D9` - Secondary background
- **Orange Primary**: `#FFB088` - Primary accent
- **Orange Secondary**: `#FF8C61` - Secondary accent
- **Orange Accent**: `#FF7043` - Interactive elements

## Documentation

The project includes comprehensive documentation in the `docs/` folder:

- `docs/eCOA_Solutions_PRD.pdf` - Product Requirements Document
- `docs/eCOA_Technical_Spec.pdf` - Technical Specifications
- `docs/eCOA_User_Stories.pdf` - User Stories
- `docs/eCOA_Database_Schema.pdf` - Database Schema
- `docs/eCOA_Wireframe_Guide.pdf` - Wireframe Guide

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Submit a pull request

## License

This project is proprietary and confidential.
