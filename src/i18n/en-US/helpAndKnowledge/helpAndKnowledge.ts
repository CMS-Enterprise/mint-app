const solutionCategoryies = {
  applications: {
    header: 'Applications',
    description: 'Learn about the solutions available for applications.'
  },
  'communication-tools': {
    header: 'Communication tools',
    description: 'Learn about the solutions available for communication tools.'
  },
  'contractors-and-contract-vehicles': {
    header: 'Contractors and contract vehicles',
    description:
      'Learn about the solutions available for contractors and contract vehicles.'
  },
  'database-and-data-management': {
    header: 'Databases and data management',
    description:
      'Learn about the solutions available for databases and data management.'
  },
  'data-exchange': {
    header: 'Data exchange',
    description: 'Learn about the solutions available for data exchange.'
  },
  'data-reporting': {
    header: 'Data reporting',
    description: 'Learn about the solutions available for data reporting.'
  },
  'help-desks': {
    header: 'Help desks',
    description: 'Learn about the solutions available for help desks.'
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
    description: 'Learn about the solutions available for legal.'
  },
  'medicare-fee-for-service': {
    header: 'Medicare Fee-for-Service',
    description:
      'Learn about the solutions available for Medicare Fee-for-Service.'
  },
  quality: {
    header: 'Quality',
    description: 'Learn about the solutions available for quality.'
  }
};

