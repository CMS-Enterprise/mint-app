import { title } from 'process';

const creatingMtoMatrix = {
  title: 'Creating your Model-to-operations matrix (MTO) in MINT',
  breadcrumb: 'Creating your MTO in MINT',
  description:
    'Learn more about the Model-to-operations matrix, what it’s for, and how to create and maintain an MTO in MINT.',
  whatIsMTO: 'What is an MTO?',
  whatIsMTODescription:
    'The Model-to-operations matrix is the main IT lead deliverable. It is usually started as soon as an IT lead is assigned to a model, shortly before model clearance, when model intake (and the model’s MINT Model Plan) are significantly completed and the model has a good chance of being cleared. A solid draft of an MTO is usually expected within 20 days of beginning to engage with a model team, though IT leads should expect to continue updating the MTO and its statuses as work on the operational aspects of the model progresses. The Model-to-operations matrix documents a list of functions or milestones that a model needs to accomplish in order to go live and be successful, the IT systems or solutions used to implement those milestones, and when work for individual milestones must be completed by.',
  whyCreateMTO: 'Why create an MTO?',
  whyCreateMTODescription:
    'MTOs help to make sense of and document the very complex set of systems, contracts, and activities used to implement a model. It helps keep track of the status of a variety of moving parts, and allows all interested parties to stay informed about model implementation progress. In the past, MTOs have been maintained by individual IT Leads as Powerpoint or Excel files, but MINT allows for more streamlined setup and update capabilities for IT Leads, as well as improved self-service access for all other interested parties.',
  editAccess: 'Edit access',
  editAccessDescription: 'Users with edit access can:',
  editAccessList: [
    'Create and update MTOs for any model they have access to',
    'Add and remove common milestones and IT systems or solutions to or from an MTO',
    'Create custom milestones, categories, and solutions',
    'Update the status of an MTO',
    'Share an MTO with colleagues or export an MTO',
    'Use MINT discussions to discuss the MTO and other aspects of a model'
  ],
  readView: 'Read view',
  readViewDescription: 'Any MINT users can access a read view of MTOs and can:',
  readViewList: [
    'View all content (milestones, solutions, statuses, categories, etc.) for any model’s MTO',
    'Share an MTO with colleagues or export an MTO',
    'Use MINT discussions to ask questions of the model team'
  ],
  whoCreatesMTO: 'Who creates and uses an MTO?',
  whoCreatesMTODescription:
    'IT Leads are responsible for creating the MTO and keeping it up-to-date. Model team members are able to make updates to the MTO if they have that working arrangement with their IT Lead and work closely with or keep their IT Lead informed. MINT Team users (also known as Assessment Team) are also able to edit MTOs if needed, and are available to help IT leads.',
  itLead: 'IT Lead',
  itLeadDescription:
    'IT Leads have edit access to models that they have been assigned to (and read view access to other models) and will:',
  itLeadList: [
    'Create and maintain a draft MTO',
    'Make time with the model team to regularly share the MTO and the status of the milestones and solutions listed',
    'Act as a liaison to IT system teams and Product Owners to ensure that work is moving forward for onboarding to a system, contract, or other solution.'
  ],
  modelTeam: 'Model team',
  modelTeamDescription:
    'Model teams (including Model Leads and workstream leads) have edit access to models that they are team members of (and read view access to other models) and will:',
  modelTeamList: [
    'Review the MTO in MINT as necessary',
    'Meet regularly with the IT Lead to review MTO status',
    'Work with the IT Lead to ensure content in the MTO is correct',
    'Take responsibility for and update any tasks or activities assigned to them in the MTO'
  ],
  partsOfMTO: 'Parts of an MTO',
  partsOfMTODescription:
    'An MTO in MINT is made up of a variety of different pieces, all of which help communicate different aspects of a model’s move towards becoming an active and operational model.',
  milestones: 'Milestones',
  milestonesDescription:
    'A milestone is a key function or requirement for a model. Work for a milestone needs to be completed or enabled before a model can go live. MINT’s MTO feature offers two milestone capabilities. The MINT milestone library contains a set of common model milestones that can be quickly added to an MTO. MINT also offers the capability to create custom milestones, allowing for any unique characteristics of individual models.',
  categories: 'Categories',
  categoriesDescription:
    'Categories are an easy way for IT leads to arrange milestones into functional groups or model phases. This can make the MTO more easily digestible for other MINT users and can help organize milestones in a more chronological manner according to operational phase.',
  itSystems: 'IT systems and solutions',
  itSystemsDescription:
    'Solutions are IT systems, contracts, CMS groups and teams, and other methods to implement milestones. IT leads will use their breadth of expertise to add solutions to the MTO and specify which milestone(s) they will help to accomplish. Like milestones, MINT offers two ways of adding a solution to an MTO. The MINT solution library houses a set of information about commonly used IT systems and other solutions, enabling IT leads to quickly add them to an MTO or associate them with a milestone. MINT also allows users to create custom solutions, helpful in cases where a needed system is not included in MINT or when a model is using a bespoke solution not commonly used by other models. You can also view MINT’s available IT systems and solutions in the <link1>Operational solutions area of the Help Center</link1>. When IT Leads add solutions to an MTO, the points of contact for the chosen IT system or solution will receive an automatic notification email from MINT which includes a link to read about the model that plans to use their system or solution. ',
  templates: 'Templates',
  templatesDescription:
    'Templates are combinations of milestones, categories, and solutions that give users a specific MTO starting point or set of content to add to an existing MTO. Template content is often specific to a particular type of model or a particular model characteristic.',
  recommendProcess:
    'Recommended high-level process for MTOs and solution implementation',
  recommendProcessList: [
    {
      title: 'Create Model Plan in MINT',
      description:
        'The Model Lead and Model Team work to fill out the Model Plan in MINT as best they can, with assistance as needed from the MINT Team (formerly known as the Model Intake Team). They should also complete any additional Model Intake activities that are necessary.'
    },
    {
      title: 'IT Lead is assigned to the model',
      description:
        'The IT Lead should review all materials created by the Model Team, including but not limited to: the Model Plan in MINT, 2-page and 6-page concept papers, and the ICIP or draft ICIP.'
    },
    {
      title: 'Begin drafting MTO',
      description:
        'Using all that was learned in step 2, the IT Lead should begin an MTO in MINT. A solid draft of an MTO is usually expected within 20 days of beginning to engage with a model team, though IT leads should expect to continue updating the MTO and its statuses as work on the operational aspects of the model progresses. '
    },
    {
      title: 'Share MTO with Model Team',
      description:
        'Once a solid draft of the MTO is complete, the IT Lead should meet with the Model Team to share the draft MTO and discuss the details and plan for moving forward. This would also be a good time to establish a plan for a regular cadence of MTO updates, whether during an existing meeting series, or as a new set of meetings. '
    },
    {
      title: '(Optional) Mark MTO as Ready for Review',
      description:
        'Once the model’s draft MTO is generally agreed upon by the IT Lead and Model Team, set the MTO status to "Ready for review" to signal to other interested parties that the main content (milestones, solutions, etc.) is fairly well set and is open to any comments or feedback. Even if the MTO is set to "Ready for review", IT Leads should still expect to update the implementation status of individual items as work progresses.'
    },
    {
      title: 'Begin discussions with IT system and solution teams',
      description:
        'IT Leads (or other agreed upon responsible party) should begin reaching out to IT system and solution teams identified in the MTO to begin or learn more about any necessary onboarding processes. In step 3 (above) and after, as IT Leads add solutions to an MTO, the points of contact for the chosen IT system or solution will receive an automatic notification email from MINT. These emails include a link to read about the model, and can be a good opportunity to begin conversations with the IT system or solution team. '
    },
    {
      title: 'Continue to update the MTO in MINT',
      description:
        'As work progresses, IT Leads should continue to use the MINT MTO feature to update the status of individual milestones as well as IT systems and solutions. To asynchronously update any interested parties, use the Share feature in MINT to share a link to the model’s MTO with any colleagues or interested individuals at CMS.'
    },
    {
      title: 'Final content update',
      description:
        'When the model goes Active (or is paused or ends for another reason), IT Leads should do a final content update of the MTO, ensuring that all statuses, milestones, and solutions are accurate. This ensures that MINT can retain historical information about how a model went operational, potentially leading to efficiencies in the future.'
    }
  ],
  mtoTutorials: 'MTO tutorials',
  mtoTutorialsDescription:
    'Use the links below to access more specific details about how to use the MTO capabilities in MINT.',
  stillNeedHelp: 'Still need help?',
  stillNeedHelpDescription:
    'If you’d like to know more about the Model-to-operations capabilities in MINT, please feel free to reach out to the MINT team at <email>MINTTeam@cms.hhs.gov</email> or <slack>chat with us on Slack</slack>.'
};
export default creatingMtoMatrix;
