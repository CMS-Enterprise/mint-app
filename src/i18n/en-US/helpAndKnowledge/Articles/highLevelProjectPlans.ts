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
            'Model Team, MITRE <italics>(if this support is requested/approved by CMMI FO)</italics>'
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
      ],
      'cmmi-internal-clearance-process': [
        {
          activity:
            'Submit documents to clearance designees <italics>(CMMI Clearance form)</italics>',
          party: 'MINT Team'
        },
        {
          activity: 'Provide Model with complete CMMI clearance',
          party: 'CMMI designees and reviewers'
        },
        {
          activity:
            '<pd-left><paragraph>ICIP Budget</paragraph><italics>Model Teams will meet with CMMI FO to review the ICIP cost estimates</italics></pd-left>',
          party: '<pd-left>CMMI Deputy Director of Operations</pd-left>'
        },
        {
          activity: '<pd-left>Quality</pd-left>',
          party: '<pd-left>Supervisory Medical Officer</pd-left>'
        },
        {
          activity: '<pd-left>Financial Methodology</pd-left>',
          party: '<pd-left>Division of Data Analytics Representative</pd-left>'
        },
        {
          activity: '<pd-left>QPP Status</pd-left>',
          party: '<pd-left>QPP SME</pd-left>'
        },
        {
          activity: '<pd-left>Technology</pd-left>',
          party: '<pd-left>Chief Technology Officer or SME</pd-left>'
        },
        {
          activity: '<pd-left>Strategy</pd-left>',
          party: '<pd-left>Chief Strategy Officer</pd-left>'
        }
      ],
      'clearance-of-documents': [
        {
          activity:
            'Submit Model documents completed/signed form and model clearance package to Executive Operations Staff (EOS)',
          party: 'Model Team'
        },
        {
          activity: 'ICIP',
          party: 'Model Team and MITRE write, EOS clears'
        },
        {
          activity: 'Cooperative Agreement',
          party:
            'Legal Vertical writes, Office of the General Council (OGC) approves, EOS clears'
        },
        {
          activity: 'Participation Agreement',
          party: 'Legal Vertical writes, OGC approves, EOS clears'
        },
        {
          activity: 'Terms & Conditions',
          party: 'Legal Vertical writes, OGC approves, EOS clears'
        },
        {
          activity:
            'Notice of Proposed Rulemaking (NPRM) <italics>(mandatory models only)</italics>',
          party:
            'OGC writes, EOS clears, staff publishes, and OGC processes and responds to comments'
        },
        {
          activity: 'Final Rule <italics>(mandatory models only)</italics>',
          party: 'EOS clears, staff publishes'
        },
        {
          activity: '<paragraph>Announcement materials</paragraph>',
          link: 'Learn more about announcement materials on SharePoint',
          href:
            'https://share.cms.gov/center/cmmi/PP/DSEP/Lists/AnnouncementsAndRollouts/Tiles.aspx',
          party:
            'Model Team, Front Office, PPG Division of Stakeholder Engagement and Policy (DSEP), Office of Communications (OC)'
        }
      ],
      legal: [
        {
          activity: 'Fraud, Waste, Abuse Waivers',
          link: 'Learn more about Fraud, Waste, Abuse Waivers on SharePoint',
          href:
            'https://share.cms.gov/center/cmmi/PP/Model%20Design%20Resources/Forms/AllItems.aspx?RootFolder=%2Fcenter%2Fcmmi%2FPP%2FModel%20Design%20Resources%2FModel%20Agreement%20and%20Rule%20Resources%2FTemplate%20Participation%20Agreement%2FWaiver%20Resources&FolderCTID=0x012000A975146B83F0F045969E1B4CCF269310&View=%7B05D9040E%2DF2A4%2D4351%2D8D9E%2D2F0DBF3CD595%7D',
          party:
            'Federal Waiver Team writes, Office of Inspector General (OIG) and CM approve'
        },
        {
          activity:
            'Program/Payment Waivers <italics>(included in ICIP)</italics>',
          party: 'CMMI, OGC'
        },
        {
          activity: 'Medicaid Waivers/State Plan Amendments',
          party: 'Center for Medicaid and CHIP Services (CMCS), OGC'
        },
        {
          activity:
            'Request for Applications (RFA) or Notice of Funding Opportunity (NOFO)',
          party: 'Model Team writes, OGC approves'
        }
      ],
      participants: [
        {
          activity:
            'Obtain an application support contractor <italics>(as necessary if there are large volumes of applications)</italics>',
          party: 'RMADA'
        },
        {
          activity: 'Recruit participants',
          party: 'GrantSolutions, CMS Qualtrics, Salesforce LOI, Salesforce RFA'
        },
        {
          activity: 'Review and score applications',
          party: 'GrantSolutions, Salesforce ARS'
        },
        {
          activity: 'Establish a benchmark with participants',
          party: 'CCW, IDR'
        },
        {
          activity: 'Provide participant access to model platforms',
          party: 'Innovation Center (IC) Landing Page'
        },
        {
          activity: 'Communicate with participants',
          party: 'Outlook Mailbox, GovDelivery, Salesforce POST'
        },
        {
          activity: 'Vet providers for program integrity',
          party: 'CPI Vetting'
        },
        {
          activity: 'Sign participation agreements',
          party: '4i, through a contractor'
        },
        {
          activity:
            'Manage Part C/D enrollment <italics>(MAPD models only)</italics>',
          party: 'MARx'
        },
        {
          activity:
            'Review and collect plan bids <italics>(MAPD models only)</italics>',
          party: 'HPMS'
        },
        {
          activity:
            'Update the plan’s contract <italics>(MAPD models only)</italics>',
          party: 'HPMS'
        },
        {
          activity: 'Helpdesk support',
          party: 'CBOSC, through a contractor'
        },
        {
          activity:
            'Develop methodologies for providers and beneficiaries as needed',
          party: 'Implementation contractor'
        },
        {
          activity: 'Manage provider overlaps',
          party: 'MDM'
        },
        {
          activity: 'Manage beneficiary overlaps',
          party: 'MDM'
        }
      ],
      'model-operations': [
        {
          activity: 'Decide on contracting strategy',
          party: 'Division of Central Contracts Services (DCCS)'
        },
        {
          activity: 'Acquire implementation contractor',
          party: 'DCCS, Office of Acquisition and Grants Management (OAGM)'
        },
        {
          activity: 'Utilize quality measures development contractor',
          party: 'Quality Vertical'
        },
        {
          activity: 'Collect quality measures data',
          party:
            'CCSQ contracts and systems, HDR, Patient Activation Measure (PAM)'
        },
        {
          activity:
            'Innovative Design, Development, and Operations Contract (IDDOC) support',
          party: '4i, ACO-OS'
        },
        { activity: 'Claims-based measures', party: 'CCW, IDR' },
        {
          activity: 'Quality performance scores',
          party: 'Existing CMS data and process, HDR, other new process'
        },
        {
          activity: 'Data to monitor the model',
          party: 'CCW, CDX, HDR, IDR, Salesforce POST, another contractor'
        },
        {
          activity: 'Data to support model evaluation',
          party: 'CCW, CDX, HDR, Salesforce POST'
        },
        {
          activity: 'Send reports/data to participants',
          party:
            '4i, BCDA, CDX, CMS Box, eDFR, EFT, RMADA, Salesforce POST, internal staff'
        },
        {
          activity: 'Participate in CMMI data sharing',
          party: 'CMMI Analysis & Management System (AMS)'
        },
        { activity: 'Process participant appeals', party: 'Legal Vertical' }
      ],
      payment: [
        {
          activity: 'Adjust how FFS claims are paid',
          party: 'Shared Systems / CR, HIGLAS'
        },
        {
          activity: 'Manage FFS excluded payments',
          party: 'Shared Systems / CR'
        },
        { activity: 'MAPD payments', party: 'MAPD Systems / CR' },
        {
          activity: 'Make non-claims based payment',
          party: 'APPS, HIGLAS, IPC'
        },
        { activity: 'Compute shared savings payment', party: 'RMADA' },
        { activity: 'Recover payments', party: 'APPS, IPC, Shared Systems' }
      ],
      'learning-&-diffusion': [
        { activity: 'Develop a learning strategy', party: 'LDG' },
        { activity: 'Educate beneficiaries', party: 'LDG' },
        {
          activity: 'Acquire a learning contractor',
          party: 'RMADA, a cross-model contract'
        },
        { activity: 'IT platform for learning', party: 'Salesforce CONNECT' },
        {
          activity: 'Participant-to-participant collaboration',
          party: 'Salesforce CONNECT'
        }
      ],
      evaluation: [
        { activity: 'Acquire an evaluation contractor', party: 'RMADA' },
        {
          activity: 'Obtain data access for evaluation contractor',
          party: 'CCW'
        }
      ]
    }
  }
};

export default highLevelProjectPlans;
