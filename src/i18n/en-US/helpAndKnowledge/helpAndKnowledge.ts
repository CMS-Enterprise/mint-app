import {
  ArticleCategories,
  HelpArticle
} from 'features/HelpAndKnowledge/Articles';
import { AboutConfigType } from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Solutions/Generic/about';
import { TimelineConfigType } from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Solutions/Generic/timeline';
import {
  OperationalSolutionCategoryRoute,
  OperationalSolutionSubCategories
} from 'features/ModelPlan/TaskList/ITSolutions/operationalSolutionCategories';

interface SolutionModelType {
  about: AboutConfigType;
  timeline?: TimelineConfigType; // optional as some timelines are identical and are reused between solutions
}

type SolutionTType = {
  [key: string]: SolutionModelType;
};

type SolutionCategoryType = {
  header: string;
  subHeader?: string;
  description: string;
};

export const solutionCategories: Record<
  OperationalSolutionCategoryRoute,
  SolutionCategoryType
> = {
  'applications-and-participation-interaction-aco-and-kidney': {
    header: 'Applications and participant interaction',
    subHeader: '(ACO and kidney models)',
    description:
      'Learn about the solutions available for applications and participant interaction for ACO and kidney models.'
  },
  'applications-and-participation-interaction-non-aco': {
    header: 'Applications and participant interaction',
    subHeader: '(non-ACO models)',
    description:
      'Learn about the solutions available for cooperative agreement applications, participant agreement applications, and participant interaction for non-ACO models.'
  },
  'communication-tools-and-help-desk': {
    header: 'Communication tools and help desk',
    description:
      'Learn about the solutions available for communication tools and help desk.'
  },
  'contract-vehicles': {
    header: 'Contract vehicles',
    description: 'Learn about the solutions available for contract vehicles.'
  },
  data: {
    header: 'Data',
    description: 'Learn about the solutions available for data.'
  },
  learning: {
    header: 'Learning',
    description: 'Learn about the solutions available for learning.'
  },
  legal: {
    header: 'Legal',
    description: 'Learn about the solutions available for legal.'
  },
  'medicare-advantage-and-part-d': {
    header: 'Medicare Advantage and Part D',
    description:
      'Learn about the solutions available for Medicare Advantage and Part D.'
  },
  'medicare-fee-for-service': {
    header: 'Medicare Fee-for-Service',
    description:
      'Learn about the solutions available for Medicare Fee-for-Service.'
  },
  'payments-and-financials': {
    header: 'Payments and financials',
    description:
      'Learn about the solutions available for payments and financials.'
  },
  quality: {
    header: 'Quality',
    description: 'Learn about the solutions available for quality.'
  }
};

const solutionSubCategories: Record<OperationalSolutionSubCategories, string> =
  {
    [OperationalSolutionSubCategories.APPLICATIONS]: 'Applications',
    [OperationalSolutionSubCategories.COMMUNICATION_TOOLS]:
      'Communication tools',
    [OperationalSolutionSubCategories.COOPERATIVE_AGREEMENT_APPS]:
      'Cooperative agreement applications',
    [OperationalSolutionSubCategories.HELP_DESK]: 'Help desk',
    [OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS]:
      'Participant agreement applications',
    [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION]:
      'Participant interaction'
  };

