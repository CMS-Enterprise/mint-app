const modelSolutionDesign = {
  title: 'Model design and solution design',
  description:
    'This is the first phase in obtaining operational support for models. This phase kicks off work within MINT, assembles the team, and identifies all of the IT systems, data, and operational contracts needed to support the model.',
  summaryBox: {
    copy: 'Activities involved',
    items: [
      'Start a Model Plan',
      'Assemble the IT and operational team',
      'Identify the solutions for the model’s operational needs'
    ]
  },
  startModelPlan: {
    heading: '1. Start a Model Plan',
    purpose: 'Purpose',
    purposeDescription:
      'To provide BSG with an understanding of the model needs so they can help determine the necessary operational solutions for the model.',
    when: 'When',
    whenDescription:
      'The model team should begin their Model Plan after they’ve completed their 2-page concept document.',
    activities: {
      heading: 'Activities',
      items: [
        {
          heading: 'Start a Model Plan',
          description: `Once a concept paper has been written, the Model Lead (or other model team member) will create a Model Plan within MINT to collaborate on the operational needs of the model.
            
            <link1>Start a new Model Plan<iconForward /></link1>`
        },
        {
          heading: 'Upload relevant documents',
          description: `Upload relevant documents
            
            These will provide BSG and/or the IT Lead helpful background.`
        },
        {
          heading: 'Make time to work with BSG during model design',
          description:
            'Operational planning for models is a very iterative process so collaboration is key.'
        }
      ]
    },
    outcomes: {
      heading: 'Outcomes',
      description: 'These activities produce the following outcomes:',
      items: [
        'Model Plan that identifies the high-level operational requirements for your model; ',
        'Provides BSG with enough information to start assisting with the model',
        'Project Management and IT subject matter experts identified to work with the model team to plan, execute, and manage the IT and operational implementation for the CMMI model.'
      ]
    }
  },
  assembleTeam: {
    heading: '2. Assemble the IT and operational team',
    purpose: 'Purpose',
    purposeDescription:
      'To provide the model team with the necessary expertise to assist with completing the IT and operational projects.',
    when: 'When',
    whenDescription:
      'This happens after the Model Plan has been started in MINT.',
    activities: {
      heading: 'Activities',
      items: [
        {
          heading: 'Assign an IT Lead',
          description:
            'An IT Lead is a member of BSG that will work closely with the Model Team to orchestrate the implementation of all the IT and operations needed for a model. Other organizations might refer to this role as an integrator.'
        },
        {
          heading: 'Collaborate with other SMEs as necessary',
          description:
            'Other SMEs may be brought in to help with other aspects of the operational and IT needs of the model.'
        }
      ]
    },
    outcomes: {
      heading: 'Outcomes',
      description: 'These activities produce the following outcomes:',
      items: [
        'IT Lead and other relevant SMEs are identified to work with the model team to plan, execute, and manage the IT and operational implementation for the model.'
      ]
    }
  },
  identifySolutions: {
    heading: '3.   Identify the solutions for the model’s operational needs',
    purpose: 'Purpose',
    purposeDescription:
      'To identify the systems, data, and operational contracts needed to support a model. This step should identify the breadth of system and operational needs for a model.',
    when: 'When',
    whenDescription:
      'The operational needs identification should begin as soon as the model team:',
    whenItems: [
      'Starts developing the Innovation Center Investment Proposal (ICIP) after approval by the Portfolio Management Committee (PMC) and/or',
      'Begins developing a Notice of Proposed Rulemaking (NPRM). Ideally, the operational needs identification occurs in parallel with the ICIP / NPRM development.'
    ],
    whenDescription2:
      'Identifying operational and IT needs early allows the model and BSG team to identify the most effective and efficient operational support strategies. As the model design becomes clearer, the operational strategy should also increase in precision.',
    activities: {
      heading: 'Activities',
      items: [
        {
          heading: 'Iterate and complete the Model Plan',
          description:
            'The model team should keep their Model Plan as up to date as possible, especially date related changes. As they answer questions within the Model Plan, operational needs are identified within the operational solutions and implementation status tracker. '
        },
        {
          heading:
            'Select the necessary solutions for the model’s operational needs',
          description:
            'Within the operational solutions and implementation status tracker, the Model Lead and IT Lead will work together to select the operational solutions the model will use, keeping the milestones in mind.'
        },
        {
          heading: 'Understand and plan for the data needs of the model',
          description: `BSG will meet with model teams to understand the data the model will be collecting. For example: Models may choose to track participation in the model (the participants, providers, or beneficiaries). You will be asked to produce participation files in a specified format to be loaded into CMMI's central data repository the APM Management System (AMS).
          
          This model data will be shared with AMS, QPP, and ResDAC. Data will be made available for researchers in ResDAC after the first quarter of operations if it is ready at that point in time.`
        }
      ]
    },
    outcomes: {
      heading: 'Outcomes',
      description: 'These activities produce the following outcomes:',
      items: [
        'Required operational needs for the model are identified.',
        'IT systems are identified for meeting the model needs.',
        'Operational and data support for the model is identified.'
      ]
    }
  }
};

export default modelSolutionDesign;
