const dataExchangeApproach = {
  title: 'Evaluating your data exchange approach',
  description:
    'Exchanging data between CMS and model participants is an essential component of model operations. Sharing data with participants (such as claims data) provides a comprehensive view of a beneficiary, and collecting data can enable improved evaluation, drive our learning work, and enable participants to transform their care delivery processes.',
  alert:
    'We recommend thinking about how data will be exchanged after your 6-page concept paper has been approved. These considerations should also be included in your ICIP.',
  footerSummaryBox: {
    title: 'Need help with your data exchange approach?',
    body:
      'Contact William Gordon at <email1>william.gordon@cms.hhs.gov</email1> or Todd Couts at <email2>todd.couts1@cms.hhs.gov</email2>.'
  },
  table: {
    headingRow: ['Category', 'Additional details and things to consider'],
    rows: [
      'background',
      'newMethodologies',
      'realism',
      'participantBurden',
      'cmmiImpacts',
      'additionalConsiderations'
    ],
    background: {
      category: 'Background',
      description:
        'Provide a high-level overview of how you anticipate exchanging data with model participants.',
      exampleAnswer:
        'Examples of data exchange include sharing claims data through secure files, dashboards, and Application Programming Interfaces (APIs). \n \nData collection might include collecting model-specific quality measures or beneficiary-level sociodemographic data, including age, gender, race, and socioeconomic status, to enhance data comprehensiveness and support better evaluation and decision-making.'
    },
    newMethodologies: {
      category: 'New methodologies',
      description:
        'Do you plan to implement any new or novel data exchange methods based on new technologies or policy Initiatives?',
      exampleAnswer:
        '<p>Examples of novel data exchange methodologies include:</p><bullet>Privacy-preserving record linkage.</bullet><bullet>Utilizing the Trusted Exchange Framework and Common Agreement (TEFCA).</bullet><bullet>Enabling an additional data stream not previously used at CMMI.</bullet>'
    },
    realism: {
      category: 'Realism',
      description:
        'Is the model’s data exchange approach realistic and feasible given the current state of health IT standards, technology availability, and vendor capability?',
      exampleAnswer:
        'Please include any details on feasibility given prior CMMI model data exchange experience or other context.'
    },
    participantBurden: {
      category: 'Participant burden',
      description:
        'Please describe the participant burden anticipated as a result of these data exchange requirements.',
      exampleAnswer:
        '<bullet>How well does the data exchange approach align with health IT standards vs. creating custom requirements?</bullet><bullet>What is the impact on workload, time, and resources for the model participant and healthcare providers?</bullet><bullet>How complex will collecting and reporting these data be for model participants?</bullet>'
    },
    cmmiImpacts: {
      category: 'CMMI impacts',
      description: 'How does the data exchange approach impact CMMI?',
      exampleAnswer:
        '<bullet>Do we currently have the technology capability to support the data exchange?</bullet><bullet>How does the data exchange approach impact model operations?</bullet><bullet>What is the level of effort required to implement, manage, and sustain the data exchange approach?</bullet><bullet>Are there initial and ongoing CMS costs?</bullet>'
    },
    additionalConsiderations: {
      category: 'Additional considerations',
      description: 'Please describe any additional considerations.'
    }
  }
};

export default dataExchangeApproach;
