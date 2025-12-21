# Folder Structure Documentation

This document explains the improved folder structure for better maintainability and isolation.

## 📁 Structure Overview

```
src/
├── features/                  # Feature-based modules
│   ├── auth/                  # Authentication feature
│   │   └── pages/
│   │       ├── Login.jsx
│   │       └── ForgotPassword.jsx
│   │
│   └── dashboard/             # Dashboard feature
│       └── pages/
│           └── Dashboard.jsx
│
├── layouts/                   # Layout components
│   └── DashboardLayout/
│       └── DashboardLayout.jsx
│
├── shared/                    # Shared/common components
│   └── components/
│       └── Placeholder.jsx
│
├── App.jsx                    # Main app component with routing
├── main.jsx                   # Application entry point
└── index.css                  # Global styles
```

## 🎯 Design Principles

### 1. **Feature-Based Organization**
Each major feature lives in its own folder under `features/`:
- **Isolation**: Changes to one feature don't affect others
- **Easy navigation**: All related code for a feature is co-located
- **Scalability**: Easy to add new features without cluttering

### 2. **Separation of Concerns**
- **features/**: Business logic and feature-specific components
- **layouts/**: Reusable layout components (sidebar, header, etc.)
- **shared/**: Common components used across multiple features

### 3. **Benefits**

✅ **Easy Debugging**
- Find issues quickly by navigating to the feature folder
- All related code is in one place

✅ **Minimal Impact**
- Changes to one feature don't break others
- Clear boundaries between features

✅ **Better Collaboration**
- Multiple developers can work on different features without conflicts
- Clear ownership of code

✅ **Scalability**
- Easy to add new features
- Easy to remove features
- Clear structure as project grows

## 📂 Feature Folder Pattern

Each feature can contain:
```
features/
└── feature-name/
    ├── components/      # Feature-specific components
    ├── pages/           # Feature pages
    ├── hooks/           # Feature-specific hooks (future)
    ├── utils/           # Feature-specific utilities (future)
    └── constants/       # Feature-specific constants (future)
```

## 🔄 Current Features

### Auth Feature (`features/auth/`)
Handles authentication flows:
- Login page with form validation
- Forgot password flow
- Email verification success state

### Dashboard Feature (`features/dashboard/`)
Main application dashboard:
- Study cards grid
- Search functionality
- Status badges (Production/UAT/Draft)
- Mock study data

## 🚀 Adding New Features

To add a new feature:

1. Create a new folder under `features/`
2. Add pages, components, etc. as needed
3. Import in `App.jsx` and add routes
4. Components specific to that feature stay in the feature folder

Example:
```javascript
// features/reports/pages/Reports.jsx
const Reports = () => {
  // Report feature code
}

// App.jsx
import Reports from './features/reports/pages/Reports'
```

## 🎨 Layouts vs Components

**Layouts** (`layouts/`):
- Wrap multiple pages
- Provide consistent structure (sidebar, header, footer)
- Used with nested routing

**Shared Components** (`shared/components/`):
- Reusable UI components (buttons, inputs, cards)
- Used across multiple features
- No feature-specific logic

## 📝 Import Paths

All imports use relative paths from `src/`:

```javascript
// Feature imports
import Login from './features/auth/pages/Login'

// Layout imports
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'

// Shared component imports
import Placeholder from './shared/components/Placeholder'
```

## 🔍 Finding Code

**Looking for:**
- **Login/Auth?** → `features/auth/`
- **Dashboard?** → `features/dashboard/`
- **Sidebar/Navigation?** → `layouts/DashboardLayout/`
- **Reusable components?** → `shared/components/`

## 🛠️ Future Enhancements

As the project grows, you can add:

```
features/
└── feature-name/
    ├── components/      # ✅ Already used
    ├── pages/           # ✅ Already used
    ├── hooks/           # ⏳ Add custom hooks here
    ├── utils/           # ⏳ Add utilities here
    ├── constants/       # ⏳ Add constants here
    ├── services/        # ⏳ Add API calls here
    └── types/           # ⏳ Add TypeScript types here
```

This structure supports your growth without major refactoring!
