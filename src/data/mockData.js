export const mockDocuments = [
  {
    id: 'doc-renewable-energy',
    title: 'Renewable Energy Outlook',
    fileName: 'renewable-energy-outlook.pdf',
    uploadedAt: 'Today',
    status: 'Indexed',
    size: '4.8 MB',
    pages: 32,
    category: 'Research',
    summary:
      'The report compares solar, wind, and battery storage trends, with emphasis on grid-scale deployment and policy incentives.',
    keyPoints: [
      'Solar installation costs fell across three major regions.',
      'Battery storage is the fastest-growing supporting technology.',
      'Policy certainty has the strongest effect on project financing.',
    ],
    fields: {
      Author: 'Energy Futures Lab',
      Period: '2026 outlook',
      Regions: 'US, EU, APAC',
      Confidence: '94%',
    },
  },
  {
    id: 'doc-product-specs',
    title: 'Product Specs V2',
    fileName: 'Product_Specs_v2.pdf',
    uploadedAt: 'Yesterday',
    status: 'Indexed',
    size: '2.4 MB',
    pages: 18,
    category: 'Product',
    summary:
      'A concise product specification covering architecture, battery targets, materials, and launch readiness risks.',
    keyPoints: [
      'Processor target is Quantum Core i9.',
      'Battery life target is 24 hours.',
      'The industrial design weighs 1.2kg.',
    ],
    fields: {
      Processor: 'Quantum Core i9',
      'Battery Life': '24 hours',
      Weight: '1.2kg',
      Confidence: '91%',
    },
  },
  {
    id: 'doc-contract',
    title: 'Vendor Contract Review',
    fileName: 'vendor-contract-review.pdf',
    uploadedAt: 'Sep 18',
    status: 'Needs review',
    size: '1.7 MB',
    pages: 14,
    category: 'Legal',
    summary:
      'The contract defines support obligations, renewal terms, data handling requirements, and termination language.',
    keyPoints: [
      'Renewal clause requires 45 days notice.',
      'Support SLA is stated at 99.5% uptime.',
      'Data processing language needs legal review.',
    ],
    fields: {
      Vendor: 'Northstar Systems',
      Renewal: 'Annual',
      Notice: '45 days',
      Confidence: '87%',
    },
  },
]

export const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Hello. I am ready to answer questions, summarize sections, and cite the source pages from your selected document.',
    sources: [],
    createdAt: 'Just now',
  },
  {
    id: 'user-question',
    role: 'user',
    content: 'What are the most important findings?',
    createdAt: '12:15 PM',
  },
  {
    id: 'assistant-answer',
    role: 'assistant',
    content:
      'The strongest findings are the growth of storage-backed renewable projects, the continued decline in deployment costs, and the role of stable incentives in accelerating adoption.',
    sources: [
      { page: 4, label: 'Market adoption' },
      { page: 11, label: 'Cost trend chart' },
    ],
    createdAt: '12:15 PM',
  },
]