const solutions: SolutionTType = {
  innovation: {
    about: {
      description:
        'The CMS Innovation Center has a growing portfolio of models that test various payment and service delivery models and aim to achieve better care for patients, smarter spending, and healthier communities. The 4Innovation (4i) is a dynamic platform for the CMS Innovation Center to onboard, support, and manage ACO and kidney models and their participants to improve the quality of care and reduce service costs. The 4i platform is built with modern scalable architecture, services, and solutions and operates in the CMS AWS Cloud enclave. The development strategy is based on a robust Human-Centered Design, User Experience Framework, and SAFe agile methodologies.',
      components: [
        {
          header: 'Product capabilities',
          items: [
            '<bold>Agreement management</bold> - Create and manage ACO/Entity data, Change Request management, Sign and manage Participation Agreements and HIPAA Disclosure Forms to access sensitive data',
            '<bold>Participant Management</bold> - Add and manage participants, Real-time feedback on Participant Medicare enrollment checks for providers.',
            '<bold>Benefits Enhancements</bold> - Add and manage Benefit Enhancements and Payment mechanisms.',
            '<bold>Contact/User Management</bold> - Invitation-based access enables users to access the system and manage users in their Entities, elect a Designated Official (DO)',
            '<bold>Reports & Analytics</bold> - View and download real-time reports related to agreements, participants, users’ access, and change requests for APM Entities',
            '<bold>Data Hub & Data Exchange</bold> - Provide secure access to sensitive data such as claims and beneficiary reports,',
            '<bold>Knowledge Library</bold> - Publish and manage model and system content (FAQs/Documents/ Articles/ Events/Webinars)',
            '<bold>Provider Overlap Check</bold> - Allow entities to check the provider overlap within and across the models and resolve the overlap errors before submitting the records.',
            '<bold>Beneficiary Overlap Check</bold> - Beneficiary overlap check across the models',
            '<bold>Beneficiary Lookup Feature</bold> - This feature will show the beneficiary alignment to Medicare Shared Savings Program, KCC, ACO REACH, VTAPM, or PCF if the beneficiary is in one of the above programs.',
            '<bold>Data Exchange with downstream systems</bold> - Entity, Provider, and beneficiary data transmission for participating APMs to CMS systems like Shared Systems (FFS SSMs, MDM, IPC, and BCDA)',
            '<bold>Claim and Claim Line Feeds (CCLF)</bold> - CCLF are a package of 12 files containing claims and beneficiary data, sent monthly to entities participating in models under CM/CMMI',
            '<bold>Identity & Access Management</bold> - Multi-factor authentication with Okta, Remote identity proofing with Experian, seamless integration with CMS IDM and EUA',
            '<bold>Application Programming Interface (API) Key Mgt</bold> - Request and manage API keys and monitor API usage statistics',
            '<bold>4i Command Line Interface (CLI) Tool</bold> - Allows authorized entities to automate the downloading of their sensitive data through a lightweight client CLI Tool using public and private API keys without having to login to the 4i/DataHub UI to retrieve files and reports.',
            '<bold>Tasks and Notifications</bold> - Show users Tasks and Notifications, the ability for users to manage and control the notifications'
          ]
        }
      ],
      ipcPortal: {
        header:
          'Is your model also making payments through the <link1>Innovation Payment Contractor (IPC)</link1>?',
        externalLink:
          '<link2>View on SharePoint what is needed to onboard Models to the IPC Portal</link2>'
      },
      links: [
        {
          link: '/help-and-knowledge/operational-solutions?page=1&solution=innovation-payment-contract&section=about',
          external: false
        },
        {
          link: 'https://share.cms.gov/center/CMMI-BSG/IPC/ResourceLibrary/IPC%20Data%20Field%20List.xlsx',
          external: true
        }
      ]
    },
    timeline: {
      description:
        'Timelines can vary depending on model team’s use of 4i and ACO-OS features. Onboarding to the 4i platform can take 10-12 weeks depending on the features and prioritization by the model teams, provided there are no major changes or customizations. Additionally, any policy or legislation changes can potentially result in a delay to the application go-live dates.',
      items: [
        {
          header: 'Inquire about using 4i/ACO-OS',
          description:
            'Send an email to <email>ACO-OIT@cms.hhs.gov</email> if interested in using 4i and ACO-OS for your model. Please also include Ashley Corbin on the email.'
        },
        {
          header: 'Meet with 4i/ACO-OS technical lead',
          description:
            'Schedule an initial meeting to share the feature catalog with the model. The 4i/ACO-OS technical lead gives a high-level overview of 4i/ACO-OS and its capabilities and features (listed on the previous tab).'
        },
        {
          header: 'Review features',
          description:
            'Review the features with the model team to understand the level of customization needed by the model for each feature. The model team confirms the features to be used in the 4i platform and ACO-OS.'
        },
        {
          header: 'Requirements meetings',
          description:
            'Schedule recurring requirements meetings with the new model team to discuss current and future feature requirements needs, identify Minimal Viable Product (MVP) for the initial go-live.'
        },
        {
          header: 'User research sessions',
          description:
            'Conduct series of user research sessions with end users to gain more insight into the user behavior, adjust the feature designs, and improve the overall user experience and quality of users’ interaction with the 4i platform.'
        },
        {
          header: 'Coordinate with model team throughout onboarding',
          description:
            'Model teams are included in Sprint demos and User Acceptance Testing (UAT) sessions to provide early feedback.'
        },
        {
          header: 'Train helpdesk team',
          description:
            'The helpdesk team is trained on model specific features so that Tier 1 and 2 support is equipped to handle any onboarding-specific questions that may arise from new users.'
        },
        {
          header: 'Develop tip sheets',
          description:
            'Develop Tip sheets outlining step-by-step process to navigate features within the UI and conduct webinars to familiarize the end users with the 4i features.'
        },
        {
          header: 'Perform go-live activities',
          description:
            'This includes a rigorous testing process to ensure quality. The Continuous Integration/Continuous Deployment (CI/CD) framework allows the team to deploy the code in production with minimal to no disruption. Release notes are shared with the model team prior to the release.'
        },
        {
          header: 'Send out 4i registration invitations to end users',
          description:
            '4i platform includes capabilities like bulk invites and Gate windows to make the model onboarding and operations efficient and faster.'
        },
        {
          header: 'Monitor systems ',
          description:
            'Monitor the 4i and ACO-OS systems in Production and provide end user support. Post model Go-Live, model team leads continue to attend status meetings and sprint ceremonies in order to receive ongoing support and provide input into future features to be developed in the UI.'
        }
      ]
    }
  },
  accountableCare: {
    about: {
      description:
        'The Accountable Care Organization – Operational System (ACO-OS) is the system of record for ACO and kidney models (which includes VT APM, ACO REACH, KCC, PCF) and the Medicare Shared Savings Program in CM. The system stores and exchanges ACO/entity demographic, provider, claim, and beneficiary data with ACOs/entities and CMS systems such as Master Data Management (MDM), Enterprise Data Lake (EDL), and Fee-for-Service (FFS) Shared System Maintainers (SSMs). The ACO-OS generates and shares the claims data each month for over 14,000,000 Medicare beneficiaries. The claims data and reports generated by ACO-OS are shared through the Data Hub feature in the 4i platform for CMMI models and ACO-Management System (ACO-MS) for Medicare Shared Savings Program.',
      components: [
        {
          header: 'Product capabilities',
          items: [
            '<bold>Agreement management</bold> - Create and manage ACO/Entity data, Change Request management, Sign and manage Participation Agreements and HIPAA Disclosure Forms to access sensitive data',
            '<bold>Participant Management</bold> - Add and manage participants, Real-time feedback on Participant Medicare enrollment checks for providers.',
            '<bold>Benefits Enhancements</bold> - Add and manage Benefit Enhancements and Payment mechanisms.',
            '<bold>Contact/User Management</bold> - Invitation-based access enables users to access the system and manage users in their Entities, elect a Designated Official (DO)',
            '<bold>Reports & Analytics</bold> - View and download real-time reports related to agreements, participants, users’ access, and change requests for APM Entities',
            '<bold>Data Hub & Data Exchange</bold> - Provide secure access to sensitive data such as claims and beneficiary reports,',
            '<bold>Knowledge Library</bold> - Publish and manage model and system content (FAQs/Documents/ Articles/ Events/Webinars)',
            '<bold>Provider Overlap Check</bold> - Allow entities to check the provider overlap within and across the models and resolve the overlap errors before submitting the records.',
            '<bold>Beneficiary Overlap Check</bold> - Beneficiary overlap check across the models',
            '<bold>Beneficiary Lookup Feature</bold> - This feature will show the beneficiary alignment to Medicare Shared Savings Program, KCC, ACO REACH, VTAPM, or PCF if the beneficiary is in one of the above programs.',
            '<bold>Data Exchange with downstream systems</bold> - Entity, Provider, and beneficiary data transmission for participating APMs to CMS systems like Shared Systems (FFS SSMs, MDM, IPC, and BCDA)',
            '<bold>Claim and Claim Line Feeds (CCLF)</bold> - CCLF are a package of 12 files containing claims and beneficiary data, sent monthly to entities participating in models under CM/CMMI',
            '<bold>Identity & Access Management</bold> - Multi-factor authentication with Okta, Remote identity proofing with Experian, seamless integration with CMS IDM and EUA',
            '<bold>Application Programming Interface (API) Key Mgt</bold> - Request and manage API keys and monitor API usage statistics',
            '<bold>4i Command Line Interface (CLI) Tool</bold> - Allows authorized entities to automate the downloading of their sensitive data through a lightweight client CLI Tool using public and private API keys without having to login to the 4i/DataHub UI to retrieve files and reports.',
            '<bold>Tasks and Notifications</bold> - Show users Tasks and Notifications, the ability for users to manage and control the notifications'
          ]
        }
      ],
      ipcPortal: {
        header:
          'Is your model also making payments through the <link1>Innovation Payment Contractor (IPC)</link1>?',
        externalLink:
          '<link2>View on SharePoint what is needed to onboard Models to the IPC Portal</link2>'
      },
      links: [
        {
          link: '/help-and-knowledge/operational-solutions?page=1&solution=innovation-payment-contract&section=about',
          external: false
        },
        {
          link: 'https://share.cms.gov/center/CMMI-BSG/IPC/ResourceLibrary/IPC%20Data%20Field%20List.xlsx',
          external: true
        }
      ]
    }
  },
  automatedPlanPayment: {
    about: {
      description: `The Automated Plan Payment System (APPS) calculates plan level monthly payment for Medicare Advantage, Program of All-Inclusive Care for the Elderly (PACE), Medicare- Medicaid Plans, section 1876 and 1833 cost-based Managed Care Organizations, Part D Prescription Drug Sponsors, and specific CMS Demonstration initiatives. APPS facilitates payments to the US Treasury via the Health Insurance General Ledger Accounting System (HIGLAS) in the Office of Financial Management (OFM). APPS stores plan company banking information so OFM and Treasury can disperse payments through Electronic Funds Transfer (EFT).`,
      components: [
        {
          header: 'Functions',
          items: [
            'Computes plan level monthly payments to Medicare Advantage, PACE Plans Medicare- Medicaid Plans, section 1876 and 1833 cost-based Managed Care Organizations, and Part D Prescription Drug Sponsors, and specific CMS Demonstration initiatives. APPS receives plan level specific from the Health Plan Management System (HPMS) and Medicare Advantage Prescription Drug System (MARx)',
            'Receives Annual Part D reconciliation and Coverage Gap Discount payments',
            'Produces a monthly file containing plan level payments for HIGLAS',
            'Computes and stores plan level sequestration payment adjustments amounts'
          ]
        }
      ]
    },
    timeline: {
      description:
        'Timing varies based on what the model needs, but it’s best to involve APPS early in the design process. System development for any new project lasts for 6 months to 1 year, depending on the complexity of the project.',
      items: [
        {
          header: 'Reach out to Project Lead',
          description:
            'Contact Aliza Kim and Ed Howard to start a discussion about your model concept.'
        },
        {
          header: 'Collaborate with APPS',
          description:
            'Early understanding of requirements and development strategy for any new project will assist in determining if the use of APPS is feasible.'
        }
      ]
    }
  },
  bcda: {
    about: {
      description: `The Beneficiary Claims Data API (BCDA) gives organizations the insights they need to provide high quality, coordinated care. BCDA uses the FHIR® standard as a simple, flexible, and effective way for Medicare Shared Savings Program, ACO REACH, and other Alternative Payment Model participants to receive Medicare Part A, B, and D claims.`,
      components: [
        {
          header: 'Capabilities',
          items: [
            'BCDA supplements ACOs’ insight into their assigned beneficiary populations with Medicare claims data.',
            'BCDA enables ACOs to make claims data requests more often - once a week.',
            'BCDA offers Medicare claims data in a format that is aligned with a healthcare interoperability standard and the CMS interoperability rule.'
          ]
        }
      ]
    },
    timeline: {
      description:
        'If a model is already using 4innovation (4i), it’s much quicker to onboard to BCDA (a few weeks versus several months). It’s best to involve BCDA during the development process, so they can help determine if it’s right for your model.',
      items: [
        {
          header: 'Inquire about BCDA',
          description:
            'If you’re interested in using BCDA for your model or would like to learn more about the system, please contact the BCDA Team. They can give a demo and share information about the system.',
          description2:
            'Since BCDA leverages 4i, model teams are encouraged to learn more about the <0>timing and steps involved for using 4i</0>.'
        },
        {
          header: 'Get approval from CMMI leadership',
          description:
            'If after talking with the BCDA Team, you feel BCDA is right for your model, CMMI leadership will need to approve this.'
        },
        {
          header: 'Onboard to BCDA',
          description:
            'Once your model is approved to use BCDA by CMMI leadership, the BCDA Team can help guide you through the onboarding process.'
        }
      ]
    }
  },
  centralizedDataExhange: {
    about: {
      description: `Centralized Data Exchange (CDX) is a part of the <link1>Innovation Support Platform (ISP)</link1> Suite of tools for non-ACO models; it enables CMMI-to-Participant Interoperability and application integration with other CMS systems. The Centralized Data Exchange (CDX) serves as an IT capability that enables the Innovation Center (IC) models to send and receive data with internal and external model participants using Application Programming Interfaces (APIs). It provides an improved ability to send and receive ad hoc files with internal and external users that takes advantage of modern, cloud-based technologies with one centralized file exchange.

CDX is to exchange files between authorized users. This is implemented through the concept of a shared drive where authorized users can upload files and give access to those files to other authorized users. All users have a Home folder containing a list of all the files and folders to which they have access. The home folder is the Users "default/root" folder and contains all the files and folders to which the current user has access.

The business function of CDX is a centralized data exchange to enable interoperability and provide center-wide data collection capabilities across CMMI. The exchange solution supports sending the right data, at the right time, sending the right amount, and referencing the right participants.`,
      links: [
        {
          external: false,
          link: `/help-and-knowledge/operational-solutions?solution=innovation-support-platform&section=about`
        }
      ],
      components: [
        {
          header: 'Functions',
          items: [
            'Onboard participants & vendors',
            'Tap into existing data feeds',
            'Provide center-wide data collect and use the data',
            'Enable interoperability',
            'Exchange data with Application Program Interfaces (APIs)',
            'Shared Drives for secure data exchange with PII/PHI',
            'Outside vendor API testing',
            'Collects data from HDR/ virus scans/ transforms templated into FHIR format'
          ]
        },
        {
          header: 'Product capabilities',
          items: [
            'Manage API keys and tokens',
            'Basic API functions (GET, POST, PUT, DELETE)',
            'For the ET3 model: A Simple Object Access Protocol (SOAP) API with EMS Vendors',
            'For other purposes: A REST API (representational state transfer)',
            'Transform data',
            'Exchange data with Fast Healthcare Interoperable Resource (FHIR) Azure Managed Service',
            'Exchange data with EMRs, Health Exchange Networks, etc.',
            'File handling (create folder, upload file, download file)'
          ]
        }
      ]
    },
    timeline: {
      items: [
        {
          header: 'Inquire about CDX',
          description:
            'If you’re interested in using CDX for your model or would like to learn more about the system, please contact <email>MINTTeam@cms.hhs.gov</email> to learn more.'
        },
        {
          header: 'Submit an onboarding request',
          description:
            'To submit an onboarding request, you’ll need to do the following steps:',
          ordered: true,
          items: [
            'Register as New User in the <link1>CMS Enterprise Portal</link1>',
            'Submit Privileged User Role Request for IC',
            'Submit Role Request for CDX'
          ]
        },
        {
          header: 'Write a change request',
          description:
            'Write a CDX backlog request and describe the problem you are trying to solve with the desired result.'
        }
      ],
      links: ['CMS Enterprise Portal']
    }
  },
  ccWarehouse: {
    about: {
      description: `The Chronic Conditions Data Warehouse (CCW) is a research database designed to make Medicare, Medicaid, Assessments, Part C, and Part D Prescription Drug Event data more readily available to support research designed to improve the quality of care and reduce costs and utilization.

This system is used by health services researchers studying ways to improve the quality and reduce the cost of care provided to chronically ill Medicare beneficiaries.

CCW data files may be requested for any predefined chronic condition cohorts, or users may request a customized cohort(s) specific to research focus areas.`,
      items: [
        'CMMI models and demonstrations use the CCW and the VRDC for data analysis, analytics, data mining, and data storage in a SAS environment',
        'Federal staff and CMMI contractors are allowed access to the CCW.',
        'Model participants have limited access to the VRDC to upload and download files.',
        'AHC, BPCI Advanced, CMS FFRDC Contract, Opioid (ViT) Demonstration, CPC+, PCF, DC, KCF, CKCC, IAH, CJR, CEC, ETC, NFI, MCCM, MDPP, IVIG Demonstration, NG ACO, HHVBP, FCHIP, InCK, IDOS Contractor, MOM, State Innovations (MD, PA, VT), ORES OTS Contractor, OCM, Quality Measures Contractor, RO, ET3'
      ],
      components: [
        {
          header: 'Functions',
          description: `CCW provides researchers with Medicare and Medicaid beneficiary, claims, and assessment data linked by beneficiary across the continuum of care. In the past, researchers analyzing data files had to perform extensive analysis related to beneficiary matching, deduplication, and merging of the files in preparation for their study analysis. With the CCW data, this preliminary linkage work is already accomplished and delivered as part of the data files sent to researchers.

Performing model implementation, design, monitoring, and evaluation activities that include: `,
          items: [
            'accessing CMS data',
            'exchanging files/data with model participants',
            'transferring data from the CCW to model operational systems within the CMS boundaries',
            'uploading model awardee-specific data collections into the VRDC',
            'sharing common files/data between projects',
            'sharing CMS and CMMI model data with external researchers'
          ]
        },
        {
          header: 'Product capabilities',
          items: [
            'Follow beneficiaries across multiple care settings',
            'Identify areas for improving quality of care provided to chronically ill Medicare beneficiaries.',
            'Identify ways to reduce program spending.',
            'Make current Medicare, Medicaid, Assessment and Part D data more readily available to researchers for all studies, populations, and rare events.',
            'Provide thorough documentation so researchers understand the common keys, relationships between claims types, and how to use data accurately.'
          ]
        }
      ]
    },
    timeline: {
      description:
        'It takes a few weeks to get access to CCW. The steps below outline the process for contractors and CMS employees.',
      header: 'Contractors',
      items: [
        {
          header: 'Obtain CMS DUA',
          description:
            'Anyone wanting to access CCW data will need a valid CMS DUA (Data User Agreement).'
        },
        {
          header: 'Complete CCW VRDC Access Request worksheet',
          description:
            'Contact Velda McGhee, and she’ll send the CCW VRDC Access Request worksheet to complete. Once completed, email it with a copy of the approved CMS DUA to OEDA (<email>CCWAccess@cms.hhs.gov</email>) and Velda.'
        },
        {
          header: 'Complete CCW CARS application',
          description:
            'Upon approval, OEDA will initiate a request in CCW Access Request System (CARS) application. The new user will receive an email invitation to submit and complete the CARS request for access. '
        },
        {
          header: 'Complete training',
          description:
            'The new user has 14 days to complete remote identity proofing (RIDP) and security awareness training. Once complete, OEDA approves and CCW Help completes the setup and sends a new user ID. CCW Help will also send CCW VRDC training information.'
        }
      ],
      header2: 'CMS Employees',
      items2: [
        {
          header: 'Complete Employee CCW Access Request form',
          description:
            'Contact Velda McGhee, and she’ll send the Employee CCW Access Request form to complete. Once completed, email it with the supervisor’s approval to OEDA (<email>CCWAccess@cms.hhs.gov</email>) and Velda.'
        },
        {
          header: 'Complete CCW CARS application',
          description:
            'Upon approval, OEDA will initiate a request in CCW Access Request System (CARS) application. The new user will receive an email invitation to submit and complete the CARS request for access. '
        },
        {
          header: 'Complete training',
          description:
            'The new user has 14 days to complete remote identity proofing (RIDP) and security awareness training. Once complete, OEDA approves and CCW Help completes the setup and sends a new user ID. CMS IT Service Desk push VMWare software to the user’s desktop.'
        }
      ],
      links: ['Data Disclosures and Data Use Agreements']
    }
  },
  cmsBox: {
    about: {
      description:
        'CMS Box is a cloud content management tool that allows users to upload, download, edit, and share documents t​o one central place. Users can also ​access documents through the web or a mobile device without VPN and without compromising security. All CMS employees should have access by default. '
    },
    timeline: {
      description:
        'Since this is a self service tool, you can work at your own pace. If you have questions or need help using CMS Box, contact the MINT Team at <email>MINTTeam@cms.hhs.gov</email>.',
      items: [
        {
          header: 'Access CMS Box',
          description:
            'G​o to CMS Box and click Continue to confirm you are a part of the Centers for Medicare & M​edicaid services. You will be automatically signed in.'
        },
        {
          header: 'Configure CMS Box for your model',
          description:
            'If using CMS Box to share files with participants, additional permissions will need to be set up.'
        }
      ],
      links: ['Go to CMS Box', 'View resources on CMS Intranet']
    }
  },
  cmsQualtrics: {
    about: {
      description:
        'CMS Qualtrics is a self-service tool for model teams to capture information (like a survey or application). All CMS users should be able to sign into CMS Qualtrics using their CMS user name and password.',
      components: [
        {
          header: 'Capabilities',
          items: [
            'Customizable survey or application creation',
            'Survey or application distribution'
          ]
        }
      ]
    },
    timeline: {
      description:
        'Since this is a self service tool, you can work at your own pace. If you have questions or need help using CMS Qualtrics, contact the MINT Team at <email>MINTTeam@cms.hhs.gov</email>.',
      items: [
        {
          header: 'Access CMS Qualtrics',
          description:
            'Log in to CMS Qualtrics using your CMS user name and password.'
        },
        {
          header: 'Create a survey',
          description:
            'Decide what information you need to capture in your survey or application and start creating. CMS Qualtrics offers different question types so you can select the format that best suits the information you’re wanting to capture.'
        },
        {
          header: 'Distribute your survey',
          description:
            'Choose the distribution method that makes the most sense for your model. CMS Qualtrics has several distribution options like emailing a list, generating a link that anyone can access, and more.'
        }
      ],
      links: ['Go to CMS Qualtrics']
    }
  },
  cbosc: {
    about: {
      description:
        'The Consolidated Business Operations Support Center (CBOSC) contract provides IT and programmatic help desk inquiry support, help desk operations and Business Operations support for the Innovation Center Models, the Alternative Payment Model (APM) track of the Quality Payment Program (QPP) and CM. CBOSC manages intake, resolution and escalation of all inquiries related to Innovations and Shared Savings Program Business Operations centrally. Support is provided through Pre-Implementation, Post-Implementation, Operation, Reporting, and Information Support phases as models test innovative payment and service delivery models to reduce program expenditures while preserving or enhancing the quality of care furnished to individuals.'
    },
    timeline: {
      description:
        'Generally, it takes 30 days for models to start using CBOSC. The steps below are not a complete list of everything involved but highlight some main activities.',
      items: [
        {
          header: 'Begin onboarding activities',
          description:
            'Provide CBOSC with as much information about your model as you know by filling out their onboarding questionnaire. They’ll set up a discovery meeting with your team to identify any missing information and let you know what services CBOSC can provide to your model. During this time, CBOSC will form an internal onboarding team. They develop an onboarding timeline that assures readiness.'
        },
        {
          header: 'Resource mailbox creation',
          description:
            'If the model needs a mailbox, they should infrom CBOSC and provide a list of names and email addresses that should have access the mailbox. Any folders, auto reply messages, and templates are also set up.'
        },
        {
          header: 'Confirm final helpdesk requirements',
          description:
            'CBOS will review and confirm the needs of the model. If the model intends to use phone, the call center must also evaluate interactive voice response (IVR) option tree at this phase. '
        },
        {
          header: 'Build out IVR and test',
          description:
            'During this stage, they will create routing, record model specific messages, update reports and test. CBOSC will then provide the call center phone number and IVR option. Model teams must communicate and update all appropriate stakeholders of the new numbers.'
        },
        {
          header: 'Conduct support center / helpdesk training',
          description:
            'The Help Desk Manager works with the Model Lead to review training materials. These will include any prepared materials, knowledge base articles, or other items. Each level of the support center will receive training. '
        },
        {
          header: 'ServiceNow (SNow) set up and training',
          description:
            'During this phase, the model team receives the appropriate job codes and training for SNow. Knowledge base content is developed and published, and agents are trained on the content.'
        },
        {
          header: 'CBOSC is ready to support the model',
          description:
            'After standard outreach procedures are defined and final testing is complete, CBOSC is ready to support the model. '
        }
      ]
    }
  },
  cpiVetting: {
    about: {
      description: `CPI Vetting is a process conducted by the Center for Program Integrity (CPI). Their mission is to detect and combat fraud, waste and abuse of the Medicare and Medicaid programs.

They make sure CMS is paying the right provider the right amount for services covered under their programs. They support proper enrollment and accurate billing practices by working with providers, states, and other stakeholders. They strive to protect patients while also minimizing unnecessary burden on providers.

CMMI works with CPI to screen participant and provider candidates prior to those candidates joining the model.`
    }
  },
  electronicFileTransfer: {
    about: {
      description:
        'Electronic File Transfer (EFT) is a secure file transfer protocol used to move files from one destination to another internally or externally.'
    }
  },
  expandedDataFeedback: {
    about: {
      description:
        'Expanded Data Feedback Reporting (eDFR) is part of the <link1>Innovation Support Platform (ISP)</link1> Suite of tools for non-ACO models; it provides transparency to stakeholders including the primary care physicians participating in CMMI Alternative Payment Models (APM) in the form of feedback for healthcare delivered from a utilization, cost, and quality perspective. The metrics are calculated based on Medicare provider and claims data. The system renders the information visually on dashboards and reports.',
      links: [
        {
          external: false,
          link: `/help-and-knowledge/operational-solutions?solution=innovation-support-platform&section=about`
        }
      ],
      components: [
        {
          header: 'Functions',
          items: [
            'Receive data from CMMI (claims data, feedback reports)',
            'Produce Business Intelligence (BI) reports and dashboards for internal and external uers',
            'Complete data analytics to supply visibility into peformance against model’s objectives'
          ]
        },
        {
          header: 'Capabilities',
          items: [
            'Provide up to date (quarterly) dashboards for model participants (practices and physicians)',
            'Each dashboard is specific to the exact practice, and will contain information about that practice’s patients.',
            'Dashboards are targeted at the Practice/Physician level, not at higher levels like hospital administrators or group administrators.',
            'Dashboards are not intended to be used by CMS or CMMI internally – they are for the participating practices.',
            {
              header:
                'Each dashboard will contain information that is sensitive to each practice, including:',
              items: [
                'Payment metrics',
                'Patient quality metrics',
                'Locality metrics',
                'Model specific metrics'
              ]
            },
            'Each dashboard can contain information to help practices increase their rankings within a model as well as (potentially) patients well being – but... practices are not required to act on the data included in a dashboard. Dashboards are for informational purposes only.',
            'Provide CMMI internal model teams with intelligence on model participants',
            'Provide ET3 model with a tool for linking data attributes to patients through Probabilistic Matching'
          ]
        }
      ]
    },
    timeline: {
      description:
        'Timelines vary by model but it generally takes 6-12 months.',
      items: [
        {
          header: 'Reach out to eDFR ',
          description:
            'Once a model team knows they would like to use eDFR, they should reach out to Zach Nall.'
        },
        {
          header: 'Meet to understand requirements'
        },
        {
          header: 'Development starts'
        },
        {
          header: 'Change is released',
          description:
            'Generally from first talks to first release, it can take 6 to 12 months to get a model using eDFR. Any future changes are released quarterly. '
        }
      ]
    }
  },
  govDelivery: {
    about: {
      description:
        'GovDelivery is a listserv used to communicate with model participants and other interested stakeholders.',
      components: [
        {
          header: 'Capabilities',
          items: [
            'Reach subscribers by email',
            'Automate and schedule emails',
            'Utilize branded templates',
            'Access detailed reporting'
          ]
        }
      ]
    },
    timeline: {
      description:
        'The setup for GovDelivery is very quick and takes one business day in most cases.',
      items: [
        {
          header: 'Reach out to GovDelivery Admin',
          description:
            'If you’re interested in using GovDelivery for your model, reach out to one of the Admins with the following information:',
          items: [
            'Names, emails, phone numbers, and roles of any topic admins (These will be the people that have edit access in GovDelivery)',
            'The name of the new listserv topic (For example: "Our New Model Newsletter" or similar as appropriate)'
          ]
        },
        {
          header: 'Configure GovDelivery and discuss guidelines',
          description:
            'One of the GovDelivery Admins will set up your topic based on the information you provided. They can also talk you through some of the basic guidelines set by the Office of Communications if necessary.'
        },
        {
          header: 'Access granted',
          description:
            'Once you’re comfortable with GovDelivery, you’re able to start using it. '
        }
      ]
    }
  },
  grantSolutions: {
    about: {
      description: `GrantSolutions (GS) is a tool used to manage grants from funding opportunity planning, through the issuance of awards, to grant closeout.

CMS currently utilizes GrantSolutions primarily for awarding, managing, and closing out grants. For some grant programs, CMS utilizes the GS Application Review Module (ARM) for the required merit review of applications.

CMS also utilizes the GrantSolutions Recipient Insight (RI) tool which applies artificial intelligence, machine learning, and other emerging technologies to collect information from 750,000 organizations contained in seven different public databases. RI analyzes trends and identifies warning signs in the data. This data is presented through key data in actionable dashboards highlighting critical information for conducting risk assessment of applicants and recipients and identify reduce fraud, waste, and abuse.`
    },
    timeline: {
      items: [
        {
          header: 'Contact Mary Greene or Michelle Brown',
          description:
            'Reach out to Mary or Michelle during the development of a grant project.'
        },
        {
          header: 'Point of contact assigned',
          description:
            'A point of contact from the Division of Grants Management will be assigned to the model team. They will guide the model team through the whole process and can provide more in-depth training and resources about the grants management process.'
        }
      ]
    }
  },
  higlas: {
    about: {
      description: `Healthcare Integrated General Ledger Accounting System (HIGLAS) is the single source of truth that centralizes and standardizes the federal financial accounting functions for all of CMS’s programs. All Medicare Fee For Service (FFS), Health Care Exchanges, Medicaid/CHIP/Grants, and Program Budget’s payments are accounted for and reported in HIGLAS.

Specific to CMMI, HIGLAS has two integrated points:`,
      ordered: true,
      items: [
        'CMMI uses an Innovation Payment Contractor (IPC) vendor – National Government Services (NGS) to make payments on many models such as QPP, CJR, MDPCP, CPC, etc. – all of the financial reporting and payment functions are in HIGLAS since Nov 2021.',
        'Other Models, such as BPCI (Bundled Payment), use the FFS claims system to forward the payment details to HIGLAS, and these payments are accounted for and made to awardees from HIGLAS.'
      ],
      components: [
        {
          header: 'Functions',
          items: [
            'Strengthens Medicare’s management of accounts receivable and allows more timely and effective collection activities on outstanding debts',
            'Enhances CMS oversight of contractor financial operations, including data entry, transaction processing and reporting',
            'Produces automated agency financial statements and other required reports, leading to fewer errors in financial reporting and a reduction in manual labor',
            'Allows for the elimination of redundant accounting processes and provides standardized accounting business practices',
            'Enables Medicare contractors to cut back on the number of cuff systems currently used to track financial data',
            'Provides a standard General Ledger accounting system, standardized accounting and financial management process for CMS central office and administrative program accounting activities',
            'Incorporates Medicaid and CHIP government data'
          ]
        }
      ]
    },
    timeline: {
      description:
        'Any necessary setup for HIGLAS will be taken care of when working with the Innovation Payment Contractor (IPC) or the Shared Systems. Contact Donna Schmidt at <email>donna.schmidt@cms.hhs.gov</email> if you have questions.',
      items: []
    }
  },
  healthDataReporting: {
    about: {
      description: `Health Data Reporting (HDR) is part of the <link1>Innovation Support Platform (ISP)</link1> Suite of tools for non-ACO models; it is a configurable, Innovation Center-wide solution that supports the collection and validation of health-related data for analysis by CMMI models.

HDR leverages CMS’ Enterprise Portal and CMMI’s IC Portlet Services for secure access and a standardized look and feel.

HDR’s Configuration Management allows model teams to define and modify performance and submission periods, change data elements to be collected across performance periods, and manage and monitor submissions.`,
      links: [
        {
          external: false,
          link: `/help-and-knowledge/operational-solutions?solution=innovation-support-platform&section=about`
        }
      ],
      components: [
        {
          header: 'Functions',
          items: [
            'A model’s participating entities submit model-specified data at specified times throughout the model’s life. Submitted data is validated, errors are reported back for correction, and submission statuses are reported within the UI for monitoring.'
          ]
        },
        {
          header: 'Data collection capabilities',
          items: []
        },
        {
          header: 'Health data submissions via Microsoft Excel spreadsheets',
          level: 'h4',
          items: [
            'Health data submissions via Microsoft Excel spreadsheets',
            'Aggregate quality measure (i.e., numerators, denominators, exclusions, exceptions)',
            'All other types of health-related data (e.g., clinical data, health equity data, etc.)'
          ]
        },
        {
          header: 'Health data submissions via UI',
          level: 'h4',
          items: ['Aggregate quality measures']
        },
        {
          header: 'Model configuration',
          level: 'h4',
          items: [
            'Model configuration',
            'Basic configuration (field names aligned with AMS)',
            'Model year, performance periods, and submission periods configuration',
            'Quality measure with optional results display configuration',
            'Pre-loaded beneficiary information including minimum thresholds for reporting',
            'Two-tier data validation and status reporting leverages: 1) Microsoft Excel’s in-cell validations and 2) HDR’s backend services'
          ]
        },
        {
          header: 'Quality measure results',
          level: 'h4',
          items: ['Aggregate quality measure calculation results report']
        }
      ]
    },
    timeline: {
      description:
        'Generally, it takes about four to six weeks for models to start using HDR.',
      items: [
        {
          header: 'Reach out to Product Owner',
          description:
            'If you’re interested in using HDR for your model or would like to learn more about the system, please reach out to Curtis Naumann. '
        },
        {
          header: 'Meet to understand requirements',
          description:
            'Tell HDR the type of data you’d like to collect for your model.'
        },
        {
          header: 'Development and validation',
          description: `All models will need submission and validation templates to be built and tested prior to the first data submission. Any model requirements not met by HDR’s current functionality will also need built. This will take extra time, so please plan accordingly.

If the model will use HDR’s pre-fill option, the model team’s implementation contractor will need to provide the following:`,
          items: [
            'Participating entity information',
            'Beneficiary alignment lists'
          ]
        },
        {
          header: 'Start submitting data'
        }
      ]
    }
  },
  healthPlanManagement: {
    about: {
      description: `The Centers for Medicare & Medicaid Services' (CMS) Health Plan Management System (HPMS) is a web-enabled information system that serves a critical role in the ongoing operations of the Medicare Advantage (MA) and Part D programs.

HPMS is a full-service website where health and drug plans, plan consultants, third-party vendors, and pharmaceutical manufacturers can work with CMS to fulfill the plan enrollment and compliance requirements of the Medicare Advantage (MA) and Prescription Drug (Part D) programs.

Health Plan Management System, all health insurance companies participating in the MAPD program use this interface to communicate with CM for their contracting, actuarial, coverage, marketing, and enrollment in the MA and Part D programs.`,
      components: [
        {
          header: 'Functions',
          description: 'HPMS services the MA and Part D programs in two ways:',
          ordered: true,
          items: [
            'HPMS functionality facilitates the numerous data collection and reporting activities mandated for these entities by legislation.',
            'HPMS provides support for the ongoing operations of the plan enrollment and plan compliance business functions and for longer-term strategic planning and program analysis.'
          ]
        },
        {
          header: 'Product capabilities',
          description:
            'HPMS supports the following business processes for all private health and drug plans participating in the MA and Part D programs:',
          items: [
            'Contract and plan enumeration and management',
            'Application submission and review',
            'Formulary submission and review',
            'Bid and benefit package submission and review',
            'Electronic contracting and certifications',
            'Marketing material submission and review',
            'Audit and assessment of plan performance',
            'Plan payment reconciliation data reporting',
            'Part D drug pricing and pharmacy data submissions',
            'Fiscal soundness',
            'Complaint tracking',
            'Compliance',
            'Plan data reporting and performance metrics',
            'Financial, plan bid, and plan data reporting audits',
            'Coverage gap discount program',
            'Electronic health record reporting',
            'Cost reporting and audit',
            'Plan connectivity',
            'Operational data exchanges',
            'Online Enrollment Center (OEC) management',
            'Data support for the Medicare & You handbook and Medicare Plan Finder',
            'Quality improvement',
            'Research and evaluation',
            'Manage stakeholder contacts and organizations',
            'Track events (campaigns) and capture feedback (surveys)',
            'Measure event registration, attendance, and performance'
          ]
        }
      ]
    },
    timeline: {
      description:
        ' and they will help you connect with Center for Medicare (CM).',
      items: []
    }
  },
  innovationPayment: {
    about: {
      description:
        'The Innovation Payment Contractor (IPC) assists CMMI in making payments to eligible participants in multiple tests of Models of care and program innovations to improve quality and value-based care.',
      components: [
        {
          header: 'Financial services conducted for CMMI Models',
          items: [
            'Process payments for Models and disburse Electronic Funds Transfer (EFT) or paper check payments, as required, to eligible Medicare, Non-Medicare, and Medicaid providers, Model participants, and beneficiaries.',
            'Apply Federal Payment Levy Program (FPLP) withholding for each payee in accordance with U.S. Department of Treasury requirements.',
            'Issue demand letters, conduct collection activities, and report on receivables.',
            'Process and apply receipts to Model overpayments and make adjustments as needed to refund excess collections received.',
            'Process referrals of delinquent Model debts to the U.S. Department of Treasury for collection in accordance with CMS debt management policy.',
            'Manage/monitor Extended Repayment Schedule (ERS) arrangements to provide hardship relief to eligible Model participants in accordance with CMS debt management policy.',
            'Manage a single bank account for all new and existing Models that make EFT payments, in accordance with the CMS demonstration payment schedule provided by CMMI and OFM.',
            'Send IRS Forms 1099-MISC annually for payments made to payees in accordance with the IRS threshold requirements.',
            'Send IRS Forms 1099-C annually to Model participants for the cancellation of CMMI model overpayments that were deemed uncollectible and approved for write-off and termination of collection by CMS management.',
            'Provide proper funds control, oversight, and compliance with all applicable laws, regulations, Federal Accounting Standards, Generally Accepted Accounting Principles, CMS Office of Financial Management (OFM) guidelines and reporting requirements, and CMS Internet Only Manual (IOM)/Medicare Financial Management Manual, Chapters 3-7.'
          ]
        }
      ],
      subDescription:
        '<link1>View on SharePoint what is needed to onboard Models to the IPC Portal</link1>',
      links: [
        {
          link: 'https://share.cms.gov/center/CMMI-BSG/IPC/ResourceLibrary/IPC%20Data%20Field%20List.xlsx',
          external: true
        }
      ]
    },
    timeline: {
      description:
        'It takes about 5 months for a new model to start using IPC.',
      items: [
        {
          header: 'Work with the IPC internal team',
          description: `After learning about an upcoming model, the IPC internal team will reach out to the Model team to kick off discussions. Alternatively, Model teams can reach out to the IPC internal team if they have questions or would like to start discussions sooner.

The Model team will receive an implementation milestone schedule that identifies necessary tasks and completion dates to meet their scheduled first payment requirements.`
        },
        {
          header: 'Determine ROM and contract modification',
          description:
            'The IPC internal team will establish a ROM based on several factors:',
          items: [
            'Number of Participants in the Model',
            'Frequency of payments',
            'Number of recoupments (demands)',
            'Frequency of recoupments (demands)'
          ],
          description2:
            'The IPC and OFM bank contracts will be modified to support the Model.'
        },
        {
          header: 'Implementation to the IPC',
          description: `The Model team is provided a Welcome Packet which serves as an introduction to the IPC, an overview of the implementation process and a guide to the IPC payment and recoupment (demand) process. Additionally, workgroup meetings are established with the IPC, Model team, and, if necessary, their IT support contractor(s) to ensure a successful implementation. Some key implementation activities include:`,
          items: [
            'Validate Model participant information',
            'Onboard Model participants to the IPC Portal and collect Model participant banking information.',
            'Establish connectivity with the IPC to exchange files',
            'Prepare the payment and demand files',
            'Onboard to the Healthcare Integrated General Ledger Accounting System (HIGLAS)',
            'Conduct HIGLAS UAT testing'
          ]
        },
        {
          header: 'Ready for payments',
          description:
            'After the Model has been successfully implemented to the IPC, payments can be made to the Model participants.'
        }
      ]
    }
  },
  innovationSupport: {
    about: {
      description:
        'The Innovation Support Platform (ISP) is a contract with three integrated IT systems that support the participant interaction that occurs after model go-live. Work with BSG to determine what combination of Salesforce POST and ISP tools you need.',
      components: [
        {
          header: 'Product capabilities',
          items: [],
          links: [
            {
              link: '/help-and-knowledge/operational-solutions?solution=centralized-data-exchange&section=about',
              external: false
            },
            {
              link: '/help-and-knowledge/operational-solutions?solution=health-data-reporting&section=about',
              external: false
            },
            {
              link: '/help-and-knowledge/operational-solutions?solution=expanded-data-feedback-reporting&section=about',
              external: false
            }
          ],
          description:
            'ISP supplies the capabilities below through: <link1>Centralized Data Exchange (CDX)</link1>, <link2>Health Data Reporting (HDR)</link2>, and <link3>Expanded Data Feedback Reporting (eDFR)</link3>. You can work with BSG to configure the specific capabilities you need for your model.'
        },
        {
          header: 'Access management',
          items: [],
          level: 'h4',
          description:
            'Participants can reuse existing CMS user accounts or create a new one.'
        },
        {
          header: 'Configure model',
          items: [
            'Model year',
            'Performance periods',
            'Submission periods',
            'Pre-load participant information',
            'Pre-load beneficiary information'
          ],
          level: 'h4',
          description: 'Setup the model in the system, including:'
        },
        {
          header: 'Submission management',
          items: [],
          level: 'h4',
          description: 'Establish and manage timeframes for data submission.'
        },
        {
          header:
            'Exchange data through Application Programming Interfaces (API)',
          links: [{ link: 'https://nemsis.org/', external: true }],
          items: [
            'API-based data exchange through industry or organization-specific standards. For example, CDX collected Patient Care Reports through an API with Emergency Management Services software vendors using a <link1>data standard for emergency services.</link1>',
            'Electronic Health Records integration (a Bulk FHIR API is coming soon)'
          ],
          level: 'h4',
          description: 'Engage in interoperable data exchanges, including:'
        },
        {
          header: 'Collect and process health-related data.',
          items: [
            'Expanded Demographics data that complies with United States Core Data for Interoperability (USCDI) standards.',
            'Social Determinants of Health (SDOH) data using the PRAPARE, North Carolina, or AHC tools.',
            'Quality Measures (i.e., numerators, denominators, exclusions, exceptions)',
            'Clinical Data',
            'Other model-defined metrics and qualitative data.'
          ],
          level: 'h4',
          description:
            'Collect data from participants through data entry on web pages, file uploads, or APIs, including:'
        },
        {
          header: '',
          items: [],
          level: 'h4',
          links: [
            {
              link: 'https://www.loom.com/share/ba9eec7f6a0b401a8a5ea102d9c433f1',
              external: true
            }
          ],
          description: '<link1>See a video sample.</link1>'
        },
        {
          header: 'Produce reports and files for participants. ',
          links: [
            {
              link: 'https://cmsbox.app.box.com/s/rc1koqoevslmern6r0hfoabj0zkcawoq',
              external: true
            }
          ],
          items: [
            {
              header:
                'Participant feedback dashboards that supply curated reports to participants based on CMS data (<link1>see a video sample</link1>). Dashboards use the Looker commercial tool and can include information such as:',
              items: [
                'Multiple levels of reports (e.g., entity, practitioner, beneficiary)',
                'Utilization information',
                'Cost information',
                'Claims-based quality measures',
                'Model-specific metrics'
              ]
            },
            'Quality measure results - aggregate quality measure calculation results report',
            'Medicare FFS Claims and Part D raw data files.'
          ],
          level: 'h4'
        },
        {
          header: 'Analytics',
          items: [
            'Computations and algorithms such as probabilistic matching and attribution.',
            'Model Space (coming soon) – a workspace for model contractors, model teams, and BSG’s IT teams to create and share analytical tools using languages such as Python through Data Bricks.'
          ],
          level: 'h4',
          description: 'Create analytics for model teams, including:'
        }
      ]
    },
    timeline: {
      description:
        'The ISP systems (CDX, HDR, eDFR) vary in functionality. Therefore, onboarding and implementation times for the three systems vary. However, the onboarding typically takes months rather than years depending on capacity.',
      items: [
        {
          header: 'Contact the ISP Team',
          description:
            'Contact Joe Pusateri if you’re interested in using ISP or want to learn more.'
        },
        {
          header: 'Initial discussion',
          description:
            'The ISP team will discuss your needs and demonstrate the features available in the systems in ISP.'
        },
        {
          header: 'Commit to using ISP',
          description:
            'The ISP team will add your need to its backlog once you decide to use ISP. The backlog represents the work that ISP must deliver to CMMI model teams.'
        },
        {
          header: 'Discovery, user research, and roadmap',
          description:
            'The ISP team will conduct user research to gain more insight into user behavior, to adjust the existing features, and design the user experience with the ISP systems. The ISP team will discuss requirements with you and identify the Minimal Viable Product (MVP) and a high-level roadmap for the initial go-live.'
        },
        {
          header: 'Sprints',
          description:
            'Develop and test the product iteratively. The ISP team will demonstrate the software product to you iteratively during the sprints.'
        },
        {
          header: 'Prepare for live system operations',
          description:
            'ISP will test the systems rigorously. The team will also work with you to onboard users, prepare the help desk, and to prepare any documentation that your participants may need.'
        },
        {
          header: 'Monitor system performance',
          description:
            'After go-live, the ISP team will monitor how the system performance and design continuing updates to the features.'
        }
      ]
    }
  },
  integratedDataRepository: {
    about: {
      description: `The Integrated Data Repository (IDR) is a multi-platform and high-volume data warehouse comprising integrated views of data across Medicare Parts A, B, C, and D, Beneficiary Entitlement, Enrollment and Utilization data. Provider reference information, Drug data, Contracts for Plans, and Medicaid and Children’s Health Insurance Program (CHIP).

The data in the IDR is leveraged by various components across the agency to facilitate investigative and litigious efforts focused on fighting Medicare and Medicaid fraud, waste and abuse. Users of the IDR leverage the robust suite of Enterprise BI tools made available to them to conduct in-depth analysis of risk adjustment policies, Medicare-Medicaid program comparisons, payment models, and prescription drug cost trends, among many other areas of importance.`,
      components: [
        {
          header: 'Functions',
          items: [
            'Medical Trend & Utilization Analysis',
            'Healthcare Cost & Assessment',
            'Policy Analysis and Development',
            'Provider Profiling & Management',
            'Quality and Effectiveness: Pay for Performance',
            'Program Integrity and Fraud, Waste & Abuse',
            'Rapid response to legislative inquiries',
            'Data available for claims-based program operational needs'
          ]
        },
        {
          header: 'Product capabilities',
          items: [
            'State of the art business intelligence, reporting, and additional data access capabilities',
            'Automated Finder File and Data Extract Process',
            'Data dictionary, data limitations information, source to target mappings, etc.',
            'Customer support and assistance'
          ]
        }
      ]
    }
  },
  learningAndDiffusion: {
    about: {
      description:
        'The Learning and Diffusion Group (LDG) is a team within CMMI that facilitates learning within models and disseminates the lessons learned across models so that participants can benefit from the experiences of other models. LDG has two divisions: the Division of Model Learning Systems (DMLS) and the Division of Analysis and Networks (DAN).',
      components: [
        {
          header: 'Services provided',
          items: [
            'Learning systems',
            'Driver diagram development',
            'Educating beneficiaries',
            'Recruiting participants (advertising the model to stakeholders)',
            'Cross-participant sharing (using Connect, 4i, or other)',
            'Learning contractor (a cross-model contract or something else)',
            'Technical assistance',
            'Model-specific learning (for example, a focus on quality)',
            'Model-specific data collection efforts',
            'Model-specific care redesign/care reporting',
            'Dashboard development (piloting)',
            'Complete health equity analyses',
            'Model-specific learning cost estimate',
            'Have an LDG member as part of the team'
          ]
        }
      ]
    },
    timeline: {
      items: [
        {
          header: 'CMMI contacts LDG',
          description:
            'Someone from CMMI will reach out to the LDG team about the model’s needs.'
        },
        {
          header: 'LDG will be in contact',
          description:
            'Depending on the needs of the model, a team member from LDG may be assigned to your model.'
        }
      ]
    }
  },
  legalVertical: {
    about: {
      description: `The mission of the Legal Vertical is to facilitate an effective and coordinated working relationship between CMMI and Office of General Council (OGC), the legal counsel to CMMI, and to provide an internal resource on legal issues.

To achieve this mission, the Legal Vertical provides technical assistance and support to CMMI; drafts governing documents and cross-cutting regulations; promotes consistency in addressing cross-cutting legal issues; and helps to identify and mitigate potential legal risks to CMMI.`,
      components: [
        {
          header: 'Services provided',
          items: [
            'Manage CMMI’s overall relationship with OGC',
            'Draft Participation Agreements, Cooperative Agreements, State Agreements, addendums to Medicare Agreements, certain aspects of rulemaking, and upon request and subject to availability, other legal-related documents ​',
            'Provide technical assistance to model teams and groups for cross-cutting initiatives',
            'Develop recommendations to address cross-cutting legal issues'
          ]
        }
      ]
    },
    timeline: {
      description:
        'Timing varies based on the type of service or assistance needed. For example, Participation Agreements (PA) can take 9-12 months from start to finish.',
      items: [
        {
          header: 'Reach out to Legal Vertical',
          description:
            'When model teams have questions or when they start developing their ICIP, they should contact Megan Hyde or Erin Hagenbrok.'
        },
        {
          header: 'Legal Vertical member assigned',
          description:
            'Model team management should reach out to Ann Vrabel and Melanie Dang to get an official LV team member assigned to assist with their legal needs. Team management should describe what their needs are and whether or not the model team will need a PA drafter. Ideally, the ask for a PA drafter would be included in the initial request. However, if the team management does not know whether or not they will need an LV PA drafter, then a separate request can be made later.'
        },
        {
          header: 'Draft governing documents',
          description:
            'The assigned LV team member will draft the necessary documents with the assistance of the model SMEs. The governing document is an operational document. Thus, all policy decisions and operational decisions should be made before drafting begins. If model teams need to make policy or operational changes during the drafting and clearance process, their timelines may be delayed.'
        },
        {
          header: 'Clearance and approval',
          description:
            'All governing documents must go through OGC clearance, and, if applicable, be approved by the waiver team. Clearance has several rounds, so this is a pretty lengthy process.'
        }
      ]
    }
  },
  masterDataManagementProgramOrganizationRelationship: {
    about: {
      description: `Master Data Management (MDM) at CMS produces integrated and harmonized Beneficiary and Provider data from various Medicare and Medicaid systems. To create this master version, MDM uses identity resolution to recognize distinct entities provider(e.g., a provider, beneficiary, organization, or program) by matching similar records across multiple data sets. MDM provides flexible and easy access to provider and beneficiary data through extracts, business intelligence reports and data lake mesh, and data share to IDRC Snowflake.

MDM is an authoritative System of Reference that integrates and stores data from CMS operational Systems of Record. MDM data is considered as authoritative as the data in the source System of Record from which it is obtained.

CMMI, in particular, uses MDM as a repository to store data to inform and resolve model overlaps (when necessary) for both aligned beneficiaries and participating providers among CMS payment models/demonstrations that are primarily shared savings-based models. This use of MDM for CMMI is a limited but critical role so that CMMI, CM, and Duals Office models have a single point of operational data ‘hub’ to resolve overlaps.

MDM is one of CMS’s Enterprise Shared Services (ESS) that provides authoritative data integrated and consolidated from various source systems. MDM helps address business challenges by linking data across multiple sources for various business needs. MDM provides:`,
      items: [
        'Trusted identity resolution capability for CMS’ expanding catalog of Master Data sources',
        'Integration and consolidation of Master Data from numerous disparate data sources to create a consolidated, authoritative view of each entity',
        'Flexible and easy access to Master Data (e.g., near real-time web services, extracts for batch processing, APIs, and analytic capabilities).',
        'A platform for improved data quality and understanding',
        'A record of non-claims-based payments'
      ],
      components: [
        {
          header: 'Functions',
          items: [
            'Identity resolution of CMS enterprise data entities (providers)',
            `Repository for CMMI’s APM alignment overlaps data`,
            'Federation of identity resolved CMS enterprise data'
          ]
        }
      ],
      links: [
        {
          external: true,
          link: `https://share.cms.gov/center/CMMI-BSG/OOT/Lists/Onboarding%20Questionnaire/NewForm.aspx?Source=https%3A%2F%2Fshare%2Ecms%2Egov%2Fcenter%2FCMMI%2DBSG%2FOOT%2FLists%2FOnboarding%2520Questionnaire%2FAll%2520Overlaps%2520Responses%2Easpx`
        }
      ]
    },
    timeline: {
      description:
        'Coordination with MDM can happen prior to having an implementation contractor. Once the model has an implementation contractor, it takes an average of two months to onboard. ',
      items: [
        {
          header: 'CMMI/BSG will reach out',
          description:
            'When CMMI/BSG is notified that a model will use MDM, they will contact the model team. If your model needs to utilize MDM and have not been contacted, email Celia Shaunessy.'
        },
        {
          header: 'Discussion with the model team',
          description:
            'After initial communication, there is a discussion with the model team to check if they need to proceed. If so, CMMI/BSG will help shepherd the onboard process as necessary.'
        },
        {
          header: 'Complete onboarding questionnaire',
          description: `CMMI/BSG will send an onboarding questionnaire to the model team to fill out the program ID, number of beneficiaries, type of beneficiaries, overlap rules, and other business requirements.

<link1>Go to Onboarding Request Form for MDM-POR</link1>`,
          links: [
            {
              external: true,
              link: `https://share.cms.gov/center/CMMI-BSG/OOT/Lists/Onboarding%20Questionnaire/NewForm.aspx?Source=https%3A%2F%2Fshare%2Ecms%2Egov%2Fcenter%2FCMMI%2DBSG%2FOOT%2FLists%2FOnboarding%2520Questionnaire%2FAll%2520Overlaps%2520Responses%2Easpx`
            }
          ]
        },
        {
          header: 'Meet with MDM operations team',
          description:
            'CMMI/BSG meets with the MDM operations team to share the business requirements.'
        },
        {
          header: 'Share ICD',
          description: `CMMI/BSG will share an interface control document (ICD) that describes how data needs to be loaded into MDM. Her team can help answer any questions that model teams and their implementation contractors have about MDM.

<link1>Go to ICD and Onboarding Mapping for MDM-POR</link1>`,
          links: [
            {
              external: true,
              link: `https://share.cms.gov/center/CMMI-BSG/OOT/Overlaps_Library/Forms/MDMResources.aspx`
            }
          ]
        }
      ]
    }
  },
  masterDataManagementForNCBP: {
    about: {
      description: `Master Data Management (MDM) for non-claims-based payments (NCBP) is a medium-term solution that satisfies the CMS requirement for payment models participating in shared savings initiatives to store non-claims payment data in a central location. Based on discussions with representatives of the Office of Information Technology (OIT), the Office of Enterprise Management (OEM), and the technical advisors of CMMI, MDM stores non-claims payment files in a central repository as CMS considers long-term solutions for non-claims payment data.

MDM is an authoritative System of Reference that integrates and stores data from CMS operational Systems of Record. MDM data is considered as authoritative as the data in the source System of Record from which it is obtained.

MDM is one of CMS’s Enterprise Shared Services (ESS) that provides authoritative data integrated and consolidated from various source systems. MDM helps address business challenges by linking data across multiple sources for various business needs. MDM-NCBP specifically provides:`,
      items: ['A record of non-claims-based payments'],
      components: [
        {
          header: 'Functions',
          items: [
            'A centralized source of program non-claims-based payment data',
            'A reusable service to access data',
            'Improved visibility and incremental improvements into data quality through data profiling and data analysis'
          ]
        }
      ]
    },
    timeline: {
      description:
        'Coordination with MDM-NCBP can happen prior to having an implementation contractor. Once the model has an implementation contractor, it takes an average of two months to onboard.',
      items: [
        {
          header: 'CMMI/BSG will reach out',
          description:
            'When CMMI/BSG is notified that a model will have non-claims-based payments and will use MDM, they will contact the model team. If your model has non-claims-based payments have not been contacted, email Celia Shaunessy.'
        },
        {
          header: 'Discussion with the model team',
          description:
            'After initial communication, there is a discussion with the model team to check if they need to proceed. If so, CMMI/BSG will help shepherd the onboard process as necessary.'
        },
        {
          header: 'Complete onboarding questionnaire',
          description: `CMMI/BSG will send the model team an onboarding questionnaire specific to MDM-NCBP. The model team should fill out the program ID and other business requirements.

<link1>Go to Onboarding Request Form for MDM-NCBP</link1>`,

          links: [
            {
              external: true,
              link: 'https://share.cms.gov/center/CMMI-BSG/OOT/Lists/Onboarding%20Questionnaire%20%20NCBP/NewForm.aspx?Source=https%3A%2F%2Fshare%2Ecms%2Egov%2Fcenter%2FCMMI%2DBSG%2FOOT%2FLists%2FOnboarding%2520Questionnaire%2520%2520NCBP%2FAll%2520NCBP%2520Responses%2Easpx'
            }
          ]
        },
        {
          header: 'Meet with MDM operations team',
          description:
            'CMMI/BSG meets with the MDM operations team to share the business requirements.'
        },
        {
          header: 'Share ICD',
          description: `CMMI/BSG will share an interface control document (ICD) that describes how data needs to be loaded into MDM-NCBP. Celia Shaunessey and her team can help answer any questions that model teams and their implementation contractors have about loading non-claims-based payment information into MDM-NCBP.

<link1>Go to ICD and Onboarding Mapping for MDM-NCBP</link1>`,
          links: [
            {
              external: true,
              link: 'https://share.cms.gov/center/CMMI-BSG/OOT/Overlaps_Library/Forms/NCBPResources.aspx'
            }
          ]
        }
      ]
    }
  },
  measureInstrumentDS: {
    about: {
      description:
        'CMMI awarded a task order off of CCSQ’s Quality Measure Development and Analytic Support (QMDAS) contract and titled the task order the Measure Instrument Development and Support contract, or MIDS for short. MIDS is a quality measure contract that supports model teams’ development of de novo measures and re-specification of existing measures for use in CMMI’s Alternative Payment Models (APMs). The MIDS contract is used to support measuring and incentivizing quality in the Center’s healthcare delivery models, assisting models in their quality strategy and design of measures.',
      components: [
        {
          header: 'The objectives of the MIDS contract are to:',
          items: [
            'Develop de novo quality measures and re-specify existing quality measures to support measuring and incentivizing quality in the Center’s portfolio of APMs,',
            'Support measures through the full Measure Lifecycle including endorsement, rulemaking as needed, reevaluation, and implementation, and',
            'Provide ad hoc analysis support or reports to assist the Center and its models in the design of their quality strategy during new model development or when the model desires to revise a measure used in its current quality portfolio.'
          ]
        }
      ],
      subDescription:
        'MIDS also includes work to reevaluate measures, support measure implementation through collaboration with implementation contractors, pursue National Quality Forum (NQF) endorsement, and, as needed, provide rulemaking language for proposed measure uses.'
    },
    timeline: {
      description:
        'The CMMI MIDS contract is currently in option year 3 of a base plus 4-year contract. Most of the quality measure work has already been identified and approved for the current year, however, you can still consider the CMMI MIDS contract for ad hoc analyses or reports to support the design of the quality strategy for model work. The CMMI MIDS contract has one more year remaining, option year 4, then the contract will be recompeted. The timeline for developing and supporting a new quality measure varies based on the complexity of the measure. The CMMI MIDS contractor will work with the model teams to develop and maintain their quality measures during the models’ lifecycle.',
      items: [
        {
          header: 'Reach out to Quality Vertical',
          description:
            'Model teams interested in utilizing the CMMI MIDS contract for quality measure work should email the Quality Vertical Program Analyst, Dustin Allison. Dustin is responsible for the review and consideration of all quality measure requests being considered for the CMMI MIDS contract. The email should include a brief overview of what the model is, justification for the measure work, and also identify available funding to pay for this work. Dustin will meet with the QV team to review the request and determine if the work should move forward. If the request is approved, the model teams will reach out to the CMMI MIDS COR to move forward with their request. '
        },
        {
          header: 'COR meets with the model team',
          description:
            'Once model teams receive approval from Dustin to utilize the CMMI MIDS contract, they should then reach out to the CMMI MIDS COR, Teresa Winder-Wells, and the CMMI MIDS Quality Subject Matter Expert (QSME), Tim Day to discuss their quality measure needs. Teresa and Tim will guide the model teams as they prepare justification to present their request to the Front Office (FO). '
        },
        {
          header: 'Present justification to Front Office',
          description:
            'The model teams will present their justification to the FO. The FO will determine if they want to move forward with the model team’s request and if additional funding is needed. If approval is given, the model teams will reach out to the CMMI MIDS COR to move forward with their quality measure work.'
        },
        {
          header: 'COR presents to the MIDS contractor',
          description:
            'The CMMI MIDS COR will forward the model team’s request to the CMMI MIDS contractor who will assess whether they can do the work and how much it will cost based on the request. If the work can be completed utilizing the existing CMMI MIDS contract, then the CMMI MIDS COR will modify the contract and add the new work to the MIDS contract.'
        },
        {
          header: 'COR and model team takes information back to FO',
          description:
            'If the measure work cannot be completed under the existing CMMI MIDS contract, then the model teams would have to go back to the FO to request approval of funding to complete the work. If the FO approves the funding, then CMMI MIDS COR will complete a modification to the contract and once complete, instruct the CMMI MIDS contractor to begin working with the model team.'
        },
        {
          header: 'Contractor can begin working with model team',
          description:
            'The CMMI MIDS COR, MIDS QSME, and MIDS Contractor will begin working with the model teams to develop and/or respecify their quality measures.'
        }
      ]
    }
  },
  marx: {
    about: {
      description: `The Medicare Advantage (MA) & Prescription Drug (Part D) system maintains enrollment, payment, and premium data for Medicare beneficiary enrollments in Medicare Part C and D Plans. The Medicare Advantage (MA) & Prescription Drug (Part D) systems provide services to beneficiaries, Plans, and CMS.

Transaction Processing Plans submit batch files that contain enrollment, disenrollment, and various status update transactions to MARx. Using CMS business rules, MARx validates the transactions and accepts or rejects the submitted enrollments, disenrollment, or changes. Daily response files report the results of all transactions back to the plans. Other Medicare Modernization Act (MMA) systems also interact with MARx. Notifications from other systems, such as the Medicare Beneficiary Database (MBD), which report changes in beneficiary demographics, entitlement, health status, low-income subsidy status, etc. may affect beneficiary enrollment and payment to the Plans.

Payment Processing MARx calculates monthly Medicare payments for each Plan and generates payment adjustments when changes in membership and/or beneficiary health status occur. Monthly reports detail enrollment and payment information for the plans and CMS. Premium Processing MARx receives and processes transactions impacting Part C and Part D premiums, Medicare Part B Reduction, and Medicare Part C/D Plan enrollment status. Beneficiaries may elect to have their premiums withheld from their Social Security Administration (SSA) or Railroad Retirement Board (RRB) checks. MARx is responsible for interfacing with SSA or RRB to establish or terminate withholding and tracks expected withholding amounts. Once the withholding agency completes processing each transaction, a response is sent back to MARx informing CMS of the withholding agency's acceptance or rejection of each of the individual premium withholding requests, cancellations, statuses, and amounts. The withholding agency's acceptance or rejection of the transactions is communicated to the Plans. The Premium Withhold Accounting functionality was implemented to reconcile the withheld premium amounts. Based on reconciliation of the expected and actual premium amounts, the premium dollars to be included in a plan's payment are determined. `,
      components: [
        {
          header: 'User Interface',
          level: 'h4',
          description:
            'The MARx application includes online processing capabilities. The MARx User Interface (UI) provides Plans and CMS the ability to view and update beneficiary, enrollment, payment, and premium information.',
          items: []
        },
        {
          header: 'Functions',
          items: [
            'Responsible for the enrollment of beneficiaries into Medicare Advantage and Part D plans',
            'Calculates monthly premiums for Part D plans, Medicare Advantage plan providers and Part D plan providers',
            'Generates the payment file used to pay plan providers',
            'Provides withholding information to SSA so that monthly premiums are deducted from a beneficiaries SSA check'
          ]
        }
      ]
    },
    timeline: {
      description:
        ' if your model will use MARx or if you have any questions. ',
      items: []
    }
  },
  outlookMailbox: {
    about: {
      description:
        'Set up an email address through Outlook Mailbox, so all your model communications will funnel into a single place.'
    },
    timeline: {
      description:
        'It takes a minimum of 1-2 weeks for a mailbox to be set up.',
      items: [
        {
          header: 'Submit request',
          description:
            'From the CMS Connect app on your desktop, search for “<bold>Create or manage a resource mailbox</bold>” or “<bold>Mailbox request</bold>.” You’ll need to provide the following information:',
          items: [
            'Request type (Create a new resource mailbox)',
            {
              items: [
                'Mailbox name (Please be specific. For example: CMS OP Feedback).',
                'Mailbox email address (For example: OPFeedback@cms.hhs.gov).',
                'Include the CMS Owner(s) name(s) of the primary mailbox owner/backup owner .',
                'List of all who will need full access to the mailbox (CMS email addresses only).',
                'Will this mailbox be primarily used as a calendar?.',
                'If yes, will there be dedicated people that will be entering or approving appointments in the calendar, or will the calendar automatically accept appointments?.',
                'Any other special requirements for the mailbox'
              ]
            },
            'Requested by date',
            'Description',
            'Business justification',
            'Add attachments associated with the request (optional)'
          ],
          description2:
            'If you’d rather submit a request by email, please send the above information to <email>cms_it_service_desk@cms.hhs.gov</email>'
        },
        {
          header: 'Mailbox created',
          description:
            'You will be notified by email when your mailbox is created. The email will contain instructions on how to add the mailbox.'
        }
      ]
    }
  },
  qualityVertical: {
    about: {
      description:
        'The Quality Vertical is responsible for developing and implementing the Center’s overall quality strategy and disseminating that information vertically. They do this by working with model teams as they develop and implement their model quality strategies.',
      components: [
        {
          header: 'Services provided',
          items: [
            'Guidance in quality measure selection and recommendations for usage',
            'Assistance in developing a new quality measure',
            'Technical assistance to model teams'
          ]
        },
        {
          header: 'Additional resources',
          links: [
            {
              link: 'https://share.cms.gov/center/cmmi/QualVert/ModelResources/Forms/AllItems.aspx',
              external: true
            },
            {
              link: 'https://mmshub.cms.gov/mms-tools',
              external: true
            },
            {
              link: 'https://qpp.cms.gov/',
              external: true
            }
          ],
          items: [
            '<link1>Quality Vertical Model Resources on SharePoint</link1>',
            '<link2>Measure Management System (MMS) Tools</link2>',
            '<link3>Quality Payment Program</link3>'
          ]
        }
      ]
    },
    timeline: {
      description:
        'Timing for working with the Quality Vertical varies based on the model’s needs though it is best to reach out as early as possible. ',
      items: [
        {
          header: 'Reach out to Quality Vertical',
          description:
            'Early in modal development, model teams should reach out Susannah Bernheim. The QV team meetes Wednesdays to discuss, so new models should be prepared to join and share information about their model concept.'
        },
        {
          header: 'QV assists the model team',
          description:
            'The level of QV involvement varies by model. QV will provide a template to model teams to help decide which quality measures to use. A member of QV may also be assigned to attend weekly meetings with the model team to assist with their quality efforts throughout the development process.'
        },
        {
          header: 'QV reviews quality measures before clearance',
          description:
            'Before entering clearance, the model’s quality measures must be reviewed by QV.'
        }
      ]
    }
  },
  rmada: {
    about: {
      description: `Research, Measurement, Assessment, Design, and Analysis (RMADA) Indefinite Delivery Indefinite Quantity 2 (IDIQ) umbrella contract, the Centers for Medicare & Medicaid Services (CMS) shall award task orders (TOs) for a wide range of analytic support and technical assistance activities that support models and demonstration programs created or derived under the auspices of the Patient Protection & Affordable Care Act (ACA), the Medicare Access and CHIP Reauthorization Act (MACRA), other non-ACA statutes, and future health reform legislation. Supporting all aspects of model design and operations (with the exception of information technology);`,
      items: [
        'Conducting program, data and environmental analyses',
        'Assisting with application development and review',
        'Monitoring model site implementations',
        'Designing and carrying out surveys and other primary data collection activities',
        'Obtaining and analyzing secondary data sources including data regarding Medicare, Medicaid, and the Children’s Health Insurance Program (CHIP) and data from private payer sources needed to support model design, operations and evaluations',
        'Reporting on formative and summative analyses',
        'Providing rapid cycle evaluation feedback to CMS and/or model participants',
        'Creating summative reports of annual and final program findings',
        'Assist in the development of program templates, tools, toolkits, and driver diagrams',
        'Support stakeholder engagement and training',
        'Provide data analysis/ integration support',
        'Assist in the development of program specific technical/policy resource guides and informational/ educational/ briefing materials',
        'Provide grant proposal reviews and summarization reports',
        'In addition to the aforementioned list of required tasks, the Contractor may be asked to work with CMS on matters pertaining to developing and implementing learning systems to support accelerated learning, improvement, and dissemination of promising practices.'
      ]
    },
    timeline: {
      description:
        'Model teams should follow the <link1>Procurement Administrative Lead Time (PALT)</link1> standards to determine when to being working with RMADA.',
      items: [],
      links: ['Procurement Administrative Lead Time (PALT)']
    }
  },
  ars: {
    about: {
      description:
        'The Salesforce Application Review and Scoring (ARS) allows model teams to track a panel’s review and scoring of the submitted applications to a participation agreement model.',
      components: [
        {
          header: 'Product capabilities',
          items: [
            '<bold>Scoring Rubric</bold> - Establish a framework to score applications and set up the panel members.',
            '<bold>Application Scoring</bold> - Score applications and track the input from each panel member.'
          ]
        },
        {
          header: '',
          items: ['<link1>View an ARS screenshot</link1>'],
          links: [
            {
              link: `${window.location.origin}/help-center/salesforce-ars.png`,
              external: true
            }
          ]
        }
      ]
    },
    timeline: {
      description:
        'It can take 3-5 months for a model to use Salesforce, but you should submit an onboarding request as soon as you know your model will utilize the tool. Below are the steps involved in the process.',
      items: [
        {
          header: 'Submit an onboarding request',
          description:
            'Submit an onboarding request via the Salesforce Change Management Tool (CMT). You will need to provide the following information:',
          items: [
            'Request type, title, component',
            'Priority',
            'Requester contact information',
            'Program/model name and point of contact information',
            'Project type (for example: Letter of Intent)',
            'Description of onboarding request',
            'Desired implementation/go-live date and impact if that date deadline is missed'
          ]
        },
        {
          header: 'Discovery'
        },
        {
          header: 'Requirements gathering'
        },
        {
          header: 'Development (sprints)'
        },
        {
          header: 'Testing'
        },
        {
          header: 'Deployment'
        }
      ],
      links: ['Go to Salesforce CMT']
    }
  },
  salesforceConnect: {
    about: {
      description:
        'Salesforce CONNECT creates a social media-like environment to facilitate participant-to-participant and CMS-to-participant collaboration. ',
      components: [
        {
          header: 'Product capabilities',
          items: [
            '<bold>Group management</bold> - Define collaboration groups that can include participants, contractors, and CMS staff.',
            '<bold>Engage</bold> - Members of a Group can interact through chat, Q&A, and information sharing.',
            '<bold>Learn</bold> - Follow topics and search for information. Share and organize relevant materials.'
          ]
        },
        {
          header: 'Samples',
          items: [
            '<link1>View sample 1</link1>',
            '<link2>View sample 2</link2>'
          ],
          links: [
            {
              link: `${window.location.origin}/help-center/salesforce-connect-1.png`,
              external: true
            },
            {
              link: `${window.location.origin}/help-center/salesforce-connect-2.png`,
              external: true
            }
          ]
        }
      ]
    }
  },
  salesforceLOI: {
    about: {
      description:
        'The Salesforce Letter of Intent (LOI) is a website that allows model teams to collect information to gauge the level of industry interest in a participation agreement model.',
      components: [
        {
          header: 'Product capabilities',
          items: [
            '<bold>Access management</bold> - candidate participants can access a web page without a CMS account.',
            {
              header:
                '<bold>Data collection</bold> - collect data from candidate participants such as:',
              items: [
                'Indication of interest',
                'Contact information',
                'Organization information (e.g., demographics, type of organization)',
                'Supporting documents'
              ],
              description:
                'You can customize the data collection during the development process.'
            },
            '<bold>Track</bold> submissions'
          ]
        },
        {
          header: '',
          items: ['<link1>View an LOI sample</link1>'],
          links: [
            {
              link: `${window.location.origin}/help-center/salesforce-loi.png`,
              external: true
            }
          ]
        }
      ]
    }
  },
  salesforcePortal: {
    about: {
      description:
        'The Project Officer Support Tool helps model teams manage participants after model go-live. Work with BSG to determine what combination of Salesforce POST and ISP tools you need.',
      components: [
        {
          header: 'Product capabilities',
          description:
            'The capabilities for POST vary between models. The following capabilities are common across models. The project team will create the capabilities that your model requires.',
          items: [
            '<bold>Access management</bold> - Participants can reuse existing CMS user accounts or create a new one.',
            '<bold>Applications</bold> - Applications – View and edit applications submitted through the RFA.',
            '<bold>Sign Participant Agreements</bold> - (coming soon) – Electronically sign Participant Agreements after reviewing applications and selecting participants.',
            '<bold>Participant Profile</bold> - Participant Profile – Create and manage profiles of your participants and awardees, including contact information and organization characteristics.',
            '<bold>Participant Documents</bold> - Participant Documents – Collect, approve, and manage documents with your participants (e.g., agreements, attestations, progress reports, status reports, and marketing materials).',
            '<bold>Submission Management</bold> - Submission Management – Establish and manage timeframes for data submission.',
            {
              header:
                '<bold>Participant Engagement</bold> - Engage with your participants with features such as:',
              items: [
                'Post announcements, FAQs, and other information',
                'Engage in chats, surveys, and polls',
                'Manage events, tasks, and email templates',
                'Manage Corrective Action Plans'
              ]
            },
            '<bold>Case Management</bold> - Case Management – Manage requests, tickets, and questions from participants.',
            '<bold>Reports and Dashboards</bold> - Reports and Dashboards – Produce standard and ad-hoc reports based on the data in the system.'
          ]
        },
        {
          header: 'Samples',
          items: [
            '<link1>View sample 1</link1>',
            '<link2>View sample 2</link2>'
          ],
          links: [
            {
              link: `${window.location.origin}/help-center/salesforce-post-1.png`,
              external: true
            },
            {
              link: `${window.location.origin}/help-center/salesforce-post-2.png`,
              external: true
            }
          ]
        }
      ]
    }
  },
  salesforceRequestApplication: {
    about: {
      description:
        'The Salesforce Request for Application (RFA) allows model teams to collect applications from organizations that want to participate in a participation agreement model.',
      components: [
        {
          header: 'Product capabilities',
          items: [
            '<bold>Access management</bold> - Access management – Candidate participants can reuse existing CMS user accounts or create a new one.',
            {
              header:
                '<bold>Data collection</bold> - Collect the data you need to review and select participants such as:',
              items: [
                'Organization information',
                'Contact information',
                'Provider network'
              ],
              description:
                'You can customize the data collection during the development process.'
            },
            '<bold>Conditional logic</bold> - Build logic into the questions you ask applicants (e.g., present new questions based on answers to prior questions)',
            '<bold>Documents</bold> - Collect supporting documents from the candidate participants.',
            '<bold>Vet Providers</bold> - (coming soon) – Determine if Medicare FFS providers are valid by checking against data from the Center for Program Integrity (CPI), such as PECOS.',
            '<bold>Track</bold> - submissions',
            '<bold>Sign Participant Agreements</bold> - (coming soon) – Electronically sign Participant Agreements after reviewing applications and selecting participants.'
          ]
        },
        {
          header: '',
          items: ['<link1>View an RFA screenshot</link1>'],
          links: [
            {
              link: `${window.location.origin}/help-center/salesforce-rfa.png`,
              external: true
            }
          ]
        }
      ],
      ipcPortal: {
        header:
          'Is your model also making payments through the <link1>Innovation Payment Contractor (IPC)</link1>?',
        externalLink:
          '<link2>View on SharePoint what is needed to onboard Models to the IPC Portal</link2>'
      },
      links: [
        {
          link: '/help-and-knowledge/operational-solutions?page=1&solution=innovation-payment-contract&section=about',
          external: false
        },
        {
          link: 'https://share.cms.gov/center/CMMI-BSG/IPC/ResourceLibrary/IPC%20Data%20Field%20List.xlsx',
          external: true
        }
      ]
    }
  },
  sharedSystems: {
    about: {
      description: `The Shared Systems are a group of systems used to process traditional Medicare Fee-for-Service (FFS) claims for Part A, Part B, and Durable Medical Equipment (DME).

Beneficiaries visit a provider of Medicare services, and that provider files a claim with their Medicare Administrative Contractor (MAC). The MAC processes and pays the claim, and sends a remittance to advise the provider and a Medicare Summary Notice (MSN) to the beneficiary. There are many Centers and Offices that receive the Medicare legislation that determines policies; those become change requests implemented through quarterly releases by the Shared System Maintainers (SSM) and the MACs.`,
      components: [
        {
          header: 'Additional resources',
          level: 'h4',
          items: [
            'Fee For Service Change Request Resource Center',
            '<link1>Go to Fee For Service Change Request Resource Center</link1>'
          ],
          links: [
            {
              link: `https://share.cms.gov/center/cmmi-eos/CMMITraining/SitePages/FFSHome.aspx`,
              external: true
            }
          ],
          hideBullet: [1]
        },
        {
          header: '',
          description: 'The following systems are a part of Shared Systems: ',
          items: []
        },
        {
          header: 'Common Working File (CWF)',
          description: `Common Working File (CWF) is a Medicare Part A and B benefit coordination and claim validation system. CWF is a tool the Centers for Medicare & Medicaid Services (CMS) uses to maintain records about beneficiaries enrolled in the Medicare Fee-for-Service health plan. The CWF is comprised of nine localized databases called Hosts. Hosts maintain total Medicare claim history and entitlement information for the beneficiaries in their jurisdiction, which are updated daily by Medicare contractors and other applicable entities (i.e., Social Security Administration). CWF is used to determine the Medicare beneficiaries' eligibility for Medicare services and to monitor and inform other CMS payment systems on the appropriate usage of Medicare benefits, and to ensure payments for services received are appropriately determined and applied to payments based on Medicare payment and coverage rules. Also, the repository provides Medicare beneficiary eligibility information that is received nightly from the Social Security Administration (SSA). The eligibility information consists of newly enrolled beneficiaries in Medicare.`,
          items: []
        },
        {
          header: 'Functions',
          level: 'h4',
          items: [
            'Verify beneficiary eligibility, entitlement, and utilization. Avoid improper payment through comparison of Part A and B data. Allow BDS and FPS checking before CWF processing.',
            'CWF software performs data collection and validation, online inquiry, file maintenance, reports, and archival/retrieval.',
            'The CWF provides the MAC with responses to claims. MACs also submit special transactions such as Medicare Secondary Payment (MSP) data (primary insurer data when Medicare is secondary), ESRD (End Stage Renal Disease) Method of Reimbursement Computation data (only Part A MACs submit these transactions), and Certificate of Medical Necessity ((CMS) only DME MACs submit these transactions). These transactions are submitted to the CWF along with the claims and are identified by transaction type. Claims are added to the CWF full claim history file.'
          ]
        },
        {
          header: 'Fiscal Intermediary Shared System (FISS)',
          description:
            'The FISS is the shared system that processes Medicare Part A claims, including outpatient claims submitted under Part B. It interfaces directly with the Common Working File (CWF) system for verification, validation, and payment authorization. Claims are entered, corrected, adjusted, or canceled. Inquiries for claims statuses, additional development requests or eligibility, and various codes are processed.',
          items: []
        },
        {
          header: 'Functions',
          level: 'h4',
          items: [
            'Adjudication of Part A and Part B institutional claims',
            'FISS is a mainframe system Medicare Part A contractors use to process Medicare Part A and Part B institutional claims nationwide.',
            'Inquiries for claims statuses, additional development requests or eligibility, and various codes are processed.'
          ]
        },
        {
          header: 'Multi-Carrier System (MCS)',
          description:
            'MCS is a mainframe system that Medicare Part B carriers use to process Medicare Part B Claims nationwide. It processes claims for physician care, DME, and other outpatient services. Like its Part A counterpart, claims are entered, corrected, adjusted, or canceled. Inquiries for claims statuses, additional development requests or eligibility, and various codes are processed.',
          items: []
        },
        {
          header: 'Functions',
          level: 'h4',
          items: [
            'The MCS is the shared system that processes Medicare Part B claims for physician care and other outpatient services nationwide.',
            'It interfaces directly with the CWF.',
            'It meets CMS core requirements for processing Medicare Part B claims, including data collection and validation, claims control, pricing, adjudication, correspondence, online inquiry, file maintenance, reimbursement, and financial processing.'
          ]
        },
        {
          header: 'ViPS Medicare Shared System (VMS)',
          description:
            'VMS is the standard FFS system that processes Durable Medical Equipment Prosthetics, Orthotics, and Supplies (DMEPOS) claims for claim adjudication and payment. Inquiries for claims statuses, additional development requests or eligibility, and various codes are processed.',
          items: []
        },
        {
          header: 'Functions',
          level: 'h4',
          items: [
            'GDIT maintains the VMS software that processes DME claims through adjudication and payment and for Medical Review.',
            'The VMS claims processing system is the shared system that processes claims for physician and other practitioner services, prior authorization, diagnostic tests, ambulance services, DMEPOS, and other services/supplies not covered by Part A. It interfaces directly with the CWF for verification, validation, and payment authorization.'
          ]
        }
      ]
    },
    timeline: {
      description:
        'The timing for using Shared Systems varies by model. It’s best to reach out during model design, so they know of upcoming work.',
      items: [
        {
          header: 'Reach out to Donna Schmidt',
          description:
            'Early in the process, contact Donna Schmidt to learn more about using the Shared Systems for your model. You’ll get paired with a buddy to help finalize the operational aspects of the model.'
        },
        {
          header: 'Draft a Change Request (CR)',
          description: `Donna will help you write a CR and submit it through Enterprise Electronic Change Information Management Portal (ECHIMP). CRs can occur up to 2-3 years before the changes get implemented. You may use the Fee For Service Change Request Resource Center for additional resources about drafting your CR.

<link1>Go to Fee For Service Change Request Resource Center</link1>

There are two types of CRs:`,
          items: [
            '<bold>Analysis CR</bold> - This type of CR is recommended for model teams still figuring out what to do for the model. Essentially, this is a request to talk and collaborate with the Medicare Administrative Contractor (MAC) and Shared System Maintainers (SSM) on what will work for the model. It’s best to do an anaylsis CR a year before changes need made.',
            '<bold>Implementation CR</bold> - This type of CR is for implementing the necessary changes to support the model. It’s best to submit these at least six months prior to needing the changes made.'
          ]
        },
        {
          header: 'Development starts',
          description:
            'MACs and SSMs implement the changes specified in the CR to support the model.'
        },
        {
          header: 'Change is released',
          description: 'Releases happen quarterly.'
        }
      ]
    }
  }
};

