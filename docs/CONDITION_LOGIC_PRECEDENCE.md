# Condition Logic Operator Precedence

## Overview

The visit condition system respects proper boolean operator precedence when evaluating multiple conditions with mixed AND/OR operators.

## Operator Precedence Rule

**AND operators are evaluated before OR operators**

This follows standard boolean logic conventions used in programming and mathematics.

## How It Works

### Example 1: Simple AND Chain
```
Condition 1: Age >= 18
AND
Condition 2: Score > 50
AND
Condition 3: Status == "Active"
```

**Evaluation:**
```
(Age >= 18) AND (Score > 50) AND (Status == "Active")
```

**Result:** ALL three conditions must be true

---

### Example 2: Simple OR Chain
```
Condition 1: Pain Score > 7
OR
Condition 2: Emergency == "Yes"
OR
Condition 3: Priority == "High"
```

**Evaluation:**
```
(Pain Score > 7) OR (Emergency == "Yes") OR (Priority == "High")
```

**Result:** At least ONE condition must be true

---

### Example 3: Mixed AND/OR (Precedence Matters!)
```
Condition 1: Age >= 18
AND
Condition 2: Score > 50
OR
Condition 3: VIP == "Yes"
```

**Evaluation with Precedence:**
```
(Age >= 18 AND Score > 50) OR (VIP == "Yes")
```

**Explanation:**
1. First, evaluate the AND group: `(Age >= 18 AND Score > 50)`
2. Then evaluate the OR: `[AND_GROUP_RESULT] OR (VIP == "Yes")`

**Result:** Either:
- BOTH (Age >= 18 AND Score > 50) are true, OR
- VIP == "Yes"

---

### Example 4: Complex Mixed Logic
```
Condition 1: Age BETWEEN 18 AND 65
AND
Condition 2: BMI > 18
OR
Condition 3: Waiver == "Approved"
AND
Condition 4: Consent == "Signed"
```

**Evaluation with Precedence:**
```
(Age BETWEEN 18 AND 65 AND BMI > 18) OR (Waiver == "Approved" AND Consent == "Signed")
```

**Groups:**
1. Group 1: `(Age BETWEEN 18 AND 65 AND BMI > 18)`
2. Group 2: `(Waiver == "Approved" AND Consent == "Signed")`

**Result:** Either:
- BOTH (Age in range AND BMI > 18), OR
- BOTH (Waiver approved AND Consent signed)

---

## Visual Breakdown in UI

When you configure conditions with mixed AND/OR operators, the system shows:

1. **Logic Flow Section** - Lists all conditions with their operators
2. **Evaluation Order Section** - Shows how conditions are grouped

### UI Example:

```
Logic Flow:
1. Age >= 18
   • AND
2. Score > 50
   • OR
3. VIP == "Yes"

Evaluation Order:
(Condition 1 AND Condition 2) OR (Condition 3)
➜ At least one group must be true for visit to occur
```

---

## Technical Implementation

### Algorithm

```javascript
1. Evaluate each condition to get boolean results
2. Group conditions by OR operators
   - Everything between OR operators forms an AND group
3. Evaluate each AND group (all must be true within group)
4. Evaluate OR groups (at least one group must be true)
```

### Code Example

```javascript
// Input conditions:
[
  { result: true,  operator: null  },  // Condition 1
  { result: false, operator: 'AND' },  // Condition 2
  { result: true,  operator: 'OR'  },  // Condition 3
]

// Step 1: Group by OR
// Group 1: [true, false]  (Condition 1 AND Condition 2)
// Group 2: [true]         (Condition 3)

// Step 2: Evaluate AND groups
// Group 1: true AND false = false
// Group 2: true = true

// Step 3: Evaluate OR groups
// false OR true = TRUE
```

---

## Best Practices

### 1. Keep Logic Simple
When possible, use only AND or only OR to avoid confusion:
- All AND: "Must meet all criteria"
- All OR: "Must meet at least one criterion"

### 2. Use Grouping Wisely
Think of OR operators as creating separate "paths" to trigger the visit:
```
Path 1: (Condition 1 AND Condition 2)
Path 2: (Condition 3 AND Condition 4)
```

### 3. Review the Evaluation Order
Always check the "Evaluation Order" section to ensure the logic matches your intent.

### 4. Test Your Conditions
Verify with example data:
```
Example: Age=25, Score=60, VIP="No"
✓ Group 1: (25 >= 18 AND 60 > 50) = TRUE
✗ Group 2: ("No" == "Yes") = FALSE
Result: TRUE OR FALSE = TRUE ✓ Visit occurs
```

---

## Common Patterns

### Pattern 1: "OR with Prerequisites"
```
Condition 1: Age >= 18      (Prerequisite)
AND
Condition 2: Score > 50     (Criterion A)
OR
Condition 3: Score > 70     (Criterion B)
```
**Meaning:** Must be 18+, AND score must be either >50 OR >70
**Grouped:** `(Age >= 18 AND Score > 50) OR (Score > 70)`
**Issue:** Score > 70 doesn't require Age >= 18!

**Better Pattern:**
```
Condition 1: Age >= 18
AND
Condition 2: Score > 50
```
Or use two separate conditions.

### Pattern 2: "Multiple Valid Scenarios"
```
Condition 1: Primary Condition
AND
Condition 2: Secondary Condition
OR
Condition 3: Alternative Primary
AND
Condition 4: Alternative Secondary
```
**Meaning:** (Scenario 1) OR (Scenario 2)

### Pattern 3: "Exclusion with Exceptions"
```
Condition 1: Status != "Excluded"
OR
Condition 2: Override == "Yes"
```
**Meaning:** Visit occurs unless excluded, but override allows it anyway

---

## Troubleshooting

### Problem: "My logic isn't working as expected"

**Check the evaluation order:**
1. Look at the "Evaluation Order" box in the UI
2. Verify the grouping matches your intent
3. Test with example values

**Example Issue:**
```
Intent: "Age >= 18 OR (Score > 50 AND VIP)"
Configured:
- Age >= 18
- OR
- Score > 50
- AND
- VIP == "Yes"

Result: (Age >= 18 OR Score > 50) AND (VIP == "Yes")
         ↑ WRONG! VIP applies to both paths
```

**Solution:** Reorder to respect precedence:
```
Configured:
- Score > 50
- AND
- VIP == "Yes"
- OR
- Age >= 18

Result: (Score > 50 AND VIP == "Yes") OR (Age >= 18)
         ↑ CORRECT!
```

---

## Comparison with Other Systems

| System | Precedence | Example: A AND B OR C |
|--------|------------|----------------------|
| **eCOA Kaizen** | AND before OR | (A AND B) OR C |
| SQL | AND before OR | (A AND B) OR C |
| JavaScript | && before \|\| | (A && B) \|\| C |
| Python | and before or | (A and B) or C |
| Excel | Left-to-right* | (A AND B) OR C* |

*Excel's approach varies by formula complexity

**Our implementation follows industry-standard precedence rules.**

---

## Future Enhancements

Potential improvements:

- [ ] Explicit parentheses support in UI
- [ ] Visual tree diagram of logic
- [ ] Condition testing with mock data
- [ ] Logic optimization suggestions
- [ ] Import/export condition templates

---

## Summary

✅ **AND is evaluated before OR** (standard precedence)
✅ **Groups are shown in the UI** for clarity
✅ **Think in terms of "OR groups"** - each group is a valid path
✅ **Review the evaluation order** to verify your logic
✅ **Test with examples** to ensure correctness
