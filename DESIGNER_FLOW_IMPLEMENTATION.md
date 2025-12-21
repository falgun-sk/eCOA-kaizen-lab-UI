# Designer Flow Implementation

## Overview
The Designer Flow has been implemented for the Study Designer/Builder role based on the `Designer Flow.pdf` wireframes. This is a **separate role-based interface** from the Project Manager flow.

## User Credentials
To test the Designer Flow, login with:
- **Username**: `designer_user`
- **Password**: `designer123`
- **Role**: Study Designer/Builder

## Implemented Pages

### 1. Designer Study Detail (`/designer/studies/:studyId`)
**Purpose**: Main landing page for designers showing action buttons

**Features**:
- Study information display (Name, Code, Protocol ID, Version)
- 5 Action buttons:
  - Create New Form
  - Edit Existing Form
  - Create/Edit Visit Schedule
  - Add Languages
  - Designer Notes
- Existing forms table

**File**: `src/features/designer/pages/DesignerStudyDetail.jsx`

---

### 2. Form Builder (`/designer/studies/:studyId/forms/:formId`)
**Purpose**: Drag-and-drop form builder interface

**Features**:
- **Left Panel**: Component palette with draggable components:
  - Text Input
  - Checkbox
  - Radio Button
  - Dropdown
  - Date Picker
  - VAS Scale
  - Likert Scale
  - Text Area

- **Center Panel**: Canvas area for form design
  - Drag components from palette
  - Visual component display
  - Component selection and deletion

- **Right Panel**: Properties and validation
  - Component properties (label, required)
  - Validation rules (Show/Hide Logic, Skip Logic, Custom Validation)
  - Branching logic configuration

**File**: `src/features/designer/pages/FormBuilder.jsx`

---

### 3. Language Management (`/designer/studies/:studyId/languages`)
**Purpose**: Manage study translations and language versions

**Features**:
- Languages table showing:
  - Country
  - Language
  - Language Code
  - Status (Approved, Draft, Review)
  - Actions (Edit, Remove)

- Add Languages Modal:
  - Select from available translations
  - Multi-select checkbox interface
  - Bulk add languages

**File**: `src/features/designer/pages/LanguageManagement.jsx`

---

### 4. Visit Schedule (`/designer/studies/:studyId/visit-schedule`)
**Purpose**: Configure study visit timeline and form mappings

**Features**:
- Visit timeline cards showing:
  - Visit name
  - Study day
  - Visit window
  - Assigned forms

- Add Visit Modal:
  - Visit name input
  - Study day configuration
  - Visit window specification
  - Form assignment (multi-select)

- Form management per visit:
  - Add/remove forms
  - Visual form tags

**File**: `src/features/designer/pages/VisitSchedule.jsx`

---

### 5. Designer Notes (`/designer/studies/:studyId/notes`)
**Purpose**: Document design decisions and important information

**Features**:
- Notes list showing:
  - Note title
  - Note content
  - Created by
  - Created and updated timestamps

- Add/Edit Note Modal:
  - Title input
  - Content text area
  - Timestamp tracking

- Note actions:
  - Edit existing notes
  - Delete notes with confirmation

**File**: `src/features/designer/pages/DesignerNotes.jsx`

---

## Routing Structure

### Designer Routes (Protected)
All designer routes require `ROLES.STUDY_DESIGNER` role:

```
/designer/studies/:studyId                    → Designer Study Detail
/designer/studies/:studyId/forms/new          → Form Builder (New)
/designer/studies/:studyId/forms/:formId      → Form Builder (Edit)
/designer/studies/:studyId/languages          → Language Management
/designer/studies/:studyId/visit-schedule     → Visit Schedule
/designer/studies/:studyId/notes              → Designer Notes
```

### PM/Admin Routes (Existing)
```
/studies/:studyId                             → PM Study Detail
/studies/:studyId/build                       → Study Build (PM view)
/studies/:studyId/actions                     → Pending Actions
/studies/:studyId/reports                     → Reports
/studies/:studyId/uat                         → UAT
/studies/:studyId/docs                        → Docs
```

---

## Key Differences: Designer vs PM Flow

| Feature | Designer Flow | PM Flow |
|---------|--------------|---------|
| **Form Builder** | ✅ Full drag-drop interface | ❌ View only |
| **Language Management** | ✅ Add/edit languages | ❌ Not available |
| **Visit Schedule** | ✅ Configure visits | ❌ Not available |
| **Designer Notes** | ✅ Create/edit notes | ❌ Not available |
| **Study Deployment** | ❌ Cannot deploy | ✅ Can deploy |
| **Reports Access** | ❌ Not available | ✅ Full access |
| **UAT Management** | ❌ Not available | ✅ Full access |

---

## Role-Based Access

The implementation uses the `ProtectedRoute` component with role checking:

```jsx
<ProtectedRoute allowedRoles={[ROLES.STUDY_DESIGNER]}>
  <DesignerStudyDetail />
</ProtectedRoute>
```

**Roles defined in**: `src/features/access/constants/roles.js`

---

## Navigation Flow

### For Study Designers:
1. Login → Dashboard
2. Click on Study → `/designer/studies/:studyId`
3. Choose action:
   - Create New Form → Form Builder
   - Edit Form → Form Builder
   - Visit Schedule → Visit Schedule
   - Add Languages → Language Management
   - Notes → Designer Notes

### For Project Managers:
1. Login → Dashboard
2. Click on Study → `/studies/:studyId`
3. Access PM-specific features (Reports, UAT, Deploy, etc.)

---

## Testing

### Test as Designer:
1. Login with `designer_user` / `designer123`
2. Navigate to Dashboard
3. Click on any study
4. You should see Designer Study Detail with 5 action buttons
5. Test each feature:
   - Form Builder with drag-drop
   - Add languages
   - Configure visit schedule
   - Create designer notes

### Test as PM:
1. Login with `pm_user` / `pm1234`
2. Navigate to Dashboard
3. Click on any study
4. You should see PM Study Detail with different tiles
5. Access PM-specific features

---

## Future Enhancements

### Phase 2:
- [ ] Templates library integration
- [ ] Real-time collaboration on forms
- [ ] Version control and diff viewer
- [ ] Advanced validation rules builder
- [ ] Form preview in mobile view
- [ ] Translation workflow management
- [ ] Form analytics and usage tracking

---

## Files Created

### Pages:
- `src/features/designer/pages/DesignerStudyDetail.jsx`
- `src/features/designer/pages/FormBuilder.jsx`
- `src/features/designer/pages/LanguageManagement.jsx`
- `src/features/designer/pages/VisitSchedule.jsx`
- `src/features/designer/pages/DesignerNotes.jsx`

### Routes Updated:
- `src/App.jsx` - Added Designer routes with role-based protection

---

## Dependencies

No new dependencies required. Uses existing:
- React Router DOM (navigation)
- Tailwind CSS (styling)
- Existing ProtectedRoute component

---

## Notes

- Designer flow is completely **separate** from PM flow
- **Role-based access** ensures proper separation of duties
- All Designer pages are **protected routes** requiring `STUDY_DESIGNER` role
- Form builder uses HTML5 drag-drop API
- Mock data is used for initial implementation
- Ready for backend API integration

---

**Implementation Date**: December 2024
**Based on**: Designer Flow.pdf wireframes
**Implemented by**: Claude Code
