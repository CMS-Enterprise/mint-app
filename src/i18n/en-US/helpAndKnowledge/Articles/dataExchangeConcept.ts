const dataExchangeConcept = {
  title: 'Evaluating data exchange concepts',
  description:
    'Exchanging data with our participants is an essential component of model operations. We collect data across a few use cases such as quality and clinical reporting. We also share data back with participants to provide tools and information to enable model success (e.g., analytics or claims data). The following is a framework for evaluating the data exchange components of new models in the context of new policy or technology opportunities.',
  alert:
    'We recommend thinking about how data will be exchanged early in the model design process. These considerations should also be mentioned in your 2-page concept paper.',
  footerSummaryBox: {
    title: 'Need help with your data exchange concept?',
    body:
      'Contact William Gordon at <email1>william.gordon@cms.hhs.gov</email1> or the MINT team at <email2>MINTTeam@cms.hhs.gov</email2>.'
  },
  table: {
    headingRow: ['Category and description', 'Example answer'],
    rows: [
      'background',
      'realism',
      'participantBurden',
      'cmmiImpacts',
      'policyContext',
      'relevantEfforts',
      'additionalItems'
    ],
    background: {
      category: 'Background',
      description:
        'Provide a high-level overview of the data exchange concept in the model design.',
      exampleAnswer:
        'TEFCA is a ONC-led policy initiative to create an operating and technical framework for national health data exchange'
    },
    realism: {
      category: 'Realism',
      description:
        'Is the model’s data exchange concept realistic and feasible given the current state of health IT standards, technology availability, and vendor capability?',
      exampleAnswer:
        'TEFCA is not yet operational, though the initial QHINs have been announced; since it is voluntary, it remains to be seen what uptake will look like once it becomes operational in 2024.'
    },
    participantBurden: {
      category: 'Participant burden',
      description:
        '<bullet>How well does the data exchange concept align with health IT standards vs. creating custom requirements?</bullet><bullet>What is the impact on workload, time, and resources for the model participant and healthcare providers?</bullet><bullet>What is the financial impact on participants?</bullet>',
      exampleAnswer:
        'Participating in TEFCA will be done through Qualified Health Information Networks (QHINs), which will likely take place through existing provider EHR vendors, though we anticipate that provider organizations will still need to invest some resources in participating in TEFCA, especially early on.'
    },
    cmmiImpacts: {
      category: 'CMMI impacts',
      description:
        '<p>How does the data exchange concept impact CMMI?</p><bullet>Do we have the technology capability to support the data exchange?</bullet><bullet>How does the data exchange concept impact model operations?</bullet><bullet>What is the level of effort required to implement, manage, and sustain the data exchange concept?</bullet><bullet>What are the initial and ongoing CMS costs?</bullet>',
      exampleAnswer:
        'Requiring participation in TEFCA will necessitate a moderate effort from CMMI. The voluntary nature of TEFCA means CMMI will need to measure and ensure compliance and evaluate performance.  Participating with a QHIN will likely incur cost, though it is unclear how much and this will relate to existing HIE costs in different regions'
    },
    policyContext: {
      category: 'Policy context',
      description:
        'How does this concept fit into the current policy landscape and priorities?',
      exampleAnswer:
        'It is unclear how TEFCA will relate to existing services like HIEs or national networks; for example, will HIEs become QHINs or participate in TEFCA through a QHIN.ONC is pushing TEFCA forward and it is a HHS priority as evidenced by rule-making and public events.'
    },
    relevantEfforts: {
      category: 'Relevant CMS/CMMI efforts',
      description:
        '<bullet>Does the model’s data exchange concept align with HHS/CMS direction?</bullet><bullet>Will other models use similar concepts?</bullet>',
      exampleAnswer:
        'CMS OBRHI is leading most discussions around TEFCA and how it relates to CMS, both from a program perspective (e.g., it is now voluntary under MIPS), as well as directly participating (should CMS participate in a QHIN to facilitate data sharing)'
    },
    additionalItems: {
      category: 'Additional items to consider',
      description:
        '<bullet>Equity implications</bullet><bullet>Industry/external usage and uptake</bullet>'
    }
  }
};

export default dataExchangeConcept;
