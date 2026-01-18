import { DeploymentVerificationData, ValidationSection } from '../types'

export const useMockDeploymentData = (): DeploymentVerificationData => {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false })
  const today = new Date()

  const sections: ValidationSection[] = [
    {
      id: 'build-artifact',
      title: 'Build & Artifact Integrity',
      status: 'passed',
      checks: [
        { label: 'Build hash verified', status: 'passed' },
        { label: 'Signed artifact OK', status: 'passed' },
        { label: 'Version valid', status: 'passed' }
      ],
      canExpand: true,
      expandLabel: '( View details )'
    },
    {
      id: 'env-config',
      title: 'Environment & Config Sanity',
      status: 'passed',
      checks: [
        { label: 'Env = PROD', status: 'passed' },
        { label: 'Secrets from vault', status: 'passed' },
        { label: 'Flags valid', status: 'passed' }
      ],
      canExpand: true,
      expandLabel: '( Snapshot )'
    },
    {
      id: 'access-auth',
      title: 'Access & Authorization',
      status: 'passed',
      checks: [
        { label: 'Identity verified', status: 'passed' },
        { label: 'MFA validated', status: 'passed' },
        { label: 'Role authorized', status: 'passed' }
      ],
      canExpand: true,
      expandLabel: '( View audit chain )'
    },
    {
      id: 'change-scope',
      title: 'Change Scope Validation',
      status: 'passed',
      checks: [
        { label: 'Diff matches approved', status: 'passed' },
        { label: 'No schema drift', status: 'passed' }
      ],
      canExpand: true,
      expandLabel: '( View diff summary )'
    },
    {
      id: 'dependency-security',
      title: 'Dependency & Security Scan',
      status: 'warning',
      checks: [
        { label: '⚠ 1 Medium CVE detected', status: 'warning' },
        { label: 'No critical issues', status: 'passed' }
      ],
      canExpand: true,
      expandLabel: '( Review report )'
    },
    {
      id: 'database',
      title: 'Database & Data Integrity',
      status: 'passed',
      checks: [
        { label: 'Backup recent', status: 'passed' },
        { label: 'Migration validated', status: 'passed' },
        { label: 'Encryption OK', status: 'passed' }
      ]
    },
    {
      id: 'runtime-capacity',
      title: 'Runtime & Capacity',
      status: 'passed',
      checks: [
        { label: 'CPU stable', status: 'passed' },
        { label: 'Memory stable', status: 'passed' },
        { label: 'Autoscale ready', status: 'passed' }
      ]
    },
    {
      id: 'automated-testing',
      title: 'Automated Testing',
      status: 'passed',
      checks: [
        { label: 'Regression passed', status: 'passed' },
        { label: 'Smoke tests green', status: 'passed' }
      ],
      canExpand: true,
      expandLabel: '( View report )'
    },
    {
      id: 'security-controls',
      title: 'Security Controls',
      status: 'passed',
      checks: []
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Alerting',
      status: 'passed',
      checks: []
    },
    {
      id: 'compliance',
      title: 'Compliance & Traceability',
      status: 'passed',
      checks: []
    }
  ]

  return {
    metadata: {
      release: 'v3.4.2',
      target: 'Production',
      triggeredBy: 'Prathamesh',
      time: currentTime,
      deploymentId: `DEP-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`,
      traceId: `c1a-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`
    },
    stats: {
      passed: 0,
      warnings: 2,
      failed: 0,
      running: 0
    },
    progress: 0,
    sections,
    logs: [
      {
        timestamp: currentTime,
        message: 'Build OK',
        type: 'success'
      },
      {
        timestamp: currentTime,
        message: 'Signature OK',
        type: 'success'
      },
      {
        timestamp: currentTime,
        message: 'Config OK',
        type: 'success'
      },
      {
        timestamp: currentTime,
        message: 'Security WARN',
        type: 'warning'
      },
      {
        timestamp: currentTime,
        message: 'DB OK',
        type: 'success'
      },
      {
        timestamp: currentTime,
        message: 'Tests OK',
        type: 'success'
      },
      {
        timestamp: currentTime,
        message: 'Compliance OK',
        type: 'success'
      }
    ],
    warnings: ['1 Medium-severity dependency CVE'],
    isComplete: false
  }
}
