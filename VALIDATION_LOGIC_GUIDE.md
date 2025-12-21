# Form Builder - Validation & Logic Rules Guide

## Overview
The Form Builder now includes comprehensive validation and logic features for creating intelligent, conditional forms for clinical trials.

## Features Implemented

### 1. **Validation Rules** ✓

#### For Text/Textarea Components:
- **Min Length**: Minimum number of characters required
- **Max Length**: Maximum number of characters allowed
- **Pattern (Regex)**: Custom regular expression for format validation
- **Custom Error Message**: Personalized error messages for validation failures

#### For Number Components:
- **Min Value**: Minimum numeric value allowed
- **Max Value**: Maximum numeric value allowed

#### Common Pattern Templates:
- **Letters only**: `^[A-Za-z\s]+$`
- **Numbers only**: `^[0-9]+$`
- **Email address**: Validates email format
- **Phone (10 digits)**: `^\d{10}$`

### 2. **Show/Hide Logic** 👁️

Conditionally show or hide form fields based on other field values.

**Configuration Options:**
- **Target Field**: Select which field to monitor
- **Condition Types**:
  - Equals
  - Not Equals
  - Contains
  - Greater Than
  - Less Than
- **Target Value**: The value to compare against

**Example Use Case:**
- Show "Reason for hospitalization" field only when "Were you hospitalized?" = "Yes"

### 3. **Skip Logic** ⏭️

Navigate users to different questions based on their answers.

**Configuration Options:**
- **Condition**: When answer equals/not equals/contains specific value
- **Target Value**: The trigger value
- **Skip to Field**: Which field to jump to

**Example Use Case:**
- If "Do you smoke?" = "No", skip to "Exercise habits" (bypassing smoking-related questions)

### 4. **Custom Validation** 📋

Create custom validation rules with personalized error messages.

**Features:**
- Combine multiple validation rules (min/max + pattern)
- Custom error messages for better user guidance
- Real-time validation in preview mode

### 5. **Branching Logic** 🔀

Create complex conditional paths based on multiple answers.

**Status**: Foundation implemented, ready for complex rule addition

## How to Use

### Step 1: Build Your Form
1. Drag components from the left panel to the canvas
2. Click on a component to select it

### Step 2: Configure Basic Properties
1. Click the **"Basic"** tab in the right panel
2. Set:
   - Label (question text)
   - Required field checkbox
   - Placeholder text
   - Help text

### Step 3: Add Validation Rules
1. Click the **"Validation"** tab
2. For text fields:
   - Set min/max length
   - Add regex pattern
   - Set custom error message
3. For number fields:
   - Set min/max values
4. Use quick templates for common patterns (email, phone, etc.)

### Step 4: Configure Logic Rules
1. Click the **"Logic"** tab
2. Enable **Show/Hide Logic**:
   - Select the field to monitor
   - Choose condition type
   - Enter trigger value
3. Enable **Skip Logic**:
   - Set condition and value
   - Select which field to skip to
4. Enable **Branching Logic** (advanced)

### Step 5: Test in Preview
1. Click **"Preview"** button
2. Fill out the form to test:
   - Validation errors appear in red
   - Show/Hide logic works dynamically
   - Error messages display below fields
3. Fields with logic show visual indicators:
   - 👁️ Show/Hide Logic enabled
   - ⏭️ Skip Logic enabled
   - 🔀 Branching Logic enabled
   - ✓ Validation Rules applied

### Step 6: Save Your Form
1. Click **"Save Form"** when complete
2. All validation and logic rules are preserved
3. Forms persist across sessions

## Visual Indicators

Components with applied logic show colored badges in the canvas:

- **Blue badge (👁️)**: Show/Hide Logic
- **Purple badge (⏭️)**: Skip Logic
- **Green badge (🔀)**: Branching Logic
- **Amber badge (✓)**: Validation Rules

## Preview Mode Features

The preview mode is fully functional:

- **Real-time validation**: Errors appear as you type
- **Dynamic field visibility**: Fields show/hide based on conditions
- **Error highlighting**: Invalid fields have red borders
- **Error messages**: Clear feedback below each field
- **Logic indicators**: See which rules are active on each field

## Example Scenarios

### Scenario 1: Patient Demographics Form
```
Field 1: "Age" (Number Input)
- Validation: Min=18, Max=100
- Error: "Age must be between 18 and 100"

Field 2: "Are you pregnant?" (Radio)
- Show/Hide: Only shown when Gender="Female" AND Age>18

Field 3: "Due Date" (Date)
- Show/Hide: Only shown when "Are you pregnant?"="Yes"
```

### Scenario 2: Medication History
```
Field 1: "Taking medications?" (Radio: Yes/No)

Field 2: "Medication name" (Text)
- Show/Hide: When Field 1="Yes"
- Validation: Min=2, Max=50 characters
- Pattern: Letters only

Field 3: "Dosage" (Number)
- Show/Hide: When Field 1="Yes"
- Validation: Min=0.1, Max=1000

Field 4: "Health conditions" (Textarea)
- Skip Logic: If Field 1="No", skip directly here
```

### Scenario 3: Adverse Event Reporting
```
Field 1: "Event severity" (Dropdown)
- Options: Mild, Moderate, Severe

Field 2: "Describe event" (Textarea)
- Validation: Min=20 characters
- Required: true

Field 3: "Required hospitalization?" (Checkbox)
- Show/Hide: Only when severity="Severe"

Field 4: "Hospital name" (Text)
- Show/Hide: When Field 3=checked
- Validation: Pattern=Letters only
```

## Technical Implementation

### Validation Engine
- Validates on field change
- Checks required fields
- Validates length/value ranges
- Tests regex patterns
- Returns array of error messages

### Logic Engine
- Evaluates conditions in real-time
- Supports multiple condition types
- Handles nested logic
- Preserves form state

### Data Storage
All validation and logic rules are stored in the component's config:

```javascript
component: {
  id: 123,
  type: 'text',
  label: 'Email Address',
  config: {
    required: true,
    validation: {
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      customMessage: 'Please enter a valid email'
    },
    showHide: {
      enabled: true,
      condition: 'equals',
      targetField: 456,
      targetValue: 'Yes'
    }
  }
}
```

## Best Practices

1. **Start Simple**: Add basic validation first, then layer on logic
2. **Test Thoroughly**: Use preview mode to test all paths
3. **Clear Messages**: Write helpful, specific error messages
4. **Logical Flow**: Ensure skip logic creates a sensible user journey
5. **Visual Feedback**: Check that badges appear for configured rules
6. **Save Often**: Save your form after adding complex logic

## Future Enhancements

- Multi-field branching conditions (AND/OR logic)
- Calculated fields (auto-fill based on other values)
- Date range validation
- Cross-field validation (e.g., end date > start date)
- Export validation rules as documentation
- Import/export logic templates

## Support

For issues or questions:
- Check the preview mode to test validation
- Look for visual badges indicating applied logic
- Verify field selections in dropdowns
- Ensure target fields exist before adding logic

---

**Version**: 1.0
**Last Updated**: December 2025
