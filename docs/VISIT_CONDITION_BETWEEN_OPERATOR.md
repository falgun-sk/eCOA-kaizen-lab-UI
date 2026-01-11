# Visit Condition BETWEEN Operator Documentation

## Overview

The BETWEEN operator has been added to the visit condition logic, allowing you to create conditional visits based on whether a form field value falls within a specified range.

## Feature Location

- **Component:** `src/features/designer/components/VisitSchedule/VisitWizard/steps/Step5Conditions.jsx`
- **Evaluator:** `src/features/designer/components/VisitSchedule/conditionEvaluator.js`

## Available Operators

The visit condition logic supports different operators based on the **field type**:

### Numeric Fields (number, VAS)
All operators are available for numeric field types:

| Operator | Description | Value Input |
|----------|-------------|-------------|
| `>` | Greater than | Single value |
| `>=` | Greater than or equal to | Single value |
| `<` | Less than | Single value |
| `<=` | Less than or equal to | Single value |
| `==` | Equal to | Single value |
| `!=` | Not equal to | Single value |
| **`BETWEEN`** | **Between (range)** | **Two values (min and max)** |

### Text Fields
Only equality operators are available:

| Operator | Description | Value Input |
|----------|-------------|-------------|
| `==` | Equal to | Single text value |
| `!=` | Not equal to | Single text value |

### Select/Radio/Dropdown Fields
Only equality operators are available:

| Operator | Description | Value Input |
|----------|-------------|-------------|
| `==` | Equal to | Single selected value |
| `!=` | Not equal to | Single selected value |

## Field Type-Aware Operator Selection

The system intelligently shows only applicable operators based on the selected field type:

### How It Works

1. **Select a field** - The dropdown shows the field name and type (e.g., "Pain Score (number)")
2. **Operators update automatically** - Only valid operators for that field type are shown
3. **Visual feedback** - A helper text shows whether all operators are available or limited
4. **Smart reset** - If you change to a field with fewer operators, the operator automatically resets to a valid one

**Visual Indicators:**
- ✓ All operators available (numeric field)
- ⚠️ Limited operators (non-numeric field)

## BETWEEN Operator

### Availability

**BETWEEN is only available for numeric fields:**
- Number fields
- VAS (Visual Analog Scale) fields

**Not available for:**
- Text fields
- Dropdown/Select fields
- Radio button fields

### How It Works

The BETWEEN operator checks if a field value falls within an inclusive range (min to max).

**Example:**
- Min Value: 30
- Max Value: 70
- Field Value: 50 → **True** (50 is between 30 and 70)
- Field Value: 20 → **False** (20 is less than 30)
- Field Value: 80 → **False** (80 is greater than 70)

### UI Interface

When you select the BETWEEN operator in Step 5 (Conditions) of the Visit Wizard:

1. The single "Value" input field is replaced with two input fields:
   - **Min Value** - The lower bound of the range (inclusive)
   - **Max Value** - The upper bound of the range (inclusive)

2. Both values are required when BETWEEN is selected

3. Real-time validation ensures:
   - Min value is less than max value
   - Both values are provided
   - Visual feedback shows validation errors

### Data Structure

Conditions with BETWEEN operator are stored with the following structure:

```javascript
{
  id: 1234567890,
  sourceVisit: 1,           // ID of the visit containing the form
  sourceForm: 5,            // ID of the form containing the field
  sourceField: 3,           // ID of the field to check
  operator: 'BETWEEN',      // The operator
  value: '30',              // Min value
  valueMax: '70',          // Max value (only for BETWEEN)
  logicOperator: 'AND'      // How to combine with previous conditions
}
```

## Usage Examples

### Example 1: Patient Score Range

**Scenario:** Only schedule a follow-up visit if the patient's pain score from Visit 1 is between 4 and 7.

**Configuration:**
- From Visit: Visit 1 - Baseline
- Form: Pain Assessment
- Field: Pain Score (0-10)
- Operator: BETWEEN
- Min Value: 4
- Max Value: 7

**Preview:**
```
Visit 1 - Baseline → Pain Assessment → Pain Score BETWEEN 4 AND 7
```

### Example 2: Temperature Range

**Scenario:** Schedule a medication adjustment visit if the patient's temperature from the screening visit is between 37.5°C and 38.5°C.

**Configuration:**
- From Visit: Screening Visit
- Form: Vital Signs
- Field: Temperature (°C)
- Operator: BETWEEN
- Min Value: 37.5
- Max Value: 38.5

**Preview:**
```
Screening Visit → Vital Signs → Temperature BETWEEN 37.5 AND 38.5
```

### Example 3: Multiple Conditions with BETWEEN

**Scenario:** Schedule a visit if:
- Patient age is between 18 and 65 AND
- Blood pressure is greater than 140

**Configuration:**

**Condition 1:**
- From Visit: Screening
- Form: Demographics
- Field: Age
- Operator: BETWEEN
- Min Value: 18
- Max Value: 65

**Condition 2:**
- Logic Operator: AND
- From Visit: Screening
- Form: Vital Signs
- Field: Systolic BP
- Operator: >
- Value: 140

