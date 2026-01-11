# Simplified Condition UI - Self-Explanatory Design

## Overview

The condition configuration UI has been redesigned to be completely self-explanatory without needing separate "Logic Flow" sections. Everything you need to understand is visible directly in the configuration.

## Visual Design

### Example Configuration

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🟠 1  Condition 1                                                     ✕ │
│ Baseline → Pain Assessment (VAS) → Current Pain Level > 50             │
├─────────────────────────────────────────────────────────────────────────┤
│ From Visit:  [Baseline ▼]                                              │
│ Form:        [Pain Assessment (VAS) ▼]                                 │
│ Field:       [Current Pain Level (vas) ▼]                              │
│ Operator:    [> Greater than ▼]                                        │
│ Value:       [50]                                                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🔵 [AND] [OR]                                                           │
│ Both the condition above AND this one must be true                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🟠 2  Condition 2                                                     ✕ │
│ Baseline → Medical History → Do you have diabetes? BETWEEN 78 AND 234  │
├─────────────────────────────────────────────────────────────────────────┤
│ From Visit:  [Baseline ▼]                                              │
│ Form:        [Medical History ▼]                                       │
│ Field:       [Do you have diabetes? (number) ▼]                        │
│ Operator:    [BETWEEN (range) ▼]                                       │
│ Min Value:   [78]                                                       │
│ Max Value:   [234]                                                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🟣 [AND] [OR]                                                           │
│ Either the condition above OR this one must be true                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 🟠 3  Condition 3                                                     ✕ │
│ Baseline → Medical History → Diet type == 1                            │
├─────────────────────────────────────────────────────────────────────────┤
│ From Visit:  [Baseline ▼]                                              │
│ Form:        [Medical History ▼]                                       │
│ Field:       [Diet type (dropdown) ▼]                                  │
│ Operator:    [== Equal to ▼]                                           │
│ Value:       [1]                                                        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ ✓ 3 conditions configured                                               │
│ This visit will occur if at least one of the condition groups above     │
│ is satisfied                                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. **Live Preview in Header** 🎯
Each condition card shows the complete condition preview in the orange header:
- ✅ Visit → Form → Field → Operator → Value
- ✅ Updates in real-time as you configure
- ✅ Prominently displayed - no need to look elsewhere
- ✅ Shows "Configure condition below..." when empty

### 2. **Inline AND/OR Selector** 🔄
Between conditions, clear buttons with color-coded backgrounds:
- **AND** = Blue background when selected
- **OR** = Purple background when selected
- Immediate inline explanation of what the operator means

### 3. **Self-Explanatory Logic Operators** 📖

**When AND is selected:**
```
┌───────────────────────────────────────────────────┐
│ 🔵 [AND] [OR]                                     │
│ Both the condition above AND this one must be true│
└───────────────────────────────────────────────────┘
```

**When OR is selected:**
```
┌───────────────────────────────────────────────────┐
│ 🟣 [AND] [OR]                                     │
│ Either the condition above OR this one must be true│
└───────────────────────────────────────────────────┘
```

### 4. **Color Coding** 🎨
- **Orange** - Condition headers (brand color)
- **Blue** - AND logic
- **Purple** - OR logic
- **Green** - Summary/success
- **Red** - Validation errors

### 5. **Visual Hierarchy** 📐
- Condition cards are large and prominent
- Logic operators have distinct backgrounds
- No gaps between related elements
- Clear separation between different sections

### 6. **Simple Summary** ✅
One-line summary at the bottom:
- All AND: "This visit will occur only when all conditions above are satisfied"
- Has OR: "This visit will occur if at least one of the condition groups above is satisfied"

## Evaluation Examples

### Example 1: All AND Logic
```
Condition 1: Age >= 18
AND
Condition 2: Score > 50
AND
Condition 3: Status == "Active"

Result: ALL three must be true
```

