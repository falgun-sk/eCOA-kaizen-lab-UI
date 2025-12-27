/**
 * Design Tokens for eCOA Kaizen Lab UI
 *
 * Centralized design system tokens for consistent styling across the application.
 * These tokens should be used throughout the codebase to maintain visual consistency.
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const COLORS = {
  // Brand Orange (Primary)
  orange: {
    50: '#FFF7ED',   // Lightest backgrounds, hover states
    100: '#FFEDD5',  // Light backgrounds
    200: '#FED7AA',  // Borders, hover borders
    300: '#FDBA74',  // Hover states
    400: '#FB923C',  // Icons, secondary elements
    500: '#F97316',  // Primary buttons (from)
    600: '#EA580C',  // Primary buttons (to), links
    700: '#C2410C',  // Pressed state, dark text
  },

  // Success (Green)
  success: {
    50: '#F0FDF4',   // Background
    100: '#DCFCE7',  // Light background
    200: '#BBF7D0',  // Border
    500: '#22C55E',  // Dot, primary
    600: '#16A34A',  // Hover
    700: '#15803D',  // Text
  },

  // Error (Red)
  error: {
    50: '#FEF2F2',   // Background
    100: '#FEE2E2',  // Light background
    200: '#FECACA',  // Border
    300: '#FCA5A5',  // Input error border
    500: '#EF4444',  // Dot, primary
    600: '#DC2626',  // Buttons, hover
    700: '#B91C1C',  // Text
  },

  // Warning (Amber)
  warning: {
    50: '#FFFBEB',   // Background
    100: '#FEF3C7',  // Light background
    200: '#FDE68A',  // Border
    500: '#F59E0B',  // Dot, primary
    600: '#D97706',  // Hover
    700: '#B45309',  // Text
  },

  // Info (Blue)
  info: {
    50: '#EFF6FF',   // Background
    100: '#DBEAFE',  // Light background
    200: '#BFDBFE',  // Border
    500: '#3B82F6',  // Dot, primary
    600: '#2563EB',  // Hover
    700: '#1D4ED8',  // Text
  },

  // Neutral (Gray) - Using Tailwind defaults
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    900: '#111827',
  }
}

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const RADIUS = {
  button: 'rounded-lg',      // 8px - All buttons
  input: 'rounded-lg',       // 8px - Text inputs, selects, textareas
  card: 'rounded-xl',        // 12px - Cards, modals, large containers
  badge: 'rounded-md',       // 6px - Status badges
  avatar: 'rounded-full',    // Full circle - Avatars, circular elements
  modal: 'rounded-xl',       // 12px - Modal containers
  dropdown: 'rounded-lg',    // 8px - Dropdown menus
  searchBar: 'rounded-xl',   // 12px - Search bars (visual distinction)
}

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const SPACING = {
  // Padding
  cardPadding: 'p-6',           // Standard card interior padding
  cardPaddingCompact: 'p-4',    // Compact card padding
  pagePadding: 'p-8',           // Standard page content padding
  modalPadding: 'px-6 py-4',    // Modal content padding
  sectionPadding: 'px-8 py-6',  // Section padding (headers, etc.)

  // Gaps
  sectionGap: 'gap-6',          // Grid/flex gaps between sections
  gridGap: 'gap-6',             // Standard grid gap
  gridGapCompact: 'gap-4',      // Compact grid gap
  stackGap: 'space-y-6',        // Vertical stacks
  stackGapCompact: 'space-y-4', // Compact vertical stacks
  inlineGap: 'space-x-3',       // Horizontal inline items
  inlineGapCompact: 'space-x-2',// Compact horizontal items

  // Form Fields
  formFieldGap: 'space-y-5',    // Gap between form fields
  formFieldGapCompact: 'space-y-4', // Compact form fields
}

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const SHADOWS = {
  // Card shadows
  card: 'shadow-sm',
  cardHover: 'shadow-lg',

  // Button shadows
  button: 'shadow-md shadow-orange-500/30',
  buttonHover: 'shadow-lg shadow-orange-500/40',

  // Modal shadows
  modal: 'shadow-2xl',

  // Dropdown shadows
  dropdown: 'shadow-lg',
}

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const TYPOGRAPHY = {
  // Headings
  pageTitle: 'text-2xl font-bold text-gray-900',
  sectionTitle: 'text-lg font-semibold text-gray-900',
  cardTitle: 'text-base font-semibold text-gray-900',
  subsectionTitle: 'text-sm font-semibold text-gray-900',

  // Body text
  body: 'text-sm text-gray-600',
  bodyPrimary: 'text-sm text-gray-900',
  bodySecondary: 'text-sm text-gray-500',

  // Labels and captions
  label: 'text-sm font-medium text-gray-700',
  caption: 'text-xs text-gray-500',
  help: 'text-xs text-gray-500',

  // Links
  link: 'text-sm text-orange-600 hover:text-orange-700 font-medium',

  // Table
  tableHeader: 'text-xs font-medium text-gray-500 uppercase tracking-wider',
  tableCell: 'text-sm text-gray-900',
}

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

export const COMPONENTS = {
  // Badge
  badge: {
    padding: 'px-2.5 py-0.5',
    paddingCompact: 'px-2 py-0.5',
    text: 'text-xs font-medium',
    border: 'border',
    rounded: 'rounded-md',
    roundedPill: 'rounded-full',
    dot: 'w-1.5 h-1.5 rounded-full mr-1.5',
  },

  // Button
  button: {
    padding: {
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2',
      lg: 'px-6 py-3',
    },
    text: {
      sm: 'text-xs font-medium',
      md: 'text-sm font-semibold',
      lg: 'text-base font-semibold',
    },
    rounded: 'rounded-lg',
    transition: 'transition-all duration-200',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },

  // Input
  input: {
    padding: 'px-4 py-2.5',
    text: 'text-sm text-gray-900',
    placeholder: 'placeholder-gray-400',
    background: 'bg-white',
    border: 'border border-gray-200',
    borderError: 'border-red-300',
    rounded: 'rounded-lg',
    focus: 'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
    focusError: 'focus:ring-red-500',
    transition: 'transition-colors',
    disabled: 'disabled:bg-gray-50 disabled:cursor-not-allowed',

    // Search input (visual distinction)
    searchBackground: 'bg-gray-50',
  },

  // Select
  select: {
    padding: 'px-4 py-2.5',
    text: 'text-sm text-gray-900',
    background: 'bg-white',
    border: 'border border-gray-200',
    rounded: 'rounded-lg',
    focus: 'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
    transition: 'transition-colors',
    cursor: 'cursor-pointer',
  },

  // Textarea
  textarea: {
    padding: 'px-4 py-2.5',
    text: 'text-sm text-gray-900',
    placeholder: 'placeholder-gray-400',
    background: 'bg-white',
    border: 'border border-gray-200',
    borderError: 'border-red-300',
    rounded: 'rounded-lg',
    focus: 'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
    resize: 'resize-none',
  },

  // Card
  card: {
    background: 'bg-white',
    border: 'border border-gray-200',
    rounded: 'rounded-xl',
    padding: 'p-6',
    paddingCompact: 'p-4',
    paddingNone: 'p-0',
    shadow: 'shadow-sm',
    hover: 'hover:shadow-lg hover:border-orange-200 transition-all duration-200',
  },

  // Table
  table: {
    headerBg: 'bg-gray-50',
    headerCell: 'px-6 py-3',
    bodyCell: 'px-6 py-4',
    rowHover: 'hover:bg-orange-50 transition-colors',
    rowBorder: 'border-b border-gray-200',
  },

  // Modal
  modal: {
    backdrop: 'bg-black bg-opacity-50',
    container: 'bg-white rounded-xl shadow-2xl',
    header: 'px-6 py-4 border-b border-gray-200',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t border-gray-200',

    // Gradient header (for special modals)
    headerGradient: 'px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600',
  },

  // Icon sizes
  icon: {
    sm: 'w-4 h-4',      // Buttons, badges, inline icons
    md: 'w-5 h-5',      // Table actions, dropdown items, navigation
    lg: 'w-6 h-6',      // Modal headers, section headers
    xl: 'w-8 h-8',      // Empty states, feature cards
  },

  // Avatar sizes
  avatar: {
    sm: 'w-8 h-8',      // Small avatar
    md: 'w-10 h-10',    // Medium avatar
    lg: 'w-12 h-12',    // Large avatar
    xl: 'w-16 h-16',    // Extra large avatar
  },
}

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const ANIMATIONS = {
  transition: {
    fast: 'transition-all duration-150 ease-in-out',
    default: 'transition-all duration-200 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
    colors: 'transition-colors duration-200',
  },

  pulse: 'animate-pulse',
  fadeIn: 'animate-fadeIn',
  slideUp: 'animate-slideUp',
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get badge color classes based on variant
 */
