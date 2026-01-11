# Modal System Documentation

## Overview

The eCOA Kaizen Lab UI uses a standardized modal/popup system that matches the product's design system. All modals follow consistent styling with the orange brand color (#F97316-#EA580C), rounded corners (rounded-xl), and smooth animations.

## Components

### 1. Modal (Base Component)

The base modal component for creating custom modal dialogs.

**Import:**
```javascript
import { Modal } from '../shared/components'
```

**Props:**
```typescript
{
  isOpen: boolean              // Controls modal visibility
  onClose: () => void          // Callback when modal closes
  title: string                // Modal title
  children: ReactNode          // Modal content
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'  // Modal size (default: 'md')
  footer?: ReactNode           // Optional footer content
  headerVariant?: 'default' | 'gradient'     // Header style (default: 'default')
  subtitle?: string            // Optional subtitle below title
  showCloseButton?: boolean    // Show/hide close button (default: true)
  closeOnBackdropClick?: boolean  // Close on backdrop click (default: true)
  closeOnEscape?: boolean      // Close on ESC key (default: true)
}
```

**Example:**
```jsx
import { Modal } from '../shared/components'

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="My Modal"
      subtitle="Optional subtitle"
      size="lg"
      headerVariant="gradient"
      footer={
        <div className="flex justify-end space-x-3">
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      }
    >
      <p>Modal content goes here</p>
    </Modal>
  )
}
```

### 2. ConfirmDialog

Pre-styled confirmation dialog for user confirmations.

**Import:**
```javascript
import { ConfirmDialog } from '../shared/components'
```

**Props:**
```typescript
{
  isOpen: boolean                    // Controls modal visibility
  onClose: () => void                // Callback when modal closes
  onConfirm: () => void | Promise<void>  // Callback when user confirms
  title: string                      // Dialog title
  message: string | ReactNode        // Confirmation message
  confirmText?: string               // Confirm button text (default: 'Confirm')
  cancelText?: string                // Cancel button text (default: 'Cancel')
  variant?: 'danger' | 'warning' | 'info' | 'primary'  // Dialog variant (default: 'danger')
  isLoading?: boolean                // Show loading state (default: false)
  icon?: 'warning' | 'danger' | 'info' | 'question'  // Icon to display
}
```

**Example:**
```jsx
import { ConfirmDialog } from '../shared/components'

const MyComponent = () => {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    // Perform delete operation
    setShowConfirm(false)
  }

  return (
    <ConfirmDialog
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={handleDelete}
      title="Delete Item"
      message="Are you sure you want to delete this item? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      icon="danger"
    />
  )
}
```

### 3. AlertDialog

Pre-styled alert dialog for displaying messages.

**Import:**
```javascript
import { AlertDialog } from '../shared/components'
```

**Props:**
```typescript
{
  isOpen: boolean                    // Controls modal visibility
  onClose: () => void                // Callback when modal closes
  title: string                      // Alert title
  message: string | ReactNode        // Alert message
  variant?: 'success' | 'error' | 'warning' | 'info'  // Alert variant (default: 'info')
  buttonText?: string                // Button text (default: 'OK')
}
```

**Example:**
```jsx
import { AlertDialog } from '../shared/components'

const MyComponent = () => {
  const [showAlert, setShowAlert] = useState(false)

  return (
    <AlertDialog
      isOpen={showAlert}
      onClose={() => setShowAlert(false)}
      title="Success"
      message="Your changes have been saved successfully!"
      variant="success"
      buttonText="OK"
    />
  )
}
```

### 4. useDialog Hook

A convenient hook for programmatically showing dialogs without managing state.

**Import:**
```javascript
import { useDialog } from '../shared/hooks/useDialog'
// or for standalone usage
import { dialog } from '../shared/hooks/useDialog'
```

**API:**

#### confirm()
Shows a confirmation dialog and returns a Promise<boolean>.

```javascript
const confirmed = await dialog.confirm({
  title: 'Delete Item',              // Optional, default: 'Confirm Action'
  message: 'Are you sure?',          // Required
  confirmText: 'Delete',             // Optional, default: 'Confirm'
  cancelText: 'Cancel',              // Optional, default: 'Cancel'
  variant: 'danger',                 // Optional, default: 'danger'
  icon: 'danger'                     // Optional
})

if (confirmed) {
  // User clicked confirm
} else {
  // User clicked cancel or closed dialog
}
```

#### alert()
Shows an alert dialog and returns a Promise<void>.

