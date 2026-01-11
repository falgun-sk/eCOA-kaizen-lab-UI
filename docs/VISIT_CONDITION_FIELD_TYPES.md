# Visit Condition Field Types Guide

## Overview

The visit condition system is **field type-aware**, meaning the available operators change dynamically based on the data type of the selected field. This ensures that you only see operators that make sense for the field you're working with.

## Field Types & Operators Matrix

| Field Type | Available Operators | Use Cases |
|------------|---------------------|-----------|
| **Number** | `>`, `>=`, `<`, `<=`, `==`, `!=`, `BETWEEN` | Scores, ages, counts, measurements |
| **VAS** | `>`, `>=`, `<`, `<=`, `==`, `!=`, `BETWEEN` | Visual analog scales, pain scores |
| **Text** | `==`, `!=` | Patient IDs, comments, open responses |
| **Dropdown** | `==`, `!=` | Selected options, categories |
| **Select** | `==`, `!=` | Single choice selections |
| **Radio** | `==`, `!=` | Single choice from options |

## Numeric Fields (Number, VAS)

### Available Operators
✓ All 7 operators available including BETWEEN

### Examples

**Number Field:**
```
Field: Patient Age
Type: number
Available Operators: >, >=, <, <=, ==, !=, BETWEEN
Example Condition: Age BETWEEN 18 AND 65
```

**VAS Field:**
```
Field: Pain Score (0-10)
Type: vas
Available Operators: >, >=, <, <=, ==, !=, BETWEEN
Example Condition: Pain Score > 5
```

### Best For
- Numeric comparisons
- Range checking
- Threshold-based logic
- Measurement validation

## Text Fields

### Available Operators
⚠️ Only `==` and `!=` (equality operators)

### Why Limited?
Text fields don't have a natural ordering, so comparison operators like "greater than" or "less than" don't make logical sense. The BETWEEN operator is also not applicable.

### Examples

**Text Field:**
```
Field: Patient ID
Type: text
Available Operators: ==, !=
Example Condition: Patient ID == "P12345"
```

**Text Response:**
```
Field: Comments
Type: text
Available Operators: ==, !=
Example Condition: Comments != "None"
```

### Best For
- Exact matches
- Exclusion criteria
- ID verification
- Specific text responses

## Dropdown/Select/Radio Fields

### Available Operators
⚠️ Only `==` and `!=` (equality operators)

### Why Limited?
These fields represent categorical data with predefined options. Only equality checks make sense for discrete choices.

### Examples

**Dropdown Field:**
```
Field: Study Arm
Type: dropdown
Available Operators: ==, !=
Example Condition: Study Arm == "Treatment A"
```

**Radio Field:**
```
Field: Gender
Type: radio
Available Operators: ==, !=
Example Condition: Gender != "Prefer not to say"
```

**Select Field:**
```
Field: Medication Type
Type: select
Available Operators: ==, !=
Example Condition: Medication Type == "Aspirin"
```

### Best For
- Category matching
- Option selection verification
- Exclusion based on choices
- Enrollment criteria

## UI Behavior

### Field Selection
When you select a field in the condition builder, you'll see:

1. **Field name with type indicator**
   ```
   Pain Score (number) ✓ All operators available
   Patient ID (text) ⚠️ Limited operators
   Study Arm (dropdown) ⚠️ Limited operators
   ```

2. **Operator dropdown updates**
   - Shows only applicable operators
   - Automatically resets if current operator becomes invalid

3. **Helper text**
   - "✓ All operators available (numeric field)" - for number/VAS
   - "⚠️ Limited operators (non-numeric field)" - for text/dropdown/etc.

### Smart Operator Reset

If you change from a numeric field to a non-numeric field while using BETWEEN:

**Before:**
- Field: Pain Score (number)
- Operator: BETWEEN
- Values: 30 and 70

**After changing to:**
- Field: Patient ID (text)
- Operator: Automatically resets to `==` (first available operator)
- Value: Single input field shown