export const getBadgeColors = (variant: 'default' | 'success' | 'error' | 'warning' | 'info' | 'purple' | 'pink' | 'cyan') => {
  const colorMap = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-600 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  }

  return colorMap[variant] || colorMap.default
}

/**
 * Get button color classes based on variant
 */
export const getButtonColors = (variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline') => {
  const colorMap = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
    ghost: 'text-gray-700 hover:bg-gray-100',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50',
  }

  return colorMap[variant] || colorMap.primary
}

/**
 * Get status dot color based on variant
 */
export const getStatusDotColor = (variant: 'success' | 'error' | 'warning' | 'info') => {
  const colorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  }

  return colorMap[variant] || colorMap.info
}

// ============================================================================
// USAGE GUIDELINES (Comments for developers)
// ============================================================================

/**
 * USAGE GUIDELINES:
 *
 * 1. COLORS
 *    - Use COLORS.orange for primary brand elements
 *    - Use semantic colors (success, error, warning, info) for status indicators
 *    - Use gray scale for neutral elements
 *
 * 2. BORDER RADIUS
 *    - RADIUS.button for all buttons
 *    - RADIUS.input for form inputs (text, select, textarea)
 *    - RADIUS.card for cards and large containers
 *    - RADIUS.badge for status badges
 *
 * 3. SPACING
 *    - Use SPACING tokens for consistent padding and gaps
 *    - Prefer tokens over arbitrary values
 *
 * 4. TYPOGRAPHY
 *    - Use TYPOGRAPHY tokens for text styling
 *    - Maintains consistent text hierarchy
 *
 * 5. COMPONENTS
 *    - Use COMPONENTS tokens when building new components
 *    - Ensures consistency across the application
 *
 * EXAMPLE:
 * ```tsx
 * import { RADIUS, COMPONENTS, TYPOGRAPHY } from '@/shared/constants/designTokens'
 *
 * <button className={`${COMPONENTS.button.padding.md} ${RADIUS.button} ${TYPOGRAPHY.body}`}>
 *   Click me
 * </button>
 * ```
 */
