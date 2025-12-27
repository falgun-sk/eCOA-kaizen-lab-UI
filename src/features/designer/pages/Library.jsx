import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
      alert('Please select a study')
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

    alert(`Template "${selectedTemplate.name}" added to ${studies.find(s => s.id === parseInt(selectedStudy))?.name}!`)
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
    alert('Template created successfully!')
  }

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId))
      alert('Template deleted successfully')
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
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      alert('Please fill in all required fields')
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