### Example 2: All OR Logic
```
Condition 1: Pain > 7
OR
Condition 2: Emergency == "Yes"
OR
Condition 3: Priority == "High"

Result: At least ONE must be true
```

### Example 3: Mixed AND/OR
```
Condition 1: Age >= 18
AND
Condition 2: Score > 50
OR
Condition 3: VIP == "Yes"

Result: Either (Age >= 18 AND Score > 50) OR (VIP == "Yes")
        Groups are formed by OR operators
        Within each group, conditions are connected by AND
```

## Understanding Operator Precedence

**Rule: AND is evaluated before OR**

Visual grouping in the example:
```
Condition 1: Pain > 50
└─ AND ─┐
Condition 2: Diabetes BETWEEN 78 AND 234
         └─ [Group 1: Both must be true]

└─ OR ─┐

Condition 3: Diet == 1
        └─ [Group 2: This one alone]

Result: (Group 1) OR (Group 2)
```

## No Separate Logic Flow Section!

❌ **Removed:**
- Separate "Logic Flow" visualization
- Redundant condition listing
- Evaluation order breakdown

✅ **Instead:**
- Everything is clear from the cards themselves
- Live preview shows what you're configuring
- Inline explanations at each logic operator
- Simple summary statement

## Benefits

1. **Self-Explanatory** - No need to look elsewhere for understanding
2. **Real-Time Feedback** - See your condition as you build it
3. **Clear Logic** - Operator meanings shown inline
4. **Less Clutter** - No duplicate information
5. **Better UX** - Focus on configuration, not interpretation
6. **Accessible** - Color-coded and clearly labeled

## User Flow

1. **Add Condition** → Click "Add First Condition"
2. **Configure** → Select visit, form, field, operator, value
3. **See Preview** → Live preview updates in orange header
4. **Add Logic** → If adding another condition, choose AND/OR
5. **Understand** → Read inline explanation of what AND/OR means
6. **Verify** → Check simple summary at bottom
7. **Done!** → No need to cross-reference with other sections

## Comparison

### Before (Complex)
- Condition cards
- Separate "Logic Flow" section
- Evaluation order breakdown
- Preview boxes in each card
- Redundant information
- Need to scroll to see full picture

### After (Simple)
- Condition cards with prominent header preview
- Inline AND/OR with explanations
- One-line summary
- Everything visible at a glance
- Self-contained and clear

## Technical Details

### Component Structure
```jsx
<div className="space-y-0">
  {conditions.map((condition, index) => (
    <div key={condition.id}>
      {/* Logic Operator (if not first) */}
      {index > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400">
          <button>AND</button>
          <button>OR</button>
          <p>Inline explanation...</p>
        </div>
      )}

      {/* Condition Card */}
      <div className="border-2 border-gray-300 bg-white">
        {/* Orange Header with Live Preview */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600">
          <div>Condition {index + 1}</div>
          <div>Visit → Form → Field Operator Value</div>
        </div>

        {/* Configuration Form */}
        <div className="p-4">
          {/* Dropdowns and inputs */}
        </div>
      </div>
    </div>
  ))}
</div>
```

### Color Classes
- AND background: `bg-blue-50 border-l-4 border-blue-400`
- OR background: `bg-purple-50 border-l-4 border-purple-400`
- AND button active: `bg-blue-500 text-white`
- OR button active: `bg-purple-500 text-white`
- Condition header: `bg-gradient-to-r from-orange-500 to-orange-600`

## Accessibility

- ✅ Clear color distinctions
- ✅ Text labels for all operators
- ✅ Inline explanations for understanding
- ✅ Prominent visual hierarchy
- ✅ Keyboard navigable
- ✅ Screen reader friendly

## Summary

The new design is:
- **Simpler** - No separate sections needed
- **Clearer** - Everything visible in context
- **Faster** - Less scrolling and searching
- **Better UX** - Focus on building, not interpreting
- **Self-Explanatory** - No documentation needed to understand

Everything you need to know is right there in the configuration! 🎉
