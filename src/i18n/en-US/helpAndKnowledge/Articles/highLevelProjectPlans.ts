const highLevelProjectPlans = {
  title: 'High-level project plan',
  description:
    'Use this high-level project plan to understand and track the key pieces of work involved in developing a model. The MINT Team can assist model teams in completing this for upcoming models once collaboration begins.',
  downloadExcel: 'Download project plan as an Excel file',
  accordionHelp:
    'Click to expand each accordion to reveal more information about each phase within the project plan.',
  accordionItems: {
    copy: {
      legal: 'These activities may not apply to all models.',
      cmmi: {
        href: 'https://share.cms.gov/center/CMMI/Clearances/SitePages/Home.aspx',
        copy: 'Learn more about CMMI Internal Clearance on SharePoint'
      },
      documents: {
        copy: 'Documents listed may not apply to all models. However, all documents in this section will go through CMMI Internal Clearance, CMS Clearance, Health and Human Services (HHS) Clearance, and Office of Management and Budget (OMB) Clearance. ',
        link: {
          href: 'https://share.cms.gov/center/CMMI/Clearances/SitePages/Home.aspx',
          copy: 'Learn more about Clearance on SharePoint'
        }
      }
    },
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
            '<paragraph>Contractor support prior to clearance</paragraph><italics> We recommend discussing pre- clearance contractor support needs during your 2-pager or 6-pager review with the CMMI Front Office (FO), as CMMI FO will need to approve this request.</italics>',
          party:
            'ARDS (available through BSG/DCCS), MITRE (available through PPG)'
        },
        {
          activity: '2-pager review with CMMI FO',
          party: 'Model Team'
        },
        {
          activity: 'Conduct kick-off meeting',
          party: 'MINT Team'
        },
        {
          activity: '6-pager review with CMMI FO',
          party: 'Model Team'
        },
        {
          activity: 'Perform iterative analysis of IT plans',
          party: 'IT Lead, Model Team, MINT Team'
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
          href: 'https://share.cms.gov/center/cmmi/PP/DSEP/Lists/AnnouncementsAndRollouts/Tiles.aspx',
          party:
            'Model Team, Front Office, PPG Division of Stakeholder Engagement and Policy (DSEP), Office of Communications (OC)'
        }
      ],
      legal: [
        {
          activity: 'Fraud, Waste, Abuse Waivers',
          link: 'Learn more about Fraud, Waste, Abuse Waivers on SharePoint',
          href: 'https://share.cms.gov/center/cmmi/PP/Model%20Design%20Resources/Forms/AllItems.aspx?RootFolder=%2Fcenter%2Fcmmi%2FPP%2FModel%20Design%20Resources%2FModel%20Agreement%20and%20Rule%20Resources%2FTemplate%20Participation%20Agreement%2FWaiver%20Resources&FolderCTID=0x012000A975146B83F0F045969E1B4CCF269310&View=%7B05D9040E%2DF2A4%2D4351%2D8D9E%2D2F0DBF3CD595%7D',
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
          modalLinks: [
            {
              copy: '<ml>RMADA</ml>',
              route: 'research-measurement-assessment-design-and-analysis'
            }
          ]
        },
        {
          activity: 'Recruit participants',
          modalLinks: [
            {
              copy: '<ml>GrantSolutions</ml>',
              route: 'grant-solutions'
            },
            {
              copy: '<ml>CMS Qualtrics</ml>',
              route: 'cms-qualtrics'
            },
            {
              copy: '<ml>Salesforce LOI</ml>',
              route: 'salesforce-letter-of-intent'
            },
            {
              copy: '<ml>Salesforce RFA</ml>',
              route: 'salesforce-request-for-application'
            }
          ]
        },
        {
          activity: 'Review and score applications',
          modalLinks: [
            {
              copy: '<ml>GrantSolutions</ml>',
              route: 'grant-solutions'
            },
            {
              copy: '<ml>Salesforce ARS</ml>',
              route: 'salesforce-application-review-and-scoring'
            }
          ]
        },
        {
          activity: 'Establish a benchmark with participants',
          modalLinks: [
            {
              copy: '<ml>CCW</ml>',
              route: 'chronic-conditions-warehouse'
            },
            {
              copy: '<ml>IDR</ml>',
              route: 'integrated-data-repository'
            }
          ]
        },
        {
          activity: 'Provide participant access to model platforms',
          party: 'Innovation Center (IC) Landing Page'
        },
        {
          activity: 'Communicate with participants',
          modalLinks: [
            {
              copy: '<ml>Outlook Mailbox</ml>',
              route: 'outlook-mailbox'
            },
            {
              copy: '<ml>GovDelivery</ml>',
              route: 'gov-delivery'
            },
            {
              copy: '<ml>Salesforce POST</ml>',
              route: 'salesforce-project-officer-support-tool-portal'
            }
          ]
        },
        {
          activity: 'Vet providers for program integrity',
          modalLinks: [
            {
              copy: '<ml>CPI Vetting</ml>',
              route: 'cpi-vetting'
            }
          ]
        },
        {
          activity: 'Sign participation agreements',
          modalLinks: [
            {
              copy: '<ml>4i</ml>, through a contractor',
              route: '4-innovation'
            }
          ]
        },
        {
          activity:
            'Manage Part C/D enrollment <italics>(MAPD models only)</italics>',
          modalLinks: [
            {
              copy: '<ml>MARx</ml>',
              route: 'medicare-advantage-prescription-drug-system'
            }
          ]
        },
        {
          activity:
            'Review and collect plan bids <italics>(MAPD models only)</italics>',
          modalLinks: [
            {
              copy: '<ml>HPMS</ml>',
              route: 'health-plan-management-system'
            }
          ]
        },
        {
          activity:
            'Update the plan’s contract <italics>(MAPD models only)</italics>',
          modalLinks: [
            {
              copy: '<ml>HPMS</ml>',
              route: 'health-plan-management-system'
            }
          ]
        },
        {
          activity: 'Helpdesk support',
          modalLinks: [
            {
              copy: '<ml>CBOSC</ml>, through a contractor',
              route: 'consolidated-business-operations-support-center'
            }
          ]
        },
        {
          activity:
            'Develop methodologies for providers and beneficiaries as needed',
          party: 'Implementation contractor'
        },
        {
          activity: 'Manage provider overlaps',
          modalLinks: [
            {
              copy: '<ml>MDM-POR</ml>',
              route: 'master-data-management-program-organization-relationship'
            }
          ]
        },
        {
          activity: 'Manage beneficiary overlaps',
          modalLinks: [
            {
              copy: '<ml>MDM-POR</ml>',
              route: 'master-data-management-program-organization-relationship'
            }
          ]
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
          activity:
            'Utilize quality measures development contractor <italics>(if new measure development is necessary)</italics>',
          modalLinks: [
            {
              copy: '<ml>Quality Vertical</ml>',
              route: 'quality-vertical'
            }
          ]
        },
        {
          activity: 'Collect quality measures data',
          modalLinks: [
            {
              copy: 'CCSQ contracts and systems, <ml>HDR</ml>, Patient Activation Measure (PAM)',
              route: 'health-data-reporting'
            }
          ]
        },
        {
          activity:
            'Innovative Design, Development, and Operations Contract (IDDOC) support',
          modalLinks: [
            {
              copy: '<ml>4i</ml>',
              route: '4-innovation'
            },
            {
              copy: 'ACO-OS',
              route: 'accountable-care-organization'
            }
          ]
        },
        {
          activity: 'Claims-based measures',
          modalLinks: [
            {
              copy: '<ml>CCW</ml>',
              route: 'chronic-conditions-warehouse'
            },
            {
              copy: '<ml>IDR</ml>',
              route: 'integrated-data-repository'
            }
          ]
        },
        {
          activity: 'Quality performance scores',
          modalLinks: [
            {
              copy: 'Existing CMS data and process, <ml>HDR</ml>, other new process',
              route: 'health-data-reporting'
            }
          ]
        },
        {
          activity: 'Data to monitor the model',
          modalLinks: [
            {
              copy: '<ml>CCW</ml>',
              route: 'chronic-conditions-warehouse'
            },
            {
              copy: '<ml>CDX</ml>',
              route: 'centralized-data-exchange'
            },
            {
              copy: '<ml>HDR</ml>',
              route: 'health-data-reporting'
            },
            {
              copy: '<ml>IDR</ml>',
              route: 'integrated-data-repository'
            },
            {
              copy: '<ml>Salesforce POST</ml>',
              route: 'salesforce-project-officer-support-tool-portal'
            }
          ]
        },
        {
          activity: 'Data to support model evaluation',
          modalLinks: [
            {
              copy: '<ml>CCW</ml>',
              route: 'chronic-conditions-warehouse'
            },
            {
              copy: '<ml>CDX</ml>',
              route: 'centralized-data-exchange'
            },
            {
              copy: '<ml>HDR</ml>',
              route: 'health-data-reporting'
            },
            {
              copy: '<ml>Salesforce POST</ml>',
              route: 'salesforce-project-officer-support-tool-portal'
            }
          ]
        },
        {
          activity: 'Send reports/data to participants',
          modalLinks: [
            {
              copy: '<ml>4i</ml>',
              route: '4-innovation'
            },
            {
              copy: '<ml>BCDA</ml>',
              route: 'beneficiary-claims-data-api'
            },
            {
              copy: '<ml>CDX</ml>',
              route: 'centralized-data-exchange'
            },
            {
              copy: '<ml>CMS Box</ml>',
              route: 'cms-box'
            },
            {
              copy: '<ml>eDFR</ml>',
              route: 'expanded-data-feedback-reporting'
            },
            {
              copy: '<ml>EFT</ml>',
              route: 'electronic-file-transfer'
            },
            {
              copy: '<ml>RMADA</ml>',
              route: 'research-measurement-assessment-design-and-analysis'
            },
            {
              copy: '<ml>Salesforce POST</ml>',
              route: 'salesforce-project-officer-support-tool-portal'
            },
            {
              copy: 'internal staff',
              route: ''
            }
          ]
        },
        {
          activity: 'Participate in CMMI data sharing',
          party: 'CMMI Analysis & Management System (AMS)'
        },
        {
          activity: 'Process participant appeals',
          modalLinks: [
            {
              copy: '<ml>Legal Vertical</ml>',
              route: 'legal-vertical'
            }
          ]
        }
      ],
      payment: [
        {
          activity: 'Adjust how FFS claims are paid',
          modalLinks: [
            {
              copy: '<ml>Shared Systems </ml> / CR',
              route: 'shared-systems'
            },
            {
              copy: '<ml>HIGLAS</ml>',
              route: 'healthcare-integrated-general-kedger-accounting-system'
            }
          ]
        },
        {
          activity: 'Manage FFS excluded payments',
          modalLinks: [
            {
              copy: '<ml>Shared Systems </ml> / CR',
              route: 'shared-systems'
            }
          ]
        },
        { activity: 'MAPD payments', party: 'MAPD Systems / CR' },
        {
          activity: 'Make non-claims based payments',
          modalLinks: [
            {
              copy: '<ml>APPS</ml>',
              route: 'automated-plan-payment-system'
            },
            {
              copy: '<ml>HIGLAS</ml>',
              route: 'healthcare-integrated-general-kedger-accounting-system'
            },
            {
              copy: '<ml>IPC</ml>',
              route: 'innovation-payment-contract'
            },
            {
              copy: '<ml>MDM-NCBP</ml>',
              route: 'master-data-management-for-ncbp'
            }
          ]
        },
        {
          activity: 'Compute shared savings payments',
          modalLinks: [
            {
              copy: '<ml>RMADA</ml>',
              route: 'research-measurement-assessment-design-and-analysis'
            }
          ]
        },
        {
          activity: 'Recover payments',
          modalLinks: [
            {
              copy: '<ml>APPS</ml>',
              route: 'automated-plan-payment-system'
            },
            {
              copy: '<ml>IPC</ml>',
              route: 'innovation-payment-contract'
            },
            {
              copy: '<ml>Shared Systems </ml>',
              route: 'shared-systems'
            }
          ]
        }
      ],
      'learning-&-diffusion': [
        {
          activity: 'Develop a learning strategy',
          modalLinks: [
            {
              copy: '<ml>LDG</ml>',
              route: 'learning-and-diffusion-group'
            }
          ]
        },
        {
          activity: 'Educate beneficiaries',
          modalLinks: [
            {
              copy: '<ml>LDG</ml>',
              route: 'learning-and-diffusion-group'
            }
          ]
        },
        {
          activity: 'Acquire a learning contractor',
          modalLinks: [
            {
              copy: '<ml>RMADA</ml>, a cross-model contract',
              route: 'research-measurement-assessment-design-and-analysis'
            }
          ]
        },
        {
          activity: 'IT platform for learning',
          modalLinks: [
            {
              copy: '<ml>Salesforce CONNECT</ml>',
              route: 'salesforce-connect'
            }
          ]
        },
        {
          activity: 'Participant-to-participant collaboration',
          modalLinks: [
            {
              copy: '<ml>Salesforce CONNECT</ml>',
              route: 'salesforce-connect'
            }
          ]
        }
      ],
      evaluation: [
        {
          activity: 'Acquire an evaluation contractor',
          modalLinks: [
            {
              copy: '<ml>RMADA</ml>',
              route: 'research-measurement-assessment-design-and-analysis'
            }
          ]
        },
        {
          activity: 'Obtain data access for evaluation contractor',
          modalLinks: [
            {
              copy: '<ml>CCW</ml>',
              route: 'chronic-conditions-warehouse'
            }
          ]
        }
      ]
    }
  }
};

export default highLevelProjectPlans;
