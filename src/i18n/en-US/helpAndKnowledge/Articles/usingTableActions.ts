const usingTableActions = {
  title: 'Using the table actions area',
  breadcrumb: 'Using the table actions area',
  description:
    'The table actions area is present above the main model-to-operations matrix (MTO) content views in MINT, the milestone table and the solutions and IT systems table. It offers a variety of actions to browse content and add content to your MTO.',
  altText: 'A screenshot of the table actions area.',
  caption:
    'Image caption: A screenshot of the table actions area visible at the top of the main MTO table views.',
  milestones: {
    title: 'Milestones',
    description:
      'A milestone is a key function or requirement for a model. Work for a milestone needs to be completed or enabled before a model can go live. MINT’s MTO feature offers two key milestone capabilities: ',
    list: [
      'The MINT milestone library contains a set of common model milestones that can be quickly added to an MTO.',
      'MINT also offers the capability to create custom milestones, allowing for any unique characteristics of individual models.'
    ],
    addingMilestonesFromLibrary: {
      title: 'Adding milestones from the milestone library',
      description:
        'The milestone library houses all of the common milestones contained in MINT. Common milestones are the milestones, activities, or functions that often appear in a model’s operational plan or MTO. To view all of the common model milestones included in MINT, navigate to the table actions area and click the button labeled “Add milestones from library”. Doing so will open the MINT milestone library, allowing you to learn more about MINT’s common milestones and quickly add them to your MTO.',
      usingMilestoneLibrary: '<link1>Using the milestone library<link1>'
    },
    addingCustomMilestone: {
      title: 'Adding a custom milestone',
      description:
        'MINT encourages users to leverage the common milestones available in the milestone library, but the unique needs of individual models often necessitate the creation of custom milestones for a given model. If the MINT milestone library does not offer the model milestone you need, you may add a custom milestone. To do so from the table actions area, click the button labeled “or, create a custom milestone”. This will open a screen that will allow you to input basic details about your custom milestone and add it to your MTO.',
      howToAddCustomMilestone: '<link1>How to add a custom milestone</link1>'
    }
  },
  categories: {
    title: 'Categories',
    description:
      'Categories are an easy way for IT Leads to arrange milestones into functional groups or model phases. This can make the MTO more easily digestible for other MINT users and can help organize milestones in a more chronological manner according to operational phase. There are two kinds of categories:',
    list: [
      {
        point: 'Standard categories: ',
        text: 'standard categories are added to your MTO by adding the standard category template (read how to do this in the “Templates” section of this article) or by adding a common milestone from the milestone library which will add the corresponding standard category.'
      },
      {
        point: 'Custom categories: ',
        text: 'custom categories are specific to an individual model’s MTO. Users can add a custom category from the table actions area by following the steps below.'
      }
    ],
    step1: {
      title: 'Navigate to your model’s MTO',
      description:
        'From the model collaboration area, locate the card for the “Model-to-operations matrix” and click on the “Go to matrix” button to navigate to the MTO for your model.',
      altText: 'A screenshot of the model collaboration area',
      caption:
        'Image caption: A screenshot of the model collaboration area for a model called Rural Health Enablement Model which shows the collaboration area cards for “Model Plan”, “Data exchange approach”, and “Model-to-operations matrix”.'
    },
    step2: {
      title: 'Locate the table actions area',
      description:
        'If you have already started your MTO, you will find the “Table actions” area below the page header and above the main MTO table.',
      altText: 'A screenshot of the table actions area.',
      caption:
        'Image caption: A screenshot of the table actions area visible at the top of the main MTO table views.'
    },
    step3: {
      title: 'Click to add a custom category',
      description:
        'Locate the “Templates and categories” section of the table actions area and click the button at the bottom labeled “or, create a custom category”. This will open a screen which will allow you to input the details of your custom category.'
    },
    step4: {
      title: 'Add information about your custom category',
      description: 'Complete the required fields in the custom category form:',
      list: [
        {
          point: 'Primary category: ',
          text: 'Selecting a primary category will add your new category as a sub-category. If you are adding a new primary category, you can choose “None”.'
        },
        {
          point: 'Title: ',
          text: 'the name of your new category, which will be displayed on the category’s row in your MTO’s milestone table.'
        }
      ],
      altText:
        'A screenshot of the form that allows a user to add a new category.',
      caption:
        'Image caption: A screenshot of the form that allows a user to add a new category. This includes the fields for category title and setting a primary category.'
    },
    step5: {
      title: 'Save your new category',
      description:
        'Once you have completed all fields in the form, click the “Add category” button. Once you do so, your category will be visible in the “Milestones” tab of your MTO. If at any time you change your mind, you may click the “Cancel” button or the X icon in the top right corner to close the pop-up without adding a new category.'
    }
  },
  solutionsAndItSystems: {
    title: 'Solutions and IT systems',
    description1:
      'Solutions are IT systems, contracts, CMS groups and teams, and other methods to implement milestones. IT Leads will use their breadth of expertise to add solutions to the MTO and specify which milestone(s) they will help to accomplish. Like milestones, MINT offers two ways of adding a solution to an MTO: ',
    list: [
      'The MINT solution library houses a set of information about commonly used IT systems and other solutions, enabling IT leads to quickly add them to an MTO or associate them with a milestone.',
      'MINT also allows users to create custom solutions, helpful in cases where a needed system is not included in MINT or when a model is using a bespoke solution not commonly used by other models.'
    ],
    description2:
      'Users can accomplish both of these options from the table actions area.',
    summary:
      'You can also view information about MINT’s available solutions and IT systems in the <link1>Operational solutions area of the Help Center</link1>. However, you may not add solutions to an MTO from the Help Center. <br/> When IT Leads add solutions to an MTO, the points of contact for the chosen IT system or solution will receive an automatic notification email from MINT which includes a link to read about the model that plans to use their system or solution.',
    browsingSolutionLibrary: {
      title: 'Browsing the solution library',
      description:
        'The MINT solution library contains a variety of IT systems, contracts, CMS groups or teams, and other solutions often used to implement a model. While not comprehensive of all the possible solutions, the MINT solution library offers many that often appear in a model’s operational plan or MTO. To view all of the solutions and IT systems included in MINT, navigate to the table actions area and click the button labeled “Add solutions from library”. Doing so will open the MINT solution library, allowing you to learn more about available solutions and IT systems and quickly add them to your MTO.',
      usingSolutionLibrary: '<link1>Using the solution library</link1>'
    },
    addingCustomSolution: {
      title: 'Adding a custom solution',
      description:
        'When possible, MINT encourages users to add solutions to an MTO via the solution library. However, MINT’s solution library does not currently offer a comprehensive list of all IT systems, contracts, and other operational solutions used for models. Because of this and the unique needs of individual models, IT Leads may need to create custom solutions for a given model. If the MINT solution library does not offer the solution or IT system you need, you may add a custom solution. To do so from the table actions area, click the button labeled “or, create a custom solution”. This will open a screen that will allow you to input basic details about your custom solution and add it to your MTO.',
      howToAddCustomSolution: '<link1>How to add a custom solution</link1>'
    }
  },
  templates: {
    title: 'Templates',
    description1:
      'Templates are combinations of milestones, categories, and solutions that give users a specific MTO starting point or set of content to add to an existing MTO. Template content is often specific to a particular type of model or a particular model characteristic.',
    description2:
      'MINT currently offers one template (“Standard categories”). You may add it to your MTO from the table actions area by following the steps below:',
    steps: [
      {
        title: 'Navigate to your model’s MTO',
        description:
          'From the model collaboration area, locate the card for the “Model-to-operations matrix” and click on the “Go to matrix” button to navigate to the MTO for your model.',
        altText: 'A screenshot of the model collaboration area.',
        caption:
          'Image caption: A screenshot of the model collaboration area for a model called Rural Health Enablement Model which shows the collaboration area cards for “Model Plan”, “Data exchange approach”, and “Model-to-operations matrix”.'
      },
      {
        title: 'Locate the table actions area',
        description:
          'If you have already started your MTO, you will find the “Table actions” area below the page header and above the main MTO table.',
        altText: 'A screenshot of the table actions area.',
        caption:
          'Image caption: A screenshot of the table actions area visible at the top of the main MTO table views.'
      },
      {
        title: 'Click to add a template',
        description:
          'Locate the “Templates and categories” section of the table actions area and click the button in the middle labeled “Add this template”. This will open a screen asking you to confirm that you wish to add this template.'
      },
      {
        title: 'Confirm adding your template',
        description:
          'Click the button labeled “Add template”. You will then see the new items from the template on your main MTO tables. If at any time you change your mind, you may click the “Don’t add template” button or the X icon in the top right corner to close the pop-up without adding the template.',
        altText: 'A screenshot of the confirmation pop-up.',
        caption:
          'Image caption: A screenshot of the confirmation pop-up when adding the “Standard categories” template to an MTO.'
      }
    ]
  }
};
export default usingTableActions;