const helpCategories: Record<ArticleCategories, string> = {
  [ArticleCategories.GETTING_STARTED]: 'Getting started',
  [ArticleCategories.IT_IMPLEMENTATION]: 'IT implementation',
  [ArticleCategories.MODEL_CONCEPT_AND_DESIGN]: 'Model concept and design'
};

const helpArticleNames: Record<HelpArticle, string> = {
  [HelpArticle.MODEL_PLAN_OVERVIEW]: 'Overview for adding a model',
  [HelpArticle.HIGH_LEVEL_PROJECT_PLAN]: 'High-Level Project Plan',
  [HelpArticle.SAMPLE_MODEL_PLAN]: 'Sample Model Plan',
  [HelpArticle.TWO_PAGER_MEETING]:
    'About 2-page concept papers and review meetings',
  [HelpArticle.SIX_PAGER_MEETING]: 'How to have a successful 6-pager meeting',
  [HelpArticle.UTILIZING_SOLUTIONS]:
    'Utilizing available operational solutions',
  [HelpArticle.MODEL_SOLUTION_IMPLEMENTATION]:
    'Model implementation and solution implementation',
  [HelpArticle.MODEL_SOLUTION_DESIGN]: 'Model design and solution design',
  [HelpArticle.PHASES_INVOLVED]:
    'Phases involved in creating IT and operational support for models'
};

