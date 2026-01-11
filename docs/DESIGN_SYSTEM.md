# eCOA Design System - Uniform Standards

## Typography Scale

### Headings
- **Section Title:** `text-lg font-bold text-gray-900 mb-1`
- **Subsection:** `text-base font-semibold text-gray-900`
- **Card Title:** `text-sm font-semibold text-gray-900`

### Body Text
- **Description:** `text-sm text-gray-500 mb-4`
- **Label:** `text-sm font-medium text-gray-700 mb-1.5`
- **Helper Text:** `text-xs text-gray-500 mt-1`
- **Inline Text:** `text-sm text-gray-700`

### Small Text
- **Badge:** `text-[10px] font-medium`
- **Caption:** `text-xs text-gray-500`

---

## Spacing Scale

### Margins
- **Section bottom:** `mb-4` (16px)
- **Label bottom:** `mb-1.5` (6px)
- **Helper text top:** `mt-1` (4px)
- **Between sections:** `space-y-4` (16px)
- **Between elements:** `gap-2.5` (10px)

### Padding
- **Input fields:** `px-3 py-2` (12px horizontal, 8px vertical)
- **Cards:** `p-4` (16px all sides)
- **Compact cards:** `p-3` (12px all sides)
- **Buttons:** `px-4 py-2` (16px horizontal, 8px vertical)
- **Radio cards:** `p-3` (12px all sides)

---

## Input Fields

### Standard Input
```jsx
className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg
focus:border-orange-500 focus:outline-none focus:ring-2
focus:ring-orange-500 focus:ring-offset-1 transition-all duration-150"
```

### Select/Dropdown
```jsx
className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg
focus:border-orange-500 focus:outline-none focus:ring-2
focus:ring-orange-500 focus:ring-offset-1 transition-all duration-150
bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
```

---

## Buttons

### Primary Button
```jsx
className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600
text-white text-sm font-semibold rounded-lg
hover:from-orange-600 hover:to-orange-700
transition-all duration-150 shadow-sm"
```

### Secondary Button
```jsx
className="px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm
font-medium rounded-lg hover:bg-gray-50 transition-all duration-150"
```

### Icon Button
```jsx
className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50
rounded transition-all duration-150 focus:outline-none focus:ring-2
focus:ring-red-500 focus:ring-offset-2"
```

---

## Cards

### Standard Card
```jsx
className="bg-white border border-gray-200 rounded-lg shadow-sm
hover:shadow-md hover:border-gray-300 transition-all duration-200"
```

### Radio Card
```jsx
className="p-3 border-2 border-gray-300 rounded-lg cursor-pointer
hover:border-orange-300 peer-checked:border-orange-500
peer-checked:bg-orange-50 transition-all duration-150"
```

### Info Card
```jsx
className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg"
```

---

## Colors

### Primary (Orange)
- `orange-500` (#F97316) - Primary actions
- `orange-600` (#EA580C) - Hover states
- `orange-50` (#FFF7ED) - Backgrounds
- `orange-100` (#FFEDD5) - Light accents

### Success (Green)
- `green-500` (#10B981) - Success states
- `green-600` (#059669) - Hover
- `green-50` (#F0FDF4) - Backgrounds

### Error (Red)
- `red-500` (#EF4444) - Errors
- `red-600` (#DC2626) - Hover
- `red-50` (#FEF2F2) - Backgrounds

### Info (Blue)
- `blue-500` (#3B82F6) - Info
- `blue-50` (#EFF6FF) - Backgrounds

### Warning (Yellow)
- `yellow-500` (#F59E0B) - Warnings
- `yellow-50` (#FEFCE8) - Backgrounds

### Neutral (Gray)
- `gray-900` (#111827) - Headings
- `gray-700` (#374151) - Labels
- `gray-500` (#6B7280) - Body text
- `gray-400` (#9CA3AF) - Disabled
- `gray-300` (#D1D5DB) - Borders
- `gray-200` (#E5E7EB) - Light borders
- `gray-100` (#F3F4F6) - Backgrounds
- `gray-50` (#F9FAFB) - Subtle backgrounds

---

## Border Radius

- **Small:** `rounded` (4px) - Badges, small elements
- **Medium:** `rounded-lg` (8px) - Inputs, cards, buttons
- **Large:** `rounded-xl` (12px) - Modals, large cards
- **Full:** `rounded-full` - Circles, pills

---

## Shadows

- **None:** No shadow
- **Small:** `shadow-sm` - Subtle elevation
- **Medium:** `shadow-md` - Hover states
- **Large:** `shadow-lg` - Modals
- **Extra Large:** `shadow-2xl` - Top-level modals

---

## Transitions

- **Fast:** `duration-150` (150ms) - Hovers, focus
- **Base:** `duration-200` (200ms) - Default
- **Slow:** `duration-300` (300ms) - Animations

---

## Icons

### Sizes
- **Extra Small:** `w-3 h-3` (12px) - Inline icons
- **Small:** `w-4 h-4` (16px) - Button icons
- **Medium:** `w-5 h-5` (20px) - Standard icons
- **Large:** `w-6 h-6` (24px) - Feature icons
- **Extra Large:** `w-8 h-8` (32px) - Hero icons

### Emoji Sizes
- **Small:** `text-base` (16px)
- **Medium:** `text-xl` (20px)
- **Large:** `text-2xl` (24px)

---

## Validation States

### Success
```jsx
<input className="border-green-400 focus:border-green-500" />
<p className="text-xs text-green-600 flex items-center gap-1 mt-1">
  <CheckIcon className="w-3 h-3" /> Selected
</p>
```

### Error
```jsx
<input className="border-red-400 focus:border-red-500" />
<p className="text-xs text-red-600 flex items-center gap-1 mt-1">
  <AlertIcon className="w-3 h-3" /> Required field
</p>
```

---

## Application Rules

### Consistency Checklist
- [ ] All headings use defined typography scale
- [ ] All spacing uses 4px base scale (0.5, 1, 1.5, 2, 2.5, 3, 4, 6, 8)
- [ ] All inputs have same padding (px-3 py-2)
- [ ] All buttons use defined styles
- [ ] All cards use standard styles
- [ ] All transitions use defined durations
- [ ] All colors from defined palette
- [ ] All border radius values from scale

### Components to Standardize
1. ✅ Step1Basics
2. Step2Timing
3. Step3Forms
4. Step4Review
5. Step5Conditions (already world-class)
6. All wizard navigation
7. All modal headers

---

## Implementation Priority

1. **Typography** - Most visible
2. **Spacing** - Creates rhythm
3. **Inputs** - User interaction
4. **Buttons** - Call to action
5. **Cards** - Content containers
6. **Colors** - Visual hierarchy

Apply systematically, one component at a time.
