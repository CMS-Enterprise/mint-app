const evaluatingDataExchangeApproach = {
  title: 'Evaluate your data exchange approach',
  heading: 'Evaluate your data exchange approach',
  description:
    'Exchanging data is an essential component of model operations and can take many forms depending on policy goals, implementation needs, and participants in the model. Examples of data that are typically exchanged include CMS sharing data with participants (for example, claims data) or participants sharing quality data (for example, a new measure or patient-reported outcome). We often collect health-related social needs data, such as socio-demographic data. Some models may have more complex needs or could be avenues to explore broader HHS policy initiatives around data exchange.',
  alert:
    'After your 6-page concept paper has been approved, we recommend working with your IT Lead or Solution Architect (or reach out to the MINT Team if one still needs to be assigned) to determine how you’ll exchange data. These considerations should also be included in your ICIP.',
  downloadPDF: 'Download this article as a PDF',
  table: {
    headers: ['Category', 'Additional details and examples'],
    rows: [
      {
        id: '1',
        category: {
          header: 'Data collection',
          description: 'What data will you collect from participants?'
        },
        additionalDetails: {
          header: 'Types of data can include:',
          list: [
            'Banking information to make non-claims-based payments',
            'Clinical data',
            'Collect bids and plan information (MAPD)',
            'Cooperative Agreement Application',
            'Decarbonization data',
            'Expanded demographics data',
            'Fee-for-Service (FFS) claims and apply model rules (e.g., reduce FFS payment)',
            'Learning system metrics (e.g., # of learning events)',
            'Participant Agreement',
            'Participant Agreement Letter of Intent',
            'Participant Agreement Request for Application',
            'Participant reported data (e.g., unique model metrics)',
            'Participant reported quality measures',
            'Provider roster / participant roster',
            'Reports from participants (e.g., health equity report)',
            'Social Determinants of Health',
            'Survey',
            'Other'
          ]
        }
      },
      {
        id: '2',
        category: {
          header: 'Sending data',
          description: 'What data will you send to participants?'
        },
        additionalDetails: {
          header: 'Types of data can include:',
          list: [
            'Data feedback dashboard',
            'Non-claims based payments',
            'Operations data (e.g., attribution file, benchmark file)',
            'Partially adjudicated claims data',
            'Raw claims data'
          ]
        }
      },
      {
        id: '3',
        category: {
          header: 'Multi-payer data',
          description:
            'Do you need to make multi-payer data available to participants?'
        },
        additionalDetails: {
          header: 'Use cases can include:',
          list: [
            'More complete alert/discharge/transfer notification',
            'Supply multi-payer claims cost, utilization, and quality reporting',
            'Fill gaps in care alerting and reports'
          ]
        }
      },
      {
        id: '4',
        category: {
          header: 'Multi-source collection and aggregation',
          description:
            'Do you need to collect and aggregate multi-source data for analyses by the model team and implementation contractor?'
        },
        additionalDetails: {
          header: 'Types of data can include:',
          list: [
            'Commercial claims',
            'Lab data',
            'Manufacturer',
            'Medicaid claims',
            'Medicare claims',
            'Patient registry',
            'Other'
          ]
        }
      },
      {
        id: '5',
        category: {
          header: 'New methodologies',
          description:
            'Do you plan to implement any new or novel data exchange methods based on new technologies or policy initiatives?'
        },
        additionalDetails: {
          header: 'Examples of novel data exchange methodologies include:',
          list: [
            {
              text: '<link1>Privacy-preserving record linkage (PPRL) [cdcfoundation.org]</link1>',
              link: 'https://www.cdcfoundation.org/CDCFoundationPPRLSummary.pdf?inline'
            },
            {
              text: 'Utilizing the <link1>Trusted Exchange Framework and Common Agreement (TEFCA) [healthit.gov]</link1>',
              link: 'https://www.healthit.gov/topic/interoperability/policy/trusted-exchange-framework-and-common-agreement-tefca'
            },
            'Enabling an additional data stream not previously used at CMMI'
          ]
        }
      }
    ]
  },
  additionalConsiderations: 'Additional considerations',
  additionalConsiderationsDescription:
    'Please describe any additional data exchange considerations.'
};
export default evaluatingDataExchangeApproach;
