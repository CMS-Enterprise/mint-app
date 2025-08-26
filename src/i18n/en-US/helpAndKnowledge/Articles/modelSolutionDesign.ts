const modelSolutionDesign = {
  title: 'Model design and solution design',
  description:
    'This is the first phase in obtaining operational support for models. This phase kicks off work within MINT, assembles the team, and identifies all of the IT systems, data, operational solutions, and contracts needed to support the model.',
  summaryBox: {
    copy: 'Activities involved',
    items: [
      'Add your model to MINT and start a Model Plan',
      'Assemble the IT and operational team',
      'Draft a model-to-operations matrix (MTO) and identify the IT solutions for the model’s operational needs'
    ]
  },
  startModelPlan: {
    heading: '1.  Add your model to MINT and start a Model Plan',
    purpose: 'Purpose',
    purposeDescription:
      'To provide BSG with an understanding of the model needs so they can help determine the necessary operational solutions for the model.',
    when: 'When',
    whenDescription:
      'The model team may add their model to MINT as early as they wish, but should at least begin their Model Plan shortly after they’ve completed their 2-page concept document.',
    activities: {
      heading: 'Activities',
      items: [
        {
          heading: 'Start a Model Plan',
          description: `Once a concept paper has been written, the Model Lead (or other model team member) will add their model in MINT and start filling out the Model Plan form. Other team members may collaborate on the Model Plan and the operational needs of the model.
            
            <link1>Add a new model to MINT<iconForward /></link1>`
        },
        {
          heading: 'Upload relevant documents',
          description: `Add documents such as your 2- and 6-page concept papers, draft ICIP, market research, presentations, etc. These will provide BSG and/or the IT Lead helpful background.`
        },
        {
          heading: 'Make time to work with BSG during model design',
          description:
            'Operational planning for models is a very iterative process so collaboration is key. BSG will assign an IT Lead to most models, and can offer additional assistance to model teams as needed.'
        }
      ]
    },
    outcomes: {
      heading: 'Outcomes',
      description: 'These activities produce the following outcomes:',
      items: [
        'The creation of a Model Plan that identifies the high-level operational requirements for your model.',
        'Provides BSG with enough information to start assisting with the model and implementation requirements.',
        'Project Management and IT subject matter experts are identified to work with the model team to plan, execute, and manage the IT and operational implementation for the model, including drafting and maintaining the model’s MTO.'
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
            'An IT Lead is a member of BSG that will work closely with the model team to orchestrate the implementation of all the IT and operations needed for a model. Other organizations might refer to this role as an integrator. The IT Lead will be responsible for drafting and maintaining the model-to-operations matrix (MTO) in MINT.'
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
    heading:
      '3. Draft a model-to-operations matrix (MTO) and identify the IT solutions for the model’s operational needs',
    purpose: 'Purpose',
    purposeDescription:
      'To identify the systems, data, and operational contracts needed to support a model. This step should identify the model milestones and functions needed for the model as well as the solutions and IT systems that will be used to implement them.',
    when: 'When',
    whenDescription:
      'The operational needs identification and creation of the MTO should begin as early as possible, but at least as soon as the model team:',
    whenItems: [
      'Starts developing the Innovation Center Investment Proposal (ICIP) after approval by the Portfolio Management Committee (PMC) and/or',
      'Begins developing a Notice of Proposed Rulemaking (NPRM). Ideally, the operational needs identification occurs in parallel with the ICIP / NPRM development.'
    ],
    whenDescription2:
      'Identifying operational and IT needs early allows the IT Lead and BSG team to identify the most effective and efficient operational support strategies. As the model design becomes clearer, the operational strategy should also increase in precision.',
    activities: {
      heading: 'Activities',
      items: [
        {
          heading: 'Iterate and complete the Model Plan',
          description:
            'The model team should keep their Model Plan as up to date as possible, especially date related changes. As they answer questions within the Model Plan, milestones are suggested within the MTO. '
        },
        {
          heading:
            'Draft the MTO and select the necessary solutions and IT systems for the model’s milestones',
          description: `Within the MTO, the Model Lead and IT Lead will work together to select the solutions and IT systems that will be used to implement the model, associating them with the identified milestones.
                        
            <link1>Learn more about creating a model-to-operations matrix (MTO)<iconForward /></link1>`
        },
        {
          heading:
            'Understand and plan for the data needs of the model and complete the data exchange approach',
          description: `BSG will meet with model teams to understand the data the model will be collecting. For example: Models may choose to track participation in the model (the participants, providers, or beneficiaries). You will be asked to produce participation files in a specified format to be loaded into CMMI's central data repository the <ml1>CMMI Analysis and Management System (AMS)</ml1>.
          <br />
          <br />
            This model data will be shared with <ml1>AMS</ml1>, <ml2>QPP</ml2>, and ResDAC. Data will be made available for researchers in ResDAC after the first quarter of operations if it is ready at that point in time.

            <link2>Learn more about the data exchange approach
            <iconForward /></link2>`
        }
      ]
    },
    outcomes: {
      heading: 'Outcomes',
      description: 'These activities produce the following outcomes:',
      items: [
        'Milestones for the model are identified.',
        'Solutions and IT systems are identified for meeting the model milestones and needs.',
        'Operational and data support for the model is identified.',
        'A data exchange approach is completed.',
        'The IT Lead drafts an MTO for the model.',
        'Leadership and other interested parties are able to access the data exchange approach and MTO and review added model milestones and operational solutions.'
      ]
    }
  }
};

export default modelSolutionDesign;