**Preview:**
```
Screening → Demographics → Age BETWEEN 18 AND 65
AND
Screening → Vital Signs → Systolic BP > 140
```

## Condition Evaluation

### Evaluation Logic

The condition evaluator handles BETWEEN as follows:

```javascript
// Pseudo-code
if (operator === 'BETWEEN') {
  return fieldValue >= minValue && fieldValue <= maxValue
}
```

### Using the Evaluator

You can use the condition evaluator utility to check if conditions are met:

```javascript
import { evaluateCondition, evaluateConditions } from './conditionEvaluator'

// Evaluate a single condition
const condition = {
  operator: 'BETWEEN',
  value: '30',
  valueMax: '70'
}

const result = evaluateCondition(condition, 50) // returns true
const result2 = evaluateCondition(condition, 80) // returns false

// Evaluate multiple conditions
const conditions = [
  {
    id: 1,
    sourceVisit: 1,
    sourceForm: 2,
    sourceField: 3,
    operator: 'BETWEEN',
    value: '30',
    valueMax: '70',
    logicOperator: null
  },
  {
    id: 2,
    sourceVisit: 1,
    sourceForm: 2,
    sourceField: 4,
    operator: '>',
    value: '100',
    logicOperator: 'AND'
  }
]

const formData = {
  1: { // visitId
    2: { // formId
      3: 50,  // fieldId: value (satisfies BETWEEN 30 AND 70)
      4: 120  // fieldId: value (satisfies > 100)
    }
  }
}

const result = evaluateConditions(conditions, formData) // returns true
```

## Validation

The BETWEEN operator includes built-in validation:

### Required Fields
- Min Value (value) - must be provided
- Max Value (valueMax) - must be provided

### Range Validation
- Min value must be less than max value
- Shows error: "Min value must be less than max value"

### Visual Feedback
- ✓ Green preview box when condition is valid
- ⚠️ Red error box when validation fails

## API Reference

### conditionEvaluator.js

#### evaluateCondition(condition, fieldValue)
Evaluates a single condition.

**Parameters:**
- `condition` (Object) - The condition object with operator, value, valueMax
- `fieldValue` (string|number) - The actual value from the form field

**Returns:** `boolean` - Whether the condition is met

**Example:**
```javascript
evaluateCondition({ operator: 'BETWEEN', value: '30', valueMax: '70' }, 50)
// returns true
```

#### evaluateConditions(conditions, formData)
Evaluates multiple conditions with AND/OR logic.

**Parameters:**
- `conditions` (Array) - Array of condition objects
- `formData` (Object) - Nested object with form data { visitId: { formId: { fieldId: value } } }

**Returns:** `boolean` - Whether all conditions are met

#### validateCondition(condition)
Validates condition configuration.

**Parameters:**
- `condition` (Object) - The condition object to validate

**Returns:** `Object` - `{ valid: boolean, errors: string[] }`

**Example:**
```javascript
validateCondition({
  operator: 'BETWEEN',
  value: '70',
  valueMax: '30'
})
// returns { valid: false, errors: ['Min value must be less than max value'] }
```

#### getConditionDescription(condition, visits, forms)
Gets human-readable condition description.

**Parameters:**
- `condition` (Object) - The condition object
- `visits` (Array) - Array of visit objects
- `forms` (Array) - Array of form objects

**Returns:** `string` - Human-readable description

**Example:**
```javascript
getConditionDescription(condition, visits, forms)
// returns "Visit 1 → Pain Assessment → Pain Score is between 4 and 7"
```

## Technical Implementation

### Component Changes

1. **Condition Data Structure** - Added `valueMax` field to store the upper bound
2. **Operator Dropdown** - Added BETWEEN option
3. **Value Input UI** - Conditional rendering of single vs. dual input fields
4. **Preview Display** - Updated to show "BETWEEN X AND Y" format
5. **Validation** - Real-time validation for range constraints

### Files Modified

- `Step5Conditions.jsx` - UI component for condition configuration
- `conditionEvaluator.js` - NEW - Utility for evaluating conditions

### Backward Compatibility

- Existing conditions without `valueMax` continue to work
- BETWEEN operator is additive - doesn't break existing operators
- Legacy condition data structures are supported

## Best Practices

1. **Use BETWEEN for numeric ranges** - Perfect for scores, measurements, ages
2. **Use appropriate bounds** - Ensure min/max values make sense for the field
3. **Combine with other conditions** - Use AND/OR logic for complex scenarios
4. **Test conditions** - Preview shows exactly what will be evaluated
5. **Consider edge cases** - BETWEEN is inclusive on both ends

## Future Enhancements

Potential improvements for future versions:

- [ ] NOT BETWEEN operator (exclusive range)
- [ ] Support for date ranges
- [ ] Condition testing/simulation mode
- [ ] Condition templates library
- [ ] Visual condition builder

## Support

For questions or issues with the BETWEEN operator:
1. Check the validation error messages
2. Verify min < max for BETWEEN conditions
3. Ensure field types are numeric for range comparisons
4. Review the condition preview for accuracy