## Practical Examples

### Example 1: Age-Based Conditions (Numeric)
```
Condition: Schedule follow-up if patient age is in target range
Field: Age (number)
Operator: BETWEEN ✓
Min Value: 18
Max Value: 65
Result: Only patients aged 18-65 will trigger this visit
```

### Example 2: Score Threshold (Numeric)
```
Condition: Schedule intervention if pain exceeds threshold
Field: Pain Score (vas)
Operator: > ✓
Value: 7
Result: Visit scheduled when pain score is above 7
```

### Example 3: Treatment Arm (Dropdown)
```
Condition: Schedule visit only for treatment group
Field: Study Arm (dropdown)
Operator: == ✓
Value: Treatment A
Result: Only "Treatment A" patients get this visit
```

### Example 4: Text Exclusion
```
Condition: Skip visit if patient declined
Field: Consent Status (text)
Operator: != ✓
Value: Declined
Result: Visit skipped if status is "Declined"
```

## Error Prevention

### Invalid Operator Combinations

The system prevents these invalid scenarios automatically:

❌ **Cannot use BETWEEN on text field**
- System won't show BETWEEN option for text fields

❌ **Cannot use > on dropdown**
- Comparison operators hidden for categorical fields

❌ **Cannot use < on radio buttons**
- Only equality operators shown

### Validation Messages

If somehow an invalid configuration occurs:
- Red error box with clear message
- Condition won't be saved until fixed
- Helpful hints to resolve the issue

## Implementation Details

### getOperatorsForFieldType() Function

```javascript
// Numeric fields: all operators including BETWEEN
if (['number', 'vas'].includes(fieldType)) {
  return [
    { value: '>', label: '> Greater than' },
    { value: '>=', label: '>= Greater or equal' },
    { value: '<', label: '< Less than' },
    { value: '<=', label: '<= Less or equal' },
    { value: '==', label: '== Equal to' },
    { value: '!=', label: '!= Not equal to' },
    { value: 'BETWEEN', label: 'Between (range)' }
  ]
}

// Text fields: only equality operators
if (fieldType === 'text') {
  return [
    { value: '==', label: '== Equal to' },
    { value: '!=', label: '!= Not equal to' }
  ]
}

// Select/Radio/Dropdown: only equality operators
if (['select', 'radio', 'dropdown'].includes(fieldType)) {
  return [
    { value: '==', label: '== Equal to' },
    { value: '!=', label: '!= Not equal to' }
  ]
}
```

## Best Practices

### 1. Choose Appropriate Field Types
- Use **number** for quantitative data that needs range checking
- Use **text** only when free-form input is necessary
- Use **dropdown/select** for predefined categories

### 2. Design Forms with Conditions in Mind
- Structure forms to enable meaningful conditions
- Use numeric fields when you need BETWEEN operator
- Provide clear option labels for dropdown fields

### 3. Test Conditions
- Verify conditions work with expected field types
- Check edge cases (min/max values for BETWEEN)
- Test with actual form data

### 4. Document Condition Logic
- Explain why specific operators were chosen
- Note any field type constraints
- Provide example values for reference

## Troubleshooting

### "I can't find the BETWEEN operator"

**Solution:** BETWEEN is only available for numeric fields (number, VAS). Check that your selected field is one of these types.

### "My operator disappeared when I changed fields"

**Expected behavior:** The system automatically resets to a valid operator when you select a field with fewer available operators.

### "I need to compare text alphabetically"

**Limitation:** Text comparison operators (>, <) are not currently supported. Consider using:
- Numeric codes instead of text
- Predefined dropdown options
- Separate conditions for each text value

## Future Enhancements

Potential improvements for field type handling:

- [ ] Date field type with date-specific operators
- [ ] String length operators for text fields
- [ ] Pattern matching for text fields
- [ ] Numeric range extraction from text
- [ ] Custom field type definitions