```javascript
await dialog.alert({
  title: 'Success',                  // Optional, default: 'Alert'
  message: 'Operation completed!',   // Required
  variant: 'success',                // Optional, default: 'info'
  buttonText: 'OK'                   // Optional, default: 'OK'
})
```

**Hook Usage Example:**
```jsx
import { useDialog } from '../shared/hooks/useDialog'

const MyComponent = () => {
  const dialog = useDialog()

  const handleDelete = async () => {
    const confirmed = await dialog.confirm({
      message: 'Delete this item?',
      variant: 'danger'
    })

    if (confirmed) {
      // Perform delete
      await dialog.alert({
        message: 'Item deleted successfully!',
        variant: 'success'
      })
    }
  }

  return <button onClick={handleDelete}>Delete</button>
}
```

**Standalone Usage Example:**
```javascript
import { dialog } from '../shared/hooks/useDialog'

// In utility functions or non-component contexts
const deleteVisit = async (id) => {
  const confirmed = await dialog.confirm({
    title: 'Delete Visit',
    message: 'Are you sure you want to delete this visit?',
    confirmText: 'Delete Visit',
    variant: 'danger'
  })

  if (confirmed) {
    // Perform deletion
  }
}
```

## Migration from Native Dialogs

**Before:**
```javascript
if (window.confirm('Are you sure?')) {
  // Do something
}
```

**After (Option 1 - Using dialog utility):**
```javascript
import { dialog } from '../shared/hooks/useDialog'

const confirmed = await dialog.confirm({
  message: 'Are you sure?',
  variant: 'danger'
})

if (confirmed) {
  // Do something
}
```

**After (Option 2 - Using hook):**
```jsx
import { useDialog } from '../shared/hooks/useDialog'

const MyComponent = () => {
  const dialog = useDialog()

  const handleAction = async () => {
    const confirmed = await dialog.confirm({
      message: 'Are you sure?',
      variant: 'danger'
    })

    if (confirmed) {
      // Do something
    }
  }

  return <button onClick={handleAction}>Action</button>
}
```

## Design Tokens

All modals use the product's design tokens from `src/shared/constants/designTokens.ts`:

- **Primary Color:** Orange gradient (from-orange-500 to-orange-600)
- **Border Radius:** rounded-xl (12px) for modal containers
- **Shadows:** shadow-2xl for modal elevation
- **Animations:** fadeIn and slideUp animations
- **Typography:** Consistent font sizes and weights
- **Spacing:** Standard padding (p-6) and gaps

## Variants

### Modal Sizes
- `sm`: max-w-md (28rem)
- `md`: max-w-lg (32rem) - default
- `lg`: max-w-2xl (42rem)
- `xl`: max-w-4xl (56rem)
- `full`: max-w-7xl (80rem)

### Header Variants
- `default`: White background with gray border
- `gradient`: Orange gradient background (matching brand)

### ConfirmDialog Variants
- `danger`: Red color scheme (for destructive actions)
- `warning`: Amber color scheme (for caution)
- `info`: Blue color scheme (for information)
- `primary`: Orange gradient (for primary actions)

### AlertDialog Variants
- `success`: Green color scheme
- `error`: Red color scheme
- `warning`: Amber color scheme
- `info`: Blue color scheme

## Best Practices

1. **Use ConfirmDialog for destructive actions** - Always use `variant="danger"` for delete operations
2. **Use AlertDialog for notifications** - Success messages, error messages, etc.
3. **Use the dialog utility for simple prompts** - No need to manage state
4. **Use Modal for complex forms** - Custom content with footer actions
5. **Always provide clear messages** - Be specific about what will happen
6. **Use appropriate variants** - Match the variant to the action type
7. **Handle async operations** - Show loading states when needed

## Examples

### Complex Form Modal
```jsx
const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add User"
  size="md"
  footer={
    <div className="flex justify-end space-x-3">
      <button
        onClick={() => setIsOpen(false)}
        className="px-4 py-2 border rounded-lg"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg"
      >
        Add User
      </button>
    </div>
  }
>
  <form>
    {/* Form fields */}
  </form>
</Modal>
```

### Quick Confirmation
```javascript
const handleDelete = async () => {
  if (await dialog.confirm({
    message: 'Delete this item?',
    variant: 'danger'
  })) {
    await deleteItem()
    await dialog.alert({
      message: 'Item deleted!',
      variant: 'success'
    })
  }
}
```

## Accessibility

All modal components include:
- Proper ARIA attributes (role="dialog", aria-modal="true", aria-labelledby)
- Keyboard navigation (ESC to close)
- Focus management (body scroll lock when open)
- Screen reader support

## Browser Support

The modal system works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
