const operationalPlanning = {
  title: 'Operational planning for Medicare Advantage and Part D models',
  lastUpdatedDate: '2026-03-11',
  description:
    'This article contains information to assist in planning the pre-implementation and the operational tasks for models that test changes to the Part D Prescription Drug Program and/or the Part C Medicare Advantage program.',
  mintHelp:
    'If you have any questions or concerns about the content of this article, please contact the MINT Team at <email>MINTTeam@cms.hhs.gov</email>.',
  accordionHelp:
    'Click to expand each accordion to reveal more information about each topic.',
  accordionTitles: [
    'Model application and participant selection: General tasks related to CMS plan bid and enrollment',
    'Model application and participant selection: Applications and bid reviews',
    'Participant agreement: CMS contract addendum',
    'Internal and external communication about the model',
    'Determine IT system needs for plan bid functionality, enrollment data, other data',
    'Determine IT system needs for plan payment',
    'Operations for each performance year of the model'
  ],
  accordionItems: {
    item1: {
      title:
        'Model application and participant selection: General tasks related to CMS plan bid and enrollment',
      content: {
        paragraphs: [
          {
            text: 'As part of the annual bidding cycle, PDP sponsors are required to include various design elements in the development of the upcoming contract year bid. The model elements may need to be included in the design elements.'
          },
          {
            text: 'CMS reviews proposals and (where necessary) and negotiates with plans.'
          },
          {
            text: 'Include in the model schedule the date that the MA or MAPD plan bids are due since model team may need to access and review Plan bids. This date is the first Monday of June each year.'
          },
          {
            text: 'Also, the Plan Benefit Package (PBP) software and Health Plan Management System (HPMS) Modules updates begin in July and August prior to upcoming bid year.'
          },
          {
            text: 'The Medicare Part C and D Annual Calendar is released on <link1>HPMS home page</link1>.'
          }
        ],
        paragraphLinks: {
          link1: { href: 'https://hpms.cms.gov/app/ng/home/' }
        },
        resources: [
          {
            copy: 'BSG guidance document - Understanding Systems and Processes',
            href: 'https://share.cms.gov/center/CMMI-BSG/DADD/Welcome%20to%20DADD/Understanding%20Processes%20and%20Systems.aspx',
            external: true
          },
          {
            copy: 'Medicare and Medicaid Plan Applications and Annual Requirements site',
            href: 'https://www.cms.gov/Medicare-Medicaid-Coordination/Medicare-and-Medicaid-Coordination/Medicare-Medicaid-Coordination-Office/FinancialAlignmentInitiative/MMPInformationandGuidance/MMPApplicationandAnnualRequirements',
            external: true
          }
        ]
      }
    },
    item2: {
      title:
        'Model application and participant selection: Applications and bid reviews',
      content: {
        paragraphs: [
          {
            text: 'As the Plans should have enough time to apply to the model and provide bids between the release of the RFA and complete by the first Monday of June, the timing of when applications are released and when they are due back in should be carefully planned with the bid cycle milestones in mind.'
          },
          {
            text: 'Also of equal importance is the time needed for the model teams’ technical review panel to review the applications. The Part C or D model participants can be selected and provisionally accepted into the model in time for the Plan to prepare bids and meet CMS bid milestones. It is suggested that the model review and provisional approval is completed in March or April timeframe'
          },
          {
            text: 'When bids are involved in the RFA, there could be a need for actuarial help desk support when the RFA is released and while Plans are filling out their applications, in the event there are questions.'
          },
          {
            text: 'After the Plans are provisionally approved for the model, their bids updated and submitted by the first Monday in June per CMS milestone deadlines, a review will be needed in June and July to compare the bids that were provided in the RFA to the bids submitted in early June to verify the bid to the Plans’ RFA responses.'
          },
          {
            text: 'Lastly, each year the Model Lead signs off in the HPMS system that the Plans have been finally approved to participate in that performance year’s (PY20XX model). There may be job codes required for this ability to sign off. This signoff occurs in August.'
          }
        ]
      }
    },
    item3: {
      title: 'Participant agreement: CMS contract addendum',
      content: {
        paragraphs: [
          {
            text: 'For Participatory models, the model participant agreement is in the form of a contract addendum. This addendum is a provided annually for each performance year of the model. The addendum is to the Plans Part C or D contract (an MA Organization or a Prescription Drug Plan Sponsor (PDP Sponsor) with CMS.'
          },
          {
            text: 'The model schedule should include the milestone task and date when MA or MAPD contracts signed each year, as a contract addendum for the model is a part of that overall contract package.'
          },
          {
            text: 'The annual contract addendum must also go through clearance, and if waivers are involved, check with the Waiver team for their review. This waiver team review may take several weeks.'
          },
          {
            text: 'The model lead provides the cleared annual contract addendum to the HPMS team to include as part of the HPMS system Electronic Contracting module for signatures. In the past, this addendum is due to the HPMS team by the end of May of each year, and there is a specific timeline for it. The CMS point of contact (POC) for the HPMS Electronic Contracting Module is Daniel Summers, with Greg Buglio as backup (CM/MDBG/DPD).'
          },
          {
            text: 'Senior CMMI leadership electronically signs in HPMS in late September when the upcoming year’s contracts fully executed (signed by both parties: Part C/Part D Sponsor and CMS). It is advised that the signature access and functionality are tested out in late August or early September to ensure the process goes smoothly.'
          }
        ],
        resources: [
          {
            copy: 'CMMI Waiver Resources',
            href: 'https://share.cms.gov/center/CMMI/PP/Model%20Design%20Resources/Forms/AllItems.aspx?RootFolder=%2fcenter%2fCMMI%2fPP%2fModel%20Design%20Resources%2fWaiver%20Resources&FolderCTID=0x012000FCFBB5BE40CCB14E843A9A9806F74598',
            external: true
          }
        ]
      }
    },
    item4: {
      title: 'Internal and external communication about the model',
      content: {
        paragraphs: [
          {
            text: 'For new models, the team should plan on announcing the model as soon as feasible to allow potential model participants, namely plan sponsors, adequate time to review the design parameters and decide on participation before bids are due in June of each year. HPMS system is used for announcements, and for the release of the RFA.'
          },
          {
            text: 'In addition, one of the main communication vehicles would be to include model information and/or other information in the Advance Call letter in January each year, and the Rate and Policy Announcement and Final Call Letter in April each year.'
          },
          {
            text: 'As the model team includes the tasks to meet the call letter deadlines each year, the tasks may also require clearance of language.'
          },
          {
            text: 'The model team may need to include information within the Medicare Plan Finder tool. This tool contains plan and drug benefit data on the Medicare.gov website. Timing for the release of this tool has been early October each year.'
          },
          {
            text: 'The model team should look into the need to update HPMS guidance materials.'
          }
        ],
        resources: [
          {
            copy: 'MDBG DPDP SharePoint site - 2020 Call Letter documents',
            href: 'https://share.cms.gov/center/CM/MDBG/DPDP/2020%20Call%20Letter/Forms/AllItems.aspx',
            external: true
          },
          {
            copy: 'MDB DPDP SharePoint site to Part D Model Docs  to see examples',
            href: 'https://share.cms.gov/center/CM/MDBG/DPDP/Part%20D%20Model%20Docs/Forms/AllItems.aspx',
            external: true
          },
          {
            copy: 'Medicare Plan Finder link',
            href: 'https://www.medicare.gov/plan-compare/#/?lang=en&year=2021',
            external: true
          },
          {
            copy: 'CMS.gov Internet Only Manuals',
            href: 'https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/Internet-Only-Manuals-IOMs',
            external: true
          },
          {
            copy: 'CMS Managed Care Eligibility and Enrollment',
            href: 'https://www.cms.gov/Medicare/Eligibility-and-Enrollment/MedicareMangCareEligEnrol',
            external: true
          }
        ]
      }
    },
    item5: {
      title:
        'Determine IT system needs for plan bid functionality, enrollment data, other data',
      content: {
        paragraphs: [
          {
            text: 'The Medicare Enrollment and Payment Systems (MEPS):',
            orderedList: false,
            list: [
              {
                text: 'MEPS is a suite of systems for MAPD. MEPS includes MARx, DDPS, PRS, DBS, EDB, MDB, RASS, TPS. The system descriptions are available on the MEPS SharePoint site landing page.'
              },
              {
                text: 'As an example, Medicare Advantage Part D System (MARx) is the primary interface for plan sponsors and the source of Part C and D beneficiary enrollment.'
              },
              {
                text: 'Change requests for these systems are channeled through MEPS.'
              }
            ]
          },
          {
            text: 'For Plan bids, the main system is the Health Plan Management System (HPMS). Note that the model team will need access to certain HPMS modules in time to review bids. The team may also need to have training in HPMS Bid Desk Review module. This module provides the functionality to approve the model bids electronically.'
          },
          {
            text: 'Historically, several HPMS modules have been used on models, and may need to be considered for future Part C and D models. Those are:',
            orderedList: true,
            list: [
              {
                text: 'Plan Benefit Package PBP module- Used by plan organizations to define the details of their plan benefit packages.',
                subList: ['Andrew Chu is the point of contact']
              },
              { text: 'Bid Pricing Tool (BPT)' },
              { text: 'Bid Desk Review (BDR)' },
              { text: 'Formulary' },
              { text: 'Electronic Contracting' },
              { text: 'Actuarial Certification' },
              { text: 'Complaint Tracking' },
              { text: 'Marketing' }
            ]
          },
          {
            text: 'The model team should plan for submitting (via CR) any requirements, testing and the final production release. The Model team may be part of the requirements sessions along with other CMS system stakeholders and also participate in user acceptance testing (UAT)'
          },
          {
            text: 'There may be requirements resulting in change requests for MARx enrollment, such as a flag field to designate a Plan is part of a model.'
          },
          {
            text: 'The Part C & D Star Ratings are published on Medicare.gov (Fall of each year). These ratings may be part of Plans’ quality data needed for evaluation or model implementation.'
          },
          {
            text: 'The model team members or contractors may require access to Encounter data in the IDR for use in monitoring efforts of the model.'
          },
          {
            text: 'The CMS Integrated Data Repository (IDR) has a SharePoint page with many references, and also has an IDR BI user group that meets regularly. Information on the user group can be found on the SharePoint page.'
          }
        ],
        resources: [
          {
            copy: 'Medicare Enrollment and Payment Systems (MEPS) SharePoint site',
            href: 'https://share.cms.gov/cms-wide/Systems/MEPS/SitePages/LandingPage.aspx',
            external: true
          },
          {
            copy: 'CMS website - HPMS',
            href: 'https://www.cms.gov/Research-Statistics-Data-and-Systems/Computer-Data-and-Systems/HPMS/Overview',
            external: true
          },
          {
            copy: 'MAPD Plan Communications User Guide -Using MARx',
            href: 'https://www.cms.gov/Research-Statistics-Data-and-Systems/CMS-Information-Technology/mapdhelpdesk/MAPD-MARx-Calendars-and-Schedules',
            external: true
          },
          {
            copy: 'BSG DADD Reference CMS-Wide Processes document',
            href: 'https://share.cms.gov/center/CMMI-BSG/DADD/Reference%20Information/Docs%20for%20Info%20Packet/CMS-Wide%20Processes.docx?d=w5fb09d1112024e2084d9f31d071848b9',
            external: true
          },
          {
            copy: 'CMS-wide systems SharePoint home page',
            href: 'https://share.cms.gov/cms-wide/Systems/SitePages/LandingPage.aspx',
            external: true
          },
          {
            copy: 'CMS-wide Systems IDR SharePoint home page',
            href: 'https://share.cms.gov/cms-wide/Systems/IDR/SitePages/OldHome.aspx',
            external: true
          },
          {
            copy: 'Integrated Data Repository (IDR) SharePoint site',
            href: 'https://share.cms.gov/cms-wide/Systems/IDR/SitePages/Home.aspx',
            external: true
          }
        ]
      }
    },
    item6: {
      title: 'Determine IT system needs for plan payment',
      content: {
        paragraphs: [
          {
            text: 'For those models that are adjusting the MAPD payments for their models, the two main systems for Plan Payment are MARx and APPS.',
            orderedList: false,
            list: [
              {
                text: 'MARx to enroll and pay plans'
              },
              {
                text: 'APPS (automated plan payment system) processes MARx payments to MAPD plans'
              }
            ]
          },
          {
            text: 'MARx is under the MEPS suite of systems. For APPS, the CM system owner is the Medicare Plan Payment Group (MPPG), Division of Payment Operations (DPO).'
          }
        ]
      }
    },
    item7: {
      title: 'Operations for each performance year of the model',
      content: {
        paragraphs: [
          {
            text: 'Several of the processes that were done before the model goes live and described above are repeated annually. Those processes include:',
            orderedList: false,
            list: [
              { text: 'Update external communications (call letter)' },
              {
                text: 'Provide new or updated requirements to various HPMS module teams'
              },
              {
                text: 'The applications and application review, bid review, formulary review'
              }
            ]
          }
        ]
      }
    }
  }
};

export default operationalPlanning;
