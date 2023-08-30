const highLevelProjectPlans = {
  title: 'High-level project plans',
  description:
    'Use this high-level project plan to understand and track the key pieces of work involved in developing a model. The MINT Team can assist model teams in completing this for upcoming models once collaboration begins.',
  downloadExcel: 'Download project plan as an Excel file',
  accordionHelp:
    'Click to expand each accordion to reveal more information about each phase within the project plan.',
  accordionItems: {
    titles: [
      'CMMI Model Operational Planning',
      'CMMI Internal Clearance Process',
      'Clearance of Documents',
      'Legal',
      'Participants',
      'Model Operations',
      'Payment',
      'Learning & Diffusion',
      'Evaluation'
    ],
    table: {
      header: ['Activity/function', 'Responsible party/solution'],
      'cmmi-model-operational-planning': [
        {
          activity: 'Start a Model Plan in MINT',
          party: 'Model Team'
        },
        {
          // TODO: this one is special I need to figure it out
          activity:
            '<paragraph>Contractor support prior to clearance</paragraph><italics> We recommend discussing pre- clearance contractor support needs during your 2-pager or 6-pager review with the CMMI Front Office(FO), as CMMI FO will need to approve this request.</italics>',
          party:
            'ARDS (available through BSG/DCCS), MITRE (available through PPG)'
        },
        {
          activity: '2-pager review with CMMI FO',
          party: 'Model Team'
        },
        {
          activity: 'Conduct kick-off meeting',
          party: 'Mint Team'
        },
        {
          activity: '6-pager review with CMMI FO',
          party: 'Model Team'
        },
        {
          activity: 'Perform iterative analysis of IT plans',
          party: 'Model Team, MINT Team'
        },
        {
          activity: 'Draft IT cost estimates',
          party: 'MINT Team'
        },
        {
          activity: 'Draft implementation cost estimates',
          party: 'BSG Budget Team'
        },
        {
          activity: 'Draft evaluation cost estimates',
          party: 'Evaluation'
        },
        {
          activity: 'Draft learning cost estimates',
          party: 'LDG'
        },
        {
          activity: 'Draft high-level project plan (upon request)',
          party: 'MINT Team'
        },
        {
          activity: 'Draft Innovation Center Investment Proposal (ICIP)',
          party:
            'Model Team, MITRE (if this support is requested/approved by CMMI FO)'
        },
        {
          activity:
            'Collect/review and distribute deliverables to model team, SMEs, and stakeholders',
          party: 'MINT Team'
        },
        {
          activity:
            'Deliver final version of all BSG deliverables to model team, SMEs, and stakeholders',
          party: 'MINT Team'
        }
      ]
    }
  }
};

export default highLevelProjectPlans;
