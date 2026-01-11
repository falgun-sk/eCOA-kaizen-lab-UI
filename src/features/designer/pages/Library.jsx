import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dialog } from '../../../shared/hooks/useDialog'

const Library = () => {
  const navigate = useNavigate()

  // Studies state
  const [studies, setStudies] = useState([])

  // Template data with actual form components
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Demographics Form',
      category: 'Standard',
      description: 'Basic demographic information collection form',
      fields: 8,
      lastUsed: '2 days ago',
      usageCount: 45,
      components: [
        { id: 1, type: 'text', label: 'First Name', config: { required: true } },
        { id: 2, type: 'text', label: 'Last Name', config: { required: true } },
        { id: 3, type: 'date', label: 'Date of Birth', config: { required: true } },
        { id: 4, type: 'radio', label: 'Gender', config: { required: true } },
        { id: 5, type: 'text', label: 'Email Address', config: { required: false } },
        { id: 6, type: 'text', label: 'Phone Number', config: { required: false } },
        { id: 7, type: 'dropdown', label: 'Marital Status', config: { required: false } },
        { id: 8, type: 'text', label: 'Occupation', config: { required: false } }
      ]
    },
    {
      id: 2,
      name: 'Vital Signs',
      category: 'Medical',
      description: 'Standard vital signs measurement form',
      fields: 12,
      lastUsed: '5 days ago',
      usageCount: 38,
      components: [
        { id: 1, type: 'number', label: 'Systolic Blood Pressure (mmHg)', config: { required: true, validation: { min: 70, max: 200 } } },
        { id: 2, type: 'number', label: 'Diastolic Blood Pressure (mmHg)', config: { required: true, validation: { min: 40, max: 130 } } },
        { id: 3, type: 'number', label: 'Heart Rate (bpm)', config: { required: true, validation: { min: 40, max: 200 } } },
        { id: 4, type: 'number', label: 'Temperature (°C)', config: { required: true, validation: { min: 35, max: 42 } } },
        { id: 5, type: 'number', label: 'Respiratory Rate (breaths/min)', config: { required: true } },
        { id: 6, type: 'number', label: 'Oxygen Saturation (%)', config: { required: true, validation: { min: 0, max: 100 } } },
        { id: 7, type: 'number', label: 'Weight (kg)', config: { required: true } },
        { id: 8, type: 'number', label: 'Height (cm)', config: { required: true } },
        { id: 9, type: 'date', label: 'Measurement Date', config: { required: true } },
        { id: 10, type: 'text', label: 'Measured By', config: { required: true } },
        { id: 11, type: 'dropdown', label: 'Patient Position', config: { required: false } },
        { id: 12, type: 'textarea', label: 'Additional Notes', config: { required: false } }
      ]
    },
    {
      id: 3,
      name: 'Adverse Events',
      category: 'Safety',
      description: 'Comprehensive adverse event reporting form',
      fields: 15,
      lastUsed: '1 week ago',
      usageCount: 32,
      components: [
        { id: 1, type: 'text', label: 'Event Description', config: { required: true } },
        { id: 2, type: 'date', label: 'Event Start Date', config: { required: true } },
        { id: 3, type: 'date', label: 'Event End Date', config: { required: false } },
        { id: 4, type: 'dropdown', label: 'Severity', config: { required: true } },
        { id: 5, type: 'radio', label: 'Serious Event?', config: { required: true } },
        { id: 6, type: 'dropdown', label: 'Outcome', config: { required: true } },
        { id: 7, type: 'radio', label: 'Related to Study Drug?', config: { required: true } },
        { id: 8, type: 'textarea', label: 'Event Details', config: { required: true } },
        { id: 9, type: 'checkbox', label: 'Required Hospitalization', config: { required: false } },
        { id: 10, type: 'text', label: 'Reporter Name', config: { required: true } },
        { id: 11, type: 'date', label: 'Report Date', config: { required: true } },
        { id: 12, type: 'dropdown', label: 'Action Taken', config: { required: true } },
        { id: 13, type: 'textarea', label: 'Investigator Comments', config: { required: false } },
        { id: 14, type: 'text', label: 'MedDRA Code', config: { required: false } },
        { id: 15, type: 'dropdown', label: 'Report Status', config: { required: true } }
      ]
    },
    {
      id: 4,
      name: 'Consent Form',
      category: 'Standard',
      description: 'Patient consent and information form',
      fields: 6,
      lastUsed: '3 days ago',
      usageCount: 52,
      components: [
        { id: 1, type: 'text', label: 'Participant Name', config: { required: true } },
        { id: 2, type: 'text', label: 'Study Title', config: { required: true } },
        { id: 3, type: 'checkbox', label: 'I understand the study purpose', config: { required: true } },
        { id: 4, type: 'checkbox', label: 'I understand the risks and benefits', config: { required: true } },
        { id: 5, type: 'date', label: 'Consent Date', config: { required: true } },
        { id: 6, type: 'text', label: 'Signature', config: { required: true } }
      ]
    },
    {
      id: 5,
      name: 'Medical History',
      category: 'Medical',
      description: 'Complete medical history questionnaire',
      fields: 20,
      lastUsed: '1 week ago',
      usageCount: 28,
      components: [
        { id: 1, type: 'radio', label: 'Do you have diabetes?', config: { required: true } },
        { id: 2, type: 'radio', label: 'Do you have high blood pressure?', config: { required: true } },
        { id: 3, type: 'radio', label: 'Do you have heart disease?', config: { required: true } },
        { id: 4, type: 'radio', label: 'Do you have asthma?', config: { required: true } },
        { id: 5, type: 'radio', label: 'Do you smoke?', config: { required: true } },
        { id: 6, type: 'text', label: 'Cigarettes per day (if applicable)', config: { required: false } },
        { id: 7, type: 'radio', label: 'Do you drink alcohol?', config: { required: true } },
        { id: 8, type: 'dropdown', label: 'Alcohol frequency', config: { required: false } },
        { id: 9, type: 'checkbox', label: 'Currently taking medications', config: { required: true } },
        { id: 10, type: 'textarea', label: 'List all current medications', config: { required: false } },
        { id: 11, type: 'radio', label: 'Any allergies?', config: { required: true } },
        { id: 12, type: 'textarea', label: 'List allergies', config: { required: false } },
        { id: 13, type: 'radio', label: 'Previous surgeries?', config: { required: true } },
        { id: 14, type: 'textarea', label: 'Describe surgeries', config: { required: false } },
        { id: 15, type: 'radio', label: 'Family history of cancer?', config: { required: true } },
        { id: 16, type: 'radio', label: 'Family history of heart disease?', config: { required: true } },
        { id: 17, type: 'radio', label: 'Family history of diabetes?', config: { required: true } },
        { id: 18, type: 'dropdown', label: 'Exercise frequency', config: { required: true } },
        { id: 19, type: 'dropdown', label: 'Diet type', config: { required: false } },
        { id: 20, type: 'textarea', label: 'Additional medical information', config: { required: false } }
      ]
    },
    {
      id: 6,
      name: 'Pain Assessment (VAS)',
      category: 'Assessment',
      description: 'Visual analog scale for pain measurement',
      fields: 5,
      lastUsed: '4 days ago',
      usageCount: 41,
      components: [
        { id: 1, type: 'vas', label: 'Current Pain Level', config: { required: true } },
        { id: 2, type: 'dropdown', label: 'Pain Location', config: { required: true } },
        { id: 3, type: 'dropdown', label: 'Pain Type', config: { required: true } },
        { id: 4, type: 'date', label: 'Assessment Date', config: { required: true } },
        { id: 5, type: 'textarea', label: 'Pain Description', config: { required: false } }
      ]
    },
    {
      id: 7,
      name: 'PHQ-9 (Depression Screening)',
      category: 'Clinical Scales',
      description: 'Patient Health Questionnaire-9 for depression screening with validated 0-3 response scale',
      fields: 10,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        {
          id: 1,
          type: 'radio',
          label: '1. Little interest or pleasure in doing things',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 2,
          type: 'radio',
          label: '2. Feeling down, depressed, or hopeless',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 3,
          type: 'radio',
          label: '3. Trouble falling/staying asleep, or sleeping too much',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 4,
          type: 'radio',
          label: '4. Feeling tired or having little energy',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 5,
          type: 'radio',
          label: '5. Poor appetite or overeating',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 6,
          type: 'radio',
          label: '6. Feeling bad about yourself or that you are a failure',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 7,
          type: 'radio',
          label: '7. Trouble concentrating on things',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 8,
          type: 'radio',
          label: '8. Moving or speaking slowly, or being fidgety/restless',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 9,
          type: 'radio',
          label: '9. Thoughts of being better off dead or hurting yourself',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 10,
          type: 'dropdown',
          label: 'Difficulty these problems have caused',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not difficult at all' },
              { value: 1, label: 'Somewhat difficult' },
              { value: 2, label: 'Very difficult' },
              { value: 3, label: 'Extremely difficult' }
            ]
          }
        }
      ]
    },
    {
      id: 8,
      name: 'GAD-7 (Anxiety Screening)',
      category: 'Clinical Scales',
      description: 'Generalized Anxiety Disorder 7-item scale with validated frequency responses',
      fields: 7,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        {
          id: 1,
          type: 'radio',
          label: '1. Feeling nervous, anxious, or on edge',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 2,
          type: 'radio',
          label: '2. Not being able to stop or control worrying',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 3,
          type: 'radio',
          label: '3. Worrying too much about different things',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 4,
          type: 'radio',
          label: '4. Trouble relaxing',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 5,
          type: 'radio',
          label: '5. Being so restless that it is hard to sit still',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 6,
          type: 'radio',
          label: '6. Becoming easily annoyed or irritable',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        },
        {
          id: 7,
          type: 'radio',
          label: '7. Feeling afraid, as if something awful might happen',
          config: {
            required: true,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ]
          }
        }
      ]
    },
    {
      id: 9,
      name: 'ESAS (Edmonton Symptom Assessment)',
      category: 'Clinical Scales',
      description: 'Cancer symptom assessment with 0-10 VAS scales for 10 common symptoms',
      fields: 10,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        {
          id: 1,
          type: 'vas-scale',
          label: 'Pain (0 = No pain, 10 = Worst possible pain)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 2,
          type: 'vas-scale',
          label: 'Tiredness (0 = Not tired, 10 = Worst possible tiredness)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 3,
          type: 'vas-scale',
          label: 'Nausea (0 = No nausea, 10 = Worst possible nausea)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 4,
          type: 'vas-scale',
          label: 'Depression (0 = Not depressed, 10 = Worst possible depression)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 5,
          type: 'vas-scale',
          label: 'Anxiety (0 = Not anxious, 10 = Worst possible anxiety)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 6,
          type: 'vas-scale',
          label: 'Drowsiness (0 = Not drowsy, 10 = Worst possible drowsiness)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 7,
          type: 'vas-scale',
          label: 'Appetite (0 = Best appetite, 10 = Worst possible appetite)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 8,
          type: 'vas-scale',
          label: 'Well-being (0 = Best well-being, 10 = Worst possible well-being)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 9,
          type: 'vas-scale',
          label: 'Shortness of Breath (0 = No shortness of breath, 10 = Worst possible)',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 10,
          type: 'vas-scale',
          label: 'Other Problem (0 = Not present, 10 = Worst possible)',
          config: {
            required: false,
            min: 0,
            max: 10,
            step: 1
          }
        }
      ]
    },
    {
      id: 10,
      name: 'EQ-5D-5L (Quality of Life)',
      category: 'Clinical Scales',
      description: 'EuroQol 5-dimension 5-level quality of life assessment with standardized responses',
      fields: 6,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        {
          id: 1,
          type: 'radio',
          label: 'Mobility',
          config: {
            required: true,
            options: [
              { value: 1, label: 'I have no problems in walking about' },
              { value: 2, label: 'I have slight problems in walking about' },
              { value: 3, label: 'I have moderate problems in walking about' },
              { value: 4, label: 'I have severe problems in walking about' },
              { value: 5, label: 'I am unable to walk about' }
            ]
          }
        },
        {
          id: 2,
          type: 'radio',
          label: 'Self-Care',
          config: {
            required: true,
            options: [
              { value: 1, label: 'I have no problems washing or dressing myself' },
              { value: 2, label: 'I have slight problems washing or dressing myself' },
              { value: 3, label: 'I have moderate problems washing or dressing myself' },
              { value: 4, label: 'I have severe problems washing or dressing myself' },
              { value: 5, label: 'I am unable to wash or dress myself' }
            ]
          }
        },
        {
          id: 3,
          type: 'radio',
          label: 'Usual Activities',
          config: {
            required: true,
            options: [
              { value: 1, label: 'I have no problems doing my usual activities' },
              { value: 2, label: 'I have slight problems doing my usual activities' },
              { value: 3, label: 'I have moderate problems doing my usual activities' },
              { value: 4, label: 'I have severe problems doing my usual activities' },
              { value: 5, label: 'I am unable to do my usual activities' }
            ]
          }
        },
        {
          id: 4,
          type: 'radio',
          label: 'Pain / Discomfort',
          config: {
            required: true,
            options: [
              { value: 1, label: 'I have no pain or discomfort' },
              { value: 2, label: 'I have slight pain or discomfort' },
              { value: 3, label: 'I have moderate pain or discomfort' },
              { value: 4, label: 'I have severe pain or discomfort' },
              { value: 5, label: 'I have extreme pain or discomfort' }
            ]
          }
        },
        {
          id: 5,
          type: 'radio',
          label: 'Anxiety / Depression',
          config: {
            required: true,
            options: [
              { value: 1, label: 'I am not anxious or depressed' },
              { value: 2, label: 'I am slightly anxious or depressed' },
              { value: 3, label: 'I am moderately anxious or depressed' },
              { value: 4, label: 'I am severely anxious or depressed' },
              { value: 5, label: 'I am extremely anxious or depressed' }
            ]
          }
        },
        {
          id: 6,
          type: 'vas-scale',
          label: 'Overall Health Today (0 = Worst health, 100 = Best health)',
          config: {
            required: true,
            min: 0,
            max: 100,
            step: 1
          }
        }
      ]
    },
    {
      id: 11,
      name: 'Brief Pain Inventory (BPI)',
      category: 'Clinical Scales',
      description: 'Comprehensive pain assessment with severity and interference scales (0-10)',
      fields: 11,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        {
          id: 1,
          type: 'vas-scale',
          label: 'Pain at its WORST in last 24 hours',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 2,
          type: 'vas-scale',
          label: 'Pain at its LEAST in last 24 hours',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 3,
          type: 'vas-scale',
          label: 'Pain on AVERAGE',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 4,
          type: 'vas-scale',
          label: 'Pain RIGHT NOW',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 5,
          type: 'vas-scale',
          label: 'Interference with General Activity',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 6,
          type: 'vas-scale',
          label: 'Interference with Mood',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 7,
          type: 'vas-scale',
          label: 'Interference with Walking Ability',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 8,
          type: 'vas-scale',
          label: 'Interference with Normal Work',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 9,
          type: 'vas-scale',
          label: 'Interference with Relations with Others',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 10,
          type: 'vas-scale',
          label: 'Interference with Sleep',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        },
        {
          id: 11,
          type: 'vas-scale',
          label: 'Interference with Enjoyment of Life',
          config: {
            required: true,
            min: 0,
            max: 10,
            step: 1
          }
        }
      ]
    },
    {
      id: 12,
      name: 'FACT-G (Functional Assessment Cancer Therapy)',
      category: 'Clinical Scales',
      description: 'General cancer quality of life assessment with 4 well-being domains',
      fields: 27,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        { id: 1, type: 'radio', label: 'Physical - I have a lack of energy', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 2, type: 'radio', label: 'Physical - I have nausea', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 3, type: 'radio', label: 'Physical - I have trouble meeting needs of family', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 4, type: 'radio', label: 'Physical - I have pain', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 5, type: 'radio', label: 'Physical - I am bothered by side effects of treatment', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 6, type: 'radio', label: 'Physical - I feel ill', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 7, type: 'radio', label: 'Physical - I am forced to spend time in bed', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 8, type: 'radio', label: 'Social - I feel close to my friends', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 9, type: 'radio', label: 'Social - I get emotional support from family', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 10, type: 'radio', label: 'Social - I get support from friends', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 11, type: 'radio', label: 'Social - My family accepted my illness', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 12, type: 'radio', label: 'Social - I am satisfied with family communication', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 13, type: 'radio', label: 'Social - I feel close to my partner', config: { required: false, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 14, type: 'radio', label: 'Social - My sex life is satisfying', config: { required: false, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 15, type: 'radio', label: 'Emotional - I feel sad', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 16, type: 'radio', label: 'Emotional - I am satisfied with how I am coping', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 17, type: 'radio', label: 'Emotional - I am losing hope in the fight against illness', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 18, type: 'radio', label: 'Emotional - I feel nervous', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 19, type: 'radio', label: 'Emotional - I worry about dying', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 20, type: 'radio', label: 'Emotional - I worry condition will get worse', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 21, type: 'radio', label: 'Functional - I am able to work', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 22, type: 'radio', label: 'Functional - My work is fulfilling', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 23, type: 'radio', label: 'Functional - I am able to enjoy life', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 24, type: 'radio', label: 'Functional - I have accepted my illness', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 25, type: 'radio', label: 'Functional - I am sleeping well', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 26, type: 'radio', label: 'Functional - I am enjoying things I usually do for fun', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } },
        { id: 27, type: 'radio', label: 'Functional - I am content with quality of life', config: { required: true, options: [{ value: 0, label: 'Not at all' }, { value: 1, label: 'A little bit' }, { value: 2, label: 'Somewhat' }, { value: 3, label: 'Quite a bit' }, { value: 4, label: 'Very much' }] } }
      ]
    },
    {
      id: 13,
      name: 'WOMAC (Osteoarthritis Index)',
      category: 'Clinical Scales',
      description: 'Western Ontario McMaster Osteoarthritis Index for knee and hip assessment',
      fields: 24,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        { id: 1, type: 'radio', label: 'Pain - Walking', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 2, type: 'radio', label: 'Pain - Stairs', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 3, type: 'radio', label: 'Pain - At night in bed', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 4, type: 'radio', label: 'Pain - Sitting or lying', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 5, type: 'radio', label: 'Pain - Standing upright', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 6, type: 'radio', label: 'Stiffness - Morning stiffness', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 7, type: 'radio', label: 'Stiffness - After sitting/lying/resting', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 8, type: 'radio', label: 'Function - Descending stairs', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 9, type: 'radio', label: 'Function - Ascending stairs', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 10, type: 'radio', label: 'Function - Rising from sitting', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 11, type: 'radio', label: 'Function - Standing', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 12, type: 'radio', label: 'Function - Bending to floor', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 13, type: 'radio', label: 'Function - Walking on flat surface', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 14, type: 'radio', label: 'Function - Getting in/out of car', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 15, type: 'radio', label: 'Function - Going shopping', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 16, type: 'radio', label: 'Function - Putting on socks', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 17, type: 'radio', label: 'Function - Rising from bed', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 18, type: 'radio', label: 'Function - Taking off socks', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 19, type: 'radio', label: 'Function - Lying in bed', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 20, type: 'radio', label: 'Function - Getting in/out of bath', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 21, type: 'radio', label: 'Function - Sitting', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 22, type: 'radio', label: 'Function - Getting on/off toilet', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 23, type: 'radio', label: 'Function - Heavy household duties', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } },
        { id: 24, type: 'radio', label: 'Function - Light household duties', config: { required: true, options: [{ value: 0, label: 'None' }, { value: 1, label: 'Mild' }, { value: 2, label: 'Moderate' }, { value: 3, label: 'Severe' }, { value: 4, label: 'Extreme' }] } }
      ]
    },
    {
      id: 14,
      name: 'MADRS (Montgomery-Asberg Depression)',
      category: 'Clinical Scales',
      description: 'Clinician-rated depression assessment with 10 items scored 0-6',
      fields: 10,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        { id: 1, type: 'radio', label: '1. Apparent Sadness', config: { required: true, options: [{ value: 0, label: 'No sadness' }, { value: 2, label: 'Looks dispirited but brightens' }, { value: 4, label: 'Appears sad and unhappy most of time' }, { value: 6, label: 'Looks miserable all the time' }] } },
        { id: 2, type: 'radio', label: '2. Reported Sadness', config: { required: true, options: [{ value: 0, label: 'Occasional sadness' }, { value: 2, label: 'Sad or low but brightens' }, { value: 4, label: 'Pervasive feelings of sadness' }, { value: 6, label: 'Continuous helpless and despairing' }] } },
        { id: 3, type: 'radio', label: '3. Inner Tension', config: { required: true, options: [{ value: 0, label: 'Placid, inner calm' }, { value: 2, label: 'Occasional tension and irritability' }, { value: 4, label: 'Continuous tension and panic' }, { value: 6, label: 'Unrelenting dread or anguish' }] } },
        { id: 4, type: 'radio', label: '4. Reduced Sleep', config: { required: true, options: [{ value: 0, label: 'Sleeps as usual' }, { value: 2, label: 'Slight difficulty falling asleep' }, { value: 4, label: 'Reduced sleep by 2 hours' }, { value: 6, label: 'Less than 2-3 hours sleep' }] } },
        { id: 5, type: 'radio', label: '5. Reduced Appetite', config: { required: true, options: [{ value: 0, label: 'Normal appetite' }, { value: 2, label: 'Slightly reduced appetite' }, { value: 4, label: 'No appetite, food tasteless' }, { value: 6, label: 'Needs persuasion to eat' }] } },
        { id: 6, type: 'radio', label: '6. Concentration Difficulties', config: { required: true, options: [{ value: 0, label: 'No difficulties concentrating' }, { value: 2, label: 'Difficulties collecting thoughts' }, { value: 4, label: 'Difficulty reading or conversation' }, { value: 6, label: 'Unable to read or converse' }] } },
        { id: 7, type: 'radio', label: '7. Lassitude', config: { required: true, options: [{ value: 0, label: 'No difficulty getting started' }, { value: 2, label: 'Difficulties starting activities' }, { value: 4, label: 'Difficulties with routine' }, { value: 6, label: 'Complete lassitude' }] } },
        { id: 8, type: 'radio', label: '8. Inability to Feel', config: { required: true, options: [{ value: 0, label: 'Normal interest in surroundings' }, { value: 2, label: 'Reduced interest in surroundings' }, { value: 4, label: 'Loss of interest' }, { value: 6, label: 'Total inability to feel' }] } },
        { id: 9, type: 'radio', label: '9. Pessimistic Thoughts', config: { required: true, options: [{ value: 0, label: 'No pessimistic thoughts' }, { value: 2, label: 'Fluctuating pessimism' }, { value: 4, label: 'Persistent self-accusations' }, { value: 6, label: 'Delusions of ruin and guilt' }] } },
        { id: 10, type: 'radio', label: '10. Suicidal Thoughts', config: { required: true, options: [{ value: 0, label: 'Enjoys life' }, { value: 2, label: 'Weary of life' }, { value: 4, label: 'Wishes to be dead' }, { value: 6, label: 'Explicit suicide plans' }] } }
      ]
    },
    {
      id: 15,
      name: 'KCCQ (Kansas City Cardiomyopathy)',
      category: 'Clinical Scales',
      description: 'Heart failure health status questionnaire with 23 items',
      fields: 23,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        { id: 1, type: 'radio', label: 'Heart failure limits showering/bathing', config: { required: true, options: [{ value: 1, label: 'Extremely limited' }, { value: 2, label: 'Quite a bit limited' }, { value: 3, label: 'Moderately limited' }, { value: 4, label: 'Slightly limited' }, { value: 5, label: 'Not at all limited' }, { value: 6, label: 'Limited for other reasons' }] } },
        { id: 2, type: 'radio', label: 'Heart failure limits walking 1 block', config: { required: true, options: [{ value: 1, label: 'Extremely limited' }, { value: 2, label: 'Quite a bit limited' }, { value: 3, label: 'Moderately limited' }, { value: 4, label: 'Slightly limited' }, { value: 5, label: 'Not at all limited' }, { value: 6, label: 'Limited for other reasons' }] } },
        { id: 3, type: 'radio', label: 'Heart failure limits hurrying/jogging', config: { required: true, options: [{ value: 1, label: 'Extremely limited' }, { value: 2, label: 'Quite a bit limited' }, { value: 3, label: 'Moderately limited' }, { value: 4, label: 'Slightly limited' }, { value: 5, label: 'Not at all limited' }, { value: 6, label: 'Limited for other reasons' }] } },
        { id: 4, type: 'radio', label: 'Heart failure limits hobbies/recreation', config: { required: true, options: [{ value: 1, label: 'Extremely limited' }, { value: 2, label: 'Quite a bit limited' }, { value: 3, label: 'Moderately limited' }, { value: 4, label: 'Slightly limited' }, { value: 5, label: 'Not at all limited' }, { value: 6, label: 'Limited for other reasons' }] } },
        { id: 5, type: 'radio', label: 'Heart failure limits working/household chores', config: { required: true, options: [{ value: 1, label: 'Extremely limited' }, { value: 2, label: 'Quite a bit limited' }, { value: 3, label: 'Moderately limited' }, { value: 4, label: 'Slightly limited' }, { value: 5, label: 'Not at all limited' }, { value: 6, label: 'Limited for other reasons' }] } },
        { id: 6, type: 'radio', label: 'Heart failure limits visiting family/friends', config: { required: true, options: [{ value: 1, label: 'Extremely limited' }, { value: 2, label: 'Quite a bit limited' }, { value: 3, label: 'Moderately limited' }, { value: 4, label: 'Slightly limited' }, { value: 5, label: 'Not at all limited' }, { value: 6, label: 'Limited for other reasons' }] } },
        { id: 7, type: 'radio', label: 'Swelling in feet/ankles/legs (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'Severely bothersome' }, { value: 2, label: 'Quite a bit' }, { value: 3, label: 'Moderately' }, { value: 4, label: 'Slightly' }, { value: 5, label: 'Not at all' }, { value: 6, label: 'Did not have' }] } },
        { id: 8, type: 'radio', label: 'Fatigue (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'Severely bothersome' }, { value: 2, label: 'Quite a bit' }, { value: 3, label: 'Moderately' }, { value: 4, label: 'Slightly' }, { value: 5, label: 'Not at all' }, { value: 6, label: 'Did not have' }] } },
        { id: 9, type: 'radio', label: 'Shortness of breath (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'Severely bothersome' }, { value: 2, label: 'Quite a bit' }, { value: 3, label: 'Moderately' }, { value: 4, label: 'Slightly' }, { value: 5, label: 'Not at all' }, { value: 6, label: 'Did not have' }] } },
        { id: 10, type: 'radio', label: 'Need to rest during the day (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'All the time' }, { value: 2, label: 'Several times per day' }, { value: 3, label: 'At least once a day' }, { value: 4, label: '3 or more times a week' }, { value: 5, label: '1-2 times a week' }, { value: 6, label: 'Never' }] } },
        { id: 11, type: 'radio', label: 'Shortness of breath lying flat (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'Every night' }, { value: 2, label: '3 or more times a week' }, { value: 3, label: '1-2 times a week' }, { value: 4, label: 'Less than once a week' }, { value: 5, label: 'Never' }] } },
        { id: 12, type: 'radio', label: 'Shortness of breath on waking (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'Every morning' }, { value: 2, label: '3 or more times a week' }, { value: 3, label: '1-2 times a week' }, { value: 4, label: 'Less than once a week' }, { value: 5, label: 'Never' }] } },
        { id: 13, type: 'radio', label: 'Frequency of heart failure symptoms', config: { required: true, options: [{ value: 1, label: 'All the time' }, { value: 2, label: 'Several times per day' }, { value: 3, label: 'At least once a day' }, { value: 4, label: '3 or more times a week' }, { value: 5, label: '1-2 times a week' }, { value: 6, label: 'Never' }] } },
        { id: 14, type: 'radio', label: 'How much does HF affect lifestyle', config: { required: true, options: [{ value: 1, label: 'Severely restricted' }, { value: 2, label: 'Restricted quite a bit' }, { value: 3, label: 'Moderately restricted' }, { value: 4, label: 'Slightly restricted' }, { value: 5, label: 'Not at all' }] } },
        { id: 15, type: 'radio', label: 'If symptoms worsened, would you know', config: { required: true, options: [{ value: 1, label: 'I would not know' }, { value: 2, label: 'Probably not know' }, { value: 3, label: 'Probably know' }, { value: 4, label: 'Definitely know' }, { value: 5, label: 'Does not apply' }] } },
        { id: 16, type: 'radio', label: 'If symptoms worsened, what would you do', config: { required: true, options: [{ value: 1, label: 'Would not know what to do' }, { value: 2, label: 'Probably not know' }, { value: 3, label: 'Probably know' }, { value: 4, label: 'Definitely know' }, { value: 5, label: 'Does not apply' }] } },
        { id: 17, type: 'radio', label: 'Understanding of things you can do', config: { required: true, options: [{ value: 1, label: 'Do not understand' }, { value: 2, label: 'Do not understand most' }, { value: 3, label: 'Understand most' }, { value: 4, label: 'Completely understand' }, { value: 5, label: 'Does not apply' }] } },
        { id: 18, type: 'radio', label: 'Felt discouraged/down (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'All the time' }, { value: 2, label: 'Most of the time' }, { value: 3, label: 'Some of the time' }, { value: 4, label: 'Rarely' }, { value: 5, label: 'Never' }] } },
        { id: 19, type: 'radio', label: 'Felt burden on family/friends (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'All the time' }, { value: 2, label: 'Most of the time' }, { value: 3, label: 'Some of the time' }, { value: 4, label: 'Rarely' }, { value: 5, label: 'Never' }] } },
        { id: 20, type: 'radio', label: 'Felt loss of control (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'All the time' }, { value: 2, label: 'Most of the time' }, { value: 3, label: 'Some of the time' }, { value: 4, label: 'Rarely' }, { value: 5, label: 'Never' }] } },
        { id: 21, type: 'radio', label: 'HF concerns or worries (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'All the time' }, { value: 2, label: 'Most of the time' }, { value: 3, label: 'Some of the time' }, { value: 4, label: 'Rarely' }, { value: 5, label: 'Never' }] } },
        { id: 22, type: 'radio', label: 'Side effects from medications (past 2 weeks)', config: { required: true, options: [{ value: 1, label: 'All the time' }, { value: 2, label: 'Most of the time' }, { value: 3, label: 'Some of the time' }, { value: 4, label: 'Rarely' }, { value: 5, label: 'Never' }, { value: 6, label: 'No medications' }] } },
        { id: 23, type: 'radio', label: 'How would you rate health today', config: { required: true, options: [{ value: 0, label: 'Poor' }, { value: 25, label: 'Fair' }, { value: 50, label: 'Good' }, { value: 75, label: 'Very Good' }, { value: 100, label: 'Excellent' }] } }
      ]
    },
    {
      id: 16,
      name: 'PedsQL (Pediatric Quality of Life)',
      category: 'Clinical Scales',
      description: 'Generic pediatric QoL scale for ages 5-18 with physical/emotional/social/school functioning',
      fields: 23,
      lastUsed: 'Never',
      usageCount: 0,
      components: [
        { id: 1, type: 'radio', label: 'Physical - Walking more than one block', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 2, type: 'radio', label: 'Physical - Running', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 3, type: 'radio', label: 'Physical - Participating in sports', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 4, type: 'radio', label: 'Physical - Lifting something heavy', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 5, type: 'radio', label: 'Physical - Taking a bath/shower', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 6, type: 'radio', label: 'Physical - Doing chores', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 7, type: 'radio', label: 'Physical - Hurting or aching', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 8, type: 'radio', label: 'Physical - Low energy', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 9, type: 'radio', label: 'Emotional - Feeling afraid or scared', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 10, type: 'radio', label: 'Emotional - Feeling sad or blue', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 11, type: 'radio', label: 'Emotional - Feeling angry', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 12, type: 'radio', label: 'Emotional - Trouble sleeping', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 13, type: 'radio', label: 'Emotional - Worrying about what will happen', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 14, type: 'radio', label: 'Social - Getting along with other children', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 15, type: 'radio', label: 'Social - Other kids not wanting to be friends', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 16, type: 'radio', label: 'Social - Getting teased', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 17, type: 'radio', label: 'Social - Not able to do things other children do', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 18, type: 'radio', label: 'Social - Hard to keep up when playing', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 19, type: 'radio', label: 'School - Paying attention in class', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 20, type: 'radio', label: 'School - Forgetting things', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 21, type: 'radio', label: 'School - Keeping up with schoolwork', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 22, type: 'radio', label: 'School - Missing school because not feeling well', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } },
        { id: 23, type: 'radio', label: 'School - Missing school for doctor visits', config: { required: true, options: [{ value: 0, label: 'Never a problem' }, { value: 1, label: 'Almost never' }, { value: 2, label: 'Sometimes' }, { value: 3, label: 'Often' }, { value: 4, label: 'Almost always' }] } }
      ]
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showUseTemplate, setShowUseTemplate] = useState(false)
  const [showCreateTemplate, setShowCreateTemplate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedStudy, setSelectedStudy] = useState('')

  const categories = ['All', 'Standard', 'Medical', 'Safety', 'Assessment', 'Clinical Scales']

  // Load studies from localStorage
  useEffect(() => {
    const loadStudies = () => {
      try {
        const savedStudies = localStorage.getItem('studies')
        if (savedStudies) {
          const parsedStudies = JSON.parse(savedStudies)
          // Transform studies to have the format needed for dropdown
          const transformedStudies = parsedStudies.map(study => ({
            id: study.id,
            name: study.name,
            code: study.code || study.protocolId || 'N/A'
          }))
          setStudies(transformedStudies)
        }
      } catch (error) {
        console.error('Error loading studies:', error)
        setStudies([])
      }
    }

    loadStudies()
  }, [])

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Standard':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Medical':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Safety':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'Assessment':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Clinical Scales':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handlePreview = (template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template)
    setShowUseTemplate(true)
  }

  const confirmUseTemplate = () => {
    if (!selectedStudy) {
      toast.error('Please select a study')
      return
    }

    // Update usage count
    setTemplates(templates.map(t =>
      t.id === selectedTemplate.id
        ? { ...t, usageCount: t.usageCount + 1, lastUsed: 'Just now' }
        : t
    ))

    // Save form to study
    const formData = {
      id: Date.now(),
      name: selectedTemplate.name,
      version: 'V1.0',
      lastModified: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      modifiedBy: 'Study Designer',
      components: selectedTemplate.components
    }

    const savedForms = localStorage.getItem(`study-${selectedStudy}-forms`)
    let allForms = savedForms ? JSON.parse(savedForms) : []
    allForms.push(formData)
    localStorage.setItem(`study-${selectedStudy}-forms`, JSON.stringify(allForms))

    toast.success(`Template "${selectedTemplate.name}" added to ${studies.find(s => s.id === parseInt(selectedStudy))?.name}!`)
    setShowUseTemplate(false)
    setSelectedStudy('')
  }

  const handleCreateTemplate = () => {
    setShowCreateTemplate(true)
  }

  const saveNewTemplate = (templateData) => {
    const newTemplate = {
      id: templates.length + 1,
      ...templateData,
      lastUsed: 'Just now',
      usageCount: 0,
      fields: templateData.components?.length || 0
    }
    setTemplates([...templates, newTemplate])
    setShowCreateTemplate(false)
    toast.success('Template created successfully!')
  }

  const handleArchiveTemplate = async (templateId) => {
    const template = templates.find(t => t.id === templateId)
    const isArchived = template?.archived || false
    const action = isArchived ? 'unarchive' : 'archive'

    const confirmed = await dialog.confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Template`,
      message: `Are you sure you want to ${action} this template?`,
      confirmText: `${action.charAt(0).toUpperCase() + action.slice(1)} Template`,
      cancelText: 'Cancel',
      variant: 'warning',
      icon: 'question'
    })

    if (confirmed) {
      setTemplates(templates.map(t =>
        t.id === templateId ? { ...t, archived: !isArchived } : t
      ))
      toast.success(`Template ${isArchived ? 'unarchived' : 'archived'} successfully`)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Form Library</h1>
              <p className="text-sm text-gray-500 mt-1">
                Browse and use form templates from the library
              </p>
            </div>
            <button
              onClick={handleCreateTemplate}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Template
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category}
                {category !== 'All' && (
                  <span className="ml-2 text-xs">
                    ({templates.filter(t => t.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Template Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(
                        template.category
                      )}`}
                    >
                      {template.category}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{template.fields} fields</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Used {template.lastUsed}</span>
                  </div>
                </div>

                {/* Usage Count */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Times used</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {template.usageCount}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => handlePreview(template)}
                    className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg transition-colors"
                    title="Preview"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleArchiveTemplate(template.id)}
                    className={`py-2 px-3 ${
                      template.archived
                        ? 'bg-green-50 hover:bg-green-100 text-green-600'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                    } text-sm font-medium rounded-lg transition-colors`}
                    title={template.archived ? 'Unarchive' : 'Archive'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {template.archived ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No templates found
              </h3>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Try selecting a different category'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedTemplate.name}</h2>
                <p className="text-sm text-orange-100 mt-0.5">{selectedTemplate.category} Template</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <p className="text-sm text-gray-600 mb-6">{selectedTemplate.description}</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Template Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Fields:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedTemplate.fields}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Times Used:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedTemplate.usageCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Used:</span>
                    <span className="ml-2 font-medium text-gray-900">{selectedTemplate.lastUsed}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(selectedTemplate.category)}`}>
                      {selectedTemplate.category}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Form Fields ({selectedTemplate.components.length})</h3>
                <div className="space-y-2">
                  {selectedTemplate.components.map((component, index) => (
                    <div key={component.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-xs font-semibold text-orange-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {component.label}
                          {component.config?.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                        <div className="text-xs text-gray-500">Type: {component.type}</div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-white rounded border border-gray-200">
                        {component.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreview(false)
                  handleUseTemplate(selectedTemplate)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Template Modal */}
      {showUseTemplate && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Use Template</h2>
              <p className="text-sm text-gray-500 mt-1">Select a study to add this form template</p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template: <span className="font-bold text-orange-600">{selectedTemplate.name}</span>
              </label>

              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                Select Study <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedStudy}
                onChange={(e) => setSelectedStudy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Choose a study...</option>
                {studies.map((study) => (
                  <option key={study.id} value={study.id}>
                    {study.name} ({study.code})
                  </option>
                ))}
              </select>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  This will create a new form in the selected study using this template. You can customize it later.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUseTemplate(false)
                  setSelectedStudy('')
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUseTemplate}
                disabled={!selectedStudy}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add to Study
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateTemplate && (
        <CreateTemplateModal
          onSave={saveNewTemplate}
          onClose={() => setShowCreateTemplate(false)}
        />
      )}
    </div>
  )
}

// Create Template Modal Component
const CreateTemplateModal = ({ onSave, onClose }) => {
  const [templateData, setTemplateData] = useState({
    name: '',
    category: 'Standard',
    description: '',
    components: []
  })

  const handleSubmit = () => {
    if (!templateData.name || !templateData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    onSave(templateData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Template</h2>
          <p className="text-sm text-gray-500 mt-1">Create a reusable form template</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={templateData.name}
              onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
              placeholder="e.g., Patient Screening Form"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={templateData.category}
              onChange={(e) => setTemplateData({ ...templateData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Standard">Standard</option>
              <option value="Medical">Medical</option>
              <option value="Safety">Safety</option>
              <option value="Assessment">Assessment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={templateData.description}
              onChange={(e) => setTemplateData({ ...templateData, description: e.target.value })}
              placeholder="Describe what this template is for..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              You can add form fields after creating the template in the Form Builder.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
          >
            Create Template
          </button>
        </div>
      </div>
    </div>
  )
}

export default Library