const helpAndKnowledge = {
  heading: 'Help and Knowledge Center',
  home: 'Home',
  description:
    'Get help with the creation of your Model Plan and the implementation of operational solutions.',
  read: 'Read',
  all: 'All help articles',
  helpCategories,
  helpArticleNames,
  instructions:
    'Use the articles below to help get started with your Model Plan and IT implementation.',
  gettingStartedInstructions:
    'Use these articles to help you get started with the creation of your Model Plan.',
  itImplementationInstructions:
    'Use these articles to better understand what’s involved in your model to IT implementation.',
  close: 'Close tab',
  relatedHelp: 'Related help articles',
  relatedDescription:
    'Below are some additional help articles that you may find useful.',
  addtionalResources: 'Additional resources',
  viewAllRelated: 'View all help articles',
  operationalSolutions: 'Operational solutions',
  operationalSolutionsInfo:
    'Learn about the CMS systems, data sources, IT tools, and other services that are available to assist with your Model Plans.',
  viewAllButton: 'View all operational solutions',
  learnMore: 'Learn more',
  browseCategories: 'Browse solutions by category',
  contact: 'Point of contact',
  aboutSolution: 'About this solution',
  aboutSolutionAriaLabel: 'Click to learn more about this solution:',
  pageInfo: '{{-pageStart}} of {{-totalPages}} articles',
  resultsInfo:
    'Showing {{-resultsNum}} of {{-resultsMax}} operational solutions',
  queryResultsInfo:
    'Showing {{-resultsNum}} operational solution{{-plural}} for ',
  browseAll: 'Browse all help articles',
  viewGettingStarted: 'View getting started articles',
  viewITImplementation: 'View IT implementation articles',
  noResults: {
    header: 'There are no operational solutions that match your search.',
    content:
      'Please double-check your search and try again. If you’re searching for a solution that you believe should be a part of MINT, please contact the MINT Team at '
  },
  navigation: {
    about: 'About this solution',
    timeline: 'Timeline',
    'points-of-contact': 'Points of contact'
  },
  backToSolutions: 'Back to solutions',
  moreContacts: 'More points of contact',
  systemOwner: 'System owner',
  contractors: 'Contractors',
  gatheringInfoAlert: {
    header: 'We’re still gathering information about ',
    description:
      'In the meantime, contact {{-user}} at <emailLink>{{-email}}</emailLink>.',
    descriptionTeam:
      'In the meantime, contact the {{-user}} at <emailLink>{{-email}}</emailLink>.',
    description2: 'if you have any questions.'
  },

  categories: solutionCategories,
  subCategories: solutionSubCategories,
  itLeadInfo:
    'If your model has an IT lead, please make sure you work with them when expressing interest in solutions.',
  solutions
};

export default helpAndKnowledge;