const solutions = {
  innovation: {
    about: {
      description:
        'The CMS Innovation Center has a growing portfolio of models that test various payment and service delivery models and aim to achieve better care for patients, smarter spending, and healthier communities. The 4Innovation (4i) is a dynamic platform for CMS Innovation Center to onboard, support, and manage a variety of models and their participants to improve the quality of care and reduce service costs. The 4i platform is built using a modern scalable architecture, services, and solutions and operates in the CMS AWS Cloud enclave. The development strategy is based on a robust Human-Centered Design, User Experience Framework, and SAFe agile methodologies.',
      components: [
        {
          header: 'Product capabilties',
          itemHeaders: [
            'Agreement management',
            'Participant Management',
            'Benefits Enhancements',
            'Contact/User Management',
            'Reports & Analytics',
            'Data Hub & Data Exchange',
            'Knowledge Library',
            'Provider Overlap Check',
            'Beneficiary Overlap Check',
            'Beneficiary Lookup Feature',
            'Data Exchange with downstream systems',
            'Claim and Claim Line Feeds (CCLF)',
            'Identity & Access Management',
            'Application Programming Interface (API) Key Mgt',
            '4i Command Line Interface (CLI) Tool',
            'Tasks and Notifications'
          ],
          items: [
            'Create and manage ACO/Entity data, Change Request management, Sign and manage Participation Agreements and HIPAA Disclosure Forms to access sensitive data',
            'Add and manage participants, Real-time feedback on Participant Medicare enrollment checks for providers.',
            'Add and manage Benefit Enhancements and Payment mechanisms.',
            'Invitation-based access enables users to access the system and manage users in their Entities, elect a Designated Official (DO)',
            'View and download real-time reports related to agreements, participants, users’ access, and change requests for APM Entities',
            'Provide secure access to sensitive data such as claims and beneficiary reports,',
            'Publish and manage model and system content (FAQs/Documents/ Articles/ Events/Webinars)',
            'Allow entities to check the provider overlap within and across the models and resolve the overlap errors before submitting the records.',
            'Beneficiary overlap check across the models',
            'This feature will show the beneficiary alignment to Medicare Shared Savings Program, KCC, ACO REACH, VTAPM, or PCF if the beneficiary is in one of the above programs.',
            'Entity, Provider, and beneficiary data transmission for participating APMs to CMS systems like Shared Systems (FFS SSMs, MDM, IPC, and BCDA)',
            'CCLF are a package of 12 files containing claims and beneficiary data, sent monthly to entities participating in models under CM/CMMI',
            'Multi-factor authentication with Okta, Remote identity proofing with Experian, seamless integration with CMS IDM and EUA',
            'Request and manage API keys and monitor API usage statistics',
            'Allows authorized entities to automate the downloading of their sensitive data through a lightweight client CLI Tool using public and private API keys without having to login to the 4i/DataHub UI to retrieve files and reports.',
            'Show users Tasks and Notifications, the ability for users to manage and control the notifications'
          ]
        }
      ]
    }
  },
  accountableCare: {
    about: {
      description:
        'The Accountable Care Organization – Operational System (ACO-OS) is the system of record for 4 CMMI models (VT APM, ACO REACH, KCC, PCF) and the Medicare Shared Savings Program in CM. The system stores and exchanges ACO/entity demographic, provider, claim, and beneficiary data with ACOs/entities and CMS systems such as Master Data Management (MDM), Enterprise Data Lake (EDL), and Fee-for-Service (FFS) Shared System Maintainers (SSMs). The ACO-OS generates and shares the claims data each month for over 14,000,000 Medicare beneficiaries. The claims data and reports generated by ACO-OS are shared through the Data Hub feature in the 4i platform for CMMI models and ACO-Management System (ACO-MS) for Medicare Shared Savings Program.',
      components: [
        {
          header: 'Product capabilties',
          itemHeaders: [
            'Agreement management',
            'Participant Management',
            'Benefits Enhancements',
            'Contact/User Management',
            'Reports & Analytics',
            'Data Hub & Data Exchange',
            'Knowledge Library',
            'Provider Overlap Check',
            'Beneficiary Overlap Check',
            'Beneficiary Lookup Feature',
            'Data Exchange with downstream systems',
            'Claim and Claim Line Feeds (CCLF)',
            'Identity & Access Management',
            'Application Programming Interface (API) Key Mgt',
            '4i Command Line Interface (CLI) Tool',
            'Tasks and Notifications'
          ],
          items: [
            'Create and manage ACO/Entity data, Change Request management, Sign and manage Participation Agreements and HIPAA Disclosure Forms to access sensitive data',
            'Add and manage participants, Real-time feedback on Participant Medicare enrollment checks for providers.',
            'Add and manage Benefit Enhancements and Payment mechanisms.',
            'Invitation-based access enables users to access the system and manage users in their Entities, elect a Designated Official (DO)',
            'View and download real-time reports related to agreements, participants, users’ access, and change requests for APM Entities',
            'Provide secure access to sensitive data such as claims and beneficiary reports,',
            'Publish and manage model and system content (FAQs/Documents/ Articles/ Events/Webinars)',
            'Allow entities to check the provider overlap within and across the models and resolve the overlap errors before submitting the records.',
            'Beneficiary overlap check across the models',
            'This feature will show the beneficiary alignment to Medicare Shared Savings Program, KCC, ACO REACH, VTAPM, or PCF if the beneficiary is in one of the above programs.',
            'Entity, Provider, and beneficiary data transmission for participating APMs to CMS systems like Shared Systems (FFS SSMs, MDM, IPC, and BCDA)',
            'CCLF are a package of 12 files containing claims and beneficiary data, sent monthly to entities participating in models under CM/CMMI',
            'Multi-factor authentication with Okta, Remote identity proofing with Experian, seamless integration with CMS IDM and EUA',
            'Request and manage API keys and monitor API usage statistics',
            'Allows authorized entities to automate the downloading of their sensitive data through a lightweight client CLI Tool using public and private API keys without having to login to the 4i/DataHub UI to retrieve files and reports.',
            'Show users Tasks and Notifications, the ability for users to manage and control the notifications'
          ]
        }
      ]
    }
  },
  automatedPlanPayment: {
    about: {
      description: `The Automated Plan Payment System (APPS) calculates plan level monthly payment for Medicare Advantage, Program of All-Inclusive Care for the
      Elderly (PACE), Medicare- Medicaid Plans, section 1876 and 1833 cost-based Managed Care Organizations, Part D Prescription Drug Sponsors, and specific CMS Demonstration initiatives. APPS facilitates payments to the US Treasury via the Health Insurance General Ledger Accounting System (HIGLAS) in the Office of Financial Management (OFM). APPS stores plan company banking information so OFM and Treasury can disperse payments through Electronic Funds Transfer (EFT).`,
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
    }
  },
  centralizedDataExhange: {
    about: {
      description: `Enables CMMI-to-Participant Interoperability; and enables application integration with other CMS systems. The Centralized Data Exchange (CDX) serves as an IT capability that enables the Innovation Center (IC) models to send and receive data with internal and external model participants using Application Programming Interfaces (APIs). It provides an improved ability to send and receive ad hoc files with internal and external users that takes advantage of modern, cloud-based technologies with one, centralized file exchange.
      
CDX is to exchange files between authorized users. This is implemented through the concept of a shared drive where authorized users can upload files and give access to those files to other authorized users. All users have a Home folder containing a list of all the files and folders to which they have access. The home folder is the Users "default/root" folder and contains all the files and folders to which the current user has access.
    
The business function of CDX is a centralized data exchange to enable interoperability and provide center-wide data collection capabilities across CMMI. The exchange solution supports sending the right data, at the right time, sending the right amount, and referencing the right participants.`,
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
      description: 'Timeline desc'
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
    }
  },
  cmsBox: {
    about: {
      description:
        'CMS Box is a cloud content management tool that allows users to upload, download, edit, and share documents t​o one central place. Users can also ​access documents through the web or a mobile device without VPN and without compromising security. All CMS employees should have access by default. '
    }
  },
  cmsQualtrics: {
    about: {
      description:
        'CMS Qualtrics is a self-service tool for model teams to capture information (like a survey or application). All CMS users should be able to sign into CMS Qualtrics using their CMS user name and password.'
    }
  },
  cbosc: {
    about: {
      description:
        'The Consolidated Business Operations Support Center (CBOSC) contract provides IT and programmatic help desk inquiry support, help desk operations and Business Operations support for the Innovation Center Models, the Alternative Payment Model (APM) track of the Quality Payment Program (QPP) and CM. CBOSC manages intake, resolution and escalation of all inquiries related to Innovations and Shared Savings Program Business Operations centrally. Support is provided through Pre-Implementation, Post-Implementation, Operation, Reporting, and Information Support phases as models test innovative payment and service delivery models to reduce program expenditures while preserving or enhancing the quality of care furnished to individuals.'
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
        'Center For Medicare and Medicaid Innovation (CMMI) Expanded Data Feedback Reporting (eDFR) system will provide transparency to stakeholders including the primary care physicians participating in CMMI Alternative Payment Models (APM) in the form of feedback for healthcare being delivered from a utilization, cost, and quality perspective. The metrics will be calculated based on Medicare provider and claims data. The system will render the information visually on dashboards, and reports.',
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
    }
  },
  grantSolutions: {
    about: {
      description: `GrantSolutions (GS) is a tool used to manage grants from funding opportunity planning, through the issuance of awards, to grant closeout.

CMS currently utilizes GrantSolutions primarily for awarding, managing, and closing out grants. For some grant programs, CMS utilizes the GS Application Review Module (ARM) for the required merit review of applications.
    
CMS also utilizes the GrantSolutions Recipient Insight (RI) tool which applies artificial intelligence, machine learning, and other emerging technologies to collect information from 750,000 organizations contained in seven different public databases. RI analyzes trends and identifies warning signs in the data. This data is presented through key data in actionable dashboards highlighting critical information for conducting risk assessment of applicants and recipients and identify reduce fraud, waste, and abuse.`
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
    }
  },
  healthDataReporting: {
    about: {
      description: `Health Data Reporting (HDR) is a configurable, Innovation Center-wide solution that supports the collection and validation of health-related data for analysis by CMMI models. HDR is part of the Innovation Support Platform (ISP) Suite of tools that include Expanded Data Feedback Reporting (eDFR) for business analysis and Centralized Data Exchange (CDX) for data exchange within the Suite and across CMS.

    HDR leverages CMS’ Enterprise Portal and CMMI’s IC Portlet Services for secure access and a standardized look and feel.
    
    HDR’s Configuration Management allows model teams to define and modify performance and submission periods, change data elements to be collected across performance periods, and manage and monitor submissions.`
    }
  },
  healthPlanManagement: {
    about: {
      description: `The Centers for Medicare & Medicaid Services' (CMS) Health Plan Management System (HPMS) is a web-enabled information system that serves a critical role in the ongoing operations of the Medicare Advantage (MA) and Part D programs.

    HPMS is a full-service website where health and drug plans, plan consultants, third-party vendors, and pharmaceutical manufacturers can work with CMS to fulfill the plan enrollment and compliance requirements of the Medicare Advantage (MA) and Prescription Drug (Part D) programs.
    
    Health Plan Management System, all health insurance companies participating in the MAPD program use this interface to communicate with CM for their contracting, actuarial, coverage, marketing, and enrollment in the MA and Part D programs.`
    }
  },
  innovationPayment: {
    about: {
      description:
        'The Innovation Payment Contractor (IPC) assists CMMI in making payments to eligible participants in multiple tests of Models of care and program innovations to improve quality and value-based care.'
    }
  },
  integratedDataRepository: {
    about: {
      description: `The Integrated Data Repository (IDR) is a multi-platform and high-volume data warehouse comprising integrated views of data across Medicare Parts A, B, C, and D, Beneficiary Entitlement, Enrollment and Utilization data. Provider reference information, Drug data, Contracts for Plans, and Medicaid and Children’s Health Insurance Program (CHIP).

    The data in the IDR is leveraged by various components across the agency to facilitate investigative and litigious efforts focused on fighting Medicare and Medicaid fraud, waste and abuse. Users of the IDR leverage the robust suite of Enterprise BI tools made available to them to conduct in-depth analysis of risk adjustment policies, Medicare-Medicaid program comparisons, payment models, and prescription drug cost trends, among many other areas of importance.`
    }
  },
  learningAndDiffusion: {
    about: {
      description:
        'The Learning and Diffusion Group (LDG) is a team within CMMI that facilitates learning within models and disseminates the lessons learned across models so that participants can benefit from the experiences of other models. LDG has two divisions: the Division of Model Learning Systems (DMLS) and the Division of Analysis and Networks (DAN). '
    }
  },
  legalVertical: {
    about: {
      description: `The mission of the Legal Vertical is to facilitate an effective and coordinated working relationship between CMMI and Office of General Council (OGC), the legal counsel to CMMI, and to provide an internal resource on legal issues.

    To achieve this mission, the Legal Vertical provides technical assistance and support to CMMI; drafts governing documents and cross-cutting regulations; promotes consistency in addressing cross-cutting legal issues; and helps to identify and mitigate potential legal risks to CMMI.`
    }
  },
  masterDataManagement: {
    about: {
      description: `Master Data Management (MDM) at CMS produces integrated and harmonized Beneficiary and Provider data from various Medicare and Medicaid systems. To create this master version, MDM uses identity resolution to recognize distinct entities (e.g., a provider, beneficiary, organization, or program) by matching similar records across multiple data sets. MDM provides flexible and easy access to provider and beneficiary data through extracts, web services, and APIs.

    MDM is an authoritative System of Reference that integrates and stores data from CMS operational Systems of Record. MDM data is considered as authoritative as the data in the source System of Record from which it is obtained.
    
    CMMI, in particular, uses MDM as a repository to store data to inform and resolve model overlaps (when necessary) for both aligned beneficiaries and participating providers among CMS payment models/demonstrations that are primarily shared savings-based models. This use of MDM for CMMI is a limited but critical role so that CMMI, CM, and Duals Office models have a single point of operational data ‘hub’ to resolve overlaps.
    
    MDM is one of CMS’s Enterprise Shared Services (ESS) that provides authoritative data integrated and consolidated from various source systems. MDM helps address business challenges by linking data across multiple sources for various business needs. MDM provides:
    Trusted identity resolution capability for CMS’ expanding catalog of Master Data sources
    Integration and consolidation of Master Data from numerous disparate data sources to create a consolidated, authoritative view of each entity
    Flexible and easy access to Master Data (e.g., near real-time web services, extracts for batch processing, APIs, and analytic capabilities).
    A platform for improved data quality and understanding
    A record of non-claims-based payments`
    }
  },
  measureInstrumentDS: {
    about: {
      description:
        'CMMI awarded a task order off of CCSQ’s Quality Measure Development and Analytic Support (QMDAS) contract and titled the task order the Measure Instrument Development and Support contract, or MIDS for short. MIDS is a quality measure contract that supports model teams’ development of de novo measures and re-specification of existing measures for use in CMMI’s Alternative Payment Models (APMs). The MIDS contract is used to support measuring and incentivizing quality in the Center’s healthcare delivery models, assisting models in their quality strategy and design of measures.'
    }
  },
  marx: {
    about: {
      description: `The Medicare Advantage (MA) & Prescription Drug (Part D) system maintains enrollment, payment, and premium data for Medicare beneficiary enrollments in Medicare Part C and D Plans. The Medicare Advantage (MA) & Prescription Drug (Part D) systems provide services to beneficiaries, Plans, and CMS. 

    Transaction Processing Plans submit batch files that contain enrollment, disenrollment, and various status update transactions to MARx. Using CMS business rules, MARx validates the transactions and accepts or rejects the submitted enrollments, disenrollment, or changes. Daily response files report the results of all transactions back to the plans. Other Medicare Modernization Act (MMA) systems also interact with MARx. Notifications from other systems, such as the Medicare Beneficiary Database (MBD), which report changes in beneficiary demographics, entitlement, health status, low-income subsidy status, etc. may affect beneficiary enrollment and payment to the Plans. 
    
    Payment Processing MARx calculates monthly Medicare payments for each Plan and generates payment adjustments when changes in membership and/or beneficiary health status occur. Monthly reports detail enrollment and payment information for the plans and CMS. Premium Processing MARx receives and processes transactions impacting Part C and Part D premiums, Medicare Part B Reduction, and Medicare Part C/D Plan enrollment status. Beneficiaries may elect to have their premiums withheld from their Social Security Administration (SSA) or Railroad Retirement Board (RRB) checks. MARx is responsible for interfacing with SSA or RRB to establish or terminate withholding and tracks expected withholding amounts. Once the withholding agency completes processing each transaction, a response is sent back to MARx informing CMS of the withholding agency's acceptance or rejection of each of the individual premium withholding requests, cancellations, statuses, and amounts. The withholding agency's acceptance or rejection of the transactions is communicated to the Plans. The Premium Withhold Accounting functionality was implemented to reconcile the withheld premium amounts. Based on reconciliation of the expected and actual premium amounts, the premium dollars to be included in a plan's payment are determined. 
    
    User Interface 
    The MARx application includes online processing capabilities. The MARx User Interface (UI) provides Plans and CMS the ability to view and update beneficiary, enrollment, payment, and premium information. `
    }
  },
  outlookMailbox: {
    about: {
      description:
        'Set up an email address through Outlook Mailbox, so all your model communications will funnel into a single place.'
    }
  },
  qualityVertical: {
    about: {
      description:
        'The Quality Vertical is responsible for developing and implementing the Center’s overall quality strategy and disseminating that information vertically. They do this by working with model teams as they develop and implement their model quality strategies. '
    }
  },
  rmada: {
    about: {
      description: `Research, Measurement, Assessment, Design, and Analysis (RMADA) Indefinite Delivery Indefinite Quantity 2 (IDIQ) umbrella contract, the Centers for Medicare & Medicaid Services (CMS) shall award task orders (TOs) for a wide range of analytic support and technical assistance activities that support models and demonstration programs created or derived under the auspices of the Patient Protection & Affordable Care Act (ACA), the Medicare Access and CHIP Reauthorization Act (MACRA), other non-ACA statutes, and future health reform legislation. Supporting all aspects of model design and operations (with the exception of information technology);
    Conducting program, data and environmental analyses
    Assisting with application development and review
    Monitoring model site implementations
    Designing and carrying out surveys and other primary data collection activities
    Obtaining and analyzing secondary data sources including data regarding Medicare, Medicaid, and the Children’s Health Insurance Program (CHIP) and data from private payer sources needed to support model design, operations and evaluations
    Reporting on formative and summative analyses
    Providing rapid cycle evaluation feedback to CMS and/or model participants
    Creating summative reports of annual and final program findings
    Assist in the development of program templates, tools, toolkits, and driver diagrams
    Support stakeholder engagement and training
    Provide data analysis/ integration support
    Assist in the development of program specific technical/policy resource guides and informational/ educational/ briefing materials
    Provide grant proposal reviews and summarization reports
    In addition to the aforementioned list of required tasks, the Contractor may be asked to work with CMS on matters pertaining to developing and implementing learning systems to support accelerated learning, improvement, and dissemination of promising practices.`
    }
  },
  ars: {
    about: {
      description:
        'The Salesforce Application Review and Scoring (ARS) allows model teams to track a panel’s review and scoring of the submitted applications to a participation agreement model.'
    }
  },
  salesforceConnect: {
    about: {
      description:
        'The Salesforce.com Connect Communities are configured applications that enable the exchange of information between model participants, model teams, and support contractors in a secure manner.'
    }
  },
  salesforceLOI: {
    about: {
      description:
        'The Salesforce Letter of Intent (LOI) is a website that allows model teams to collect information to gauge the level of industry interest in a participation agreement model.'
    }
  },
  salesforcePortal: {
    about: {
      description:
        'The Salesforce Project Officer Support Tool/Portal (POST/PORTAL) enables the collection of data to monitor the model and support model evaluation. It also enables interaction with awardees and participants and the sending of reports/data to those participants.'
    }
  },
  salesforceRequestApplication: {
    about: {
      description:
        'The Salesforce Request for Application (RFA) allows model teams to collect applications from organizations that want to participate in a participation agreement model.'
    }
  },
  sharedSystems: {
    about: {
      description: `The Shared Systems are a group of systems used to process traditional Medicare Fee-for-Service (FFS) claims for Part A, Part B, and Durable Medical Equipment (DME). 

    Beneficiaries visit a provider of Medicare services, and that provider files a claim with their Medicare Administrative Contractor (MAC). The MAC processes and pays the claim, and sends a remittance to advise the provider and a Medicare Summary Notice (MSN) to the beneficiary. There are many Centers and Offices that receive the Medicare legislation that determines policies; those become change requests implemented through quarterly releases by the Shared System Maintainers (SSM) and the MACs.
    
    The following systems are a part of Shared Systems:`
    }
  }
};

const helpAndKnowledge = {
  heading: 'Help and Knowledge Center',
  description:
    'Get help with the creation of your Model Plan and the implementation of IT solutions.',
  read: 'Read',
  gettingStarted: 'Getting started',
  itImplementation: 'IT implementation',
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
  operationalSolutions: 'Operational solutions',
  operationalSolutionsInfo:
    'Learn about the CMS systems, data sources, IT tools, and other services that are available to assist with your Model Plans.',
  viewAllButton: 'View all operational solutions',
  learnMore: 'Learn more',
  browseCategories: 'Browse solutions by category',
  contact: 'Point of contact',
  aboutSolution: 'About this solution',
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

  categories: solutionCategoryies,
  solutions
};

export default helpAndKnowledge;
