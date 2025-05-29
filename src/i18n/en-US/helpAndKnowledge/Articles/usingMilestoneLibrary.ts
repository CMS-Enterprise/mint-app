const usingMilestoneLibrary = {
  title: 'Using the milestone library',
  breadcrumb: 'Using the milestone library',
  description:
    'The milestone library houses all of the common milestones contained in MINT. Common milestones are the milestones, activities, or functions that often appear in a model’s operational plan or model-to-operations matrix (MTO). These common milestones are offered in MINT to give IT Leads a faster way to get started drafting a MTO for a new model and help us to understand which milestones are most frequently used by models.',
  suggestedMilestones: {
    title: 'Suggested milestones',
    description:
      'As the model team fills out content in the Model Plan, MINT may suggest common milestones for you to add to your MTO. These milestones are suggested because they are often added to MTOs for models with similar circumstances and similar Model Plan answers.',
    altText: 'A screenshot of the milestone library.',
    caption:
      'Image caption: A screenshot of the milestone library showing suggested milestones.'
  },
  browsingAllAvailableMilestones: {
    title: 'Browsing all available milestones',
    description:
      'The MINT milestone library offers a variety of ways to browse the available common milestones. You can search, filter, and paginate through all the common milestones to find what you’re looking for.',
    altText: 'A screenshot of the milestone library.',
    caption:
      'Image caption: A screenshot of the milestone library showing all common milestones.',
    list: [
      {
        point: 'Searching',
        text: 'Use the search bar located below the page header area to narrow the list of milestones to those with your search keywords in the title or category. This capability is available for all milestones and for the filtered view labeled "Suggested milestones only". You may also choose to check the box labeled "Hide added milestones" to filter out milestones you have already added to your MTO.'
      },
      {
        point: 'Pagination',
        text: 'Use the pagination below the list of milestone cards to page through the available common milestones. You may also change the number of milestones displayed per page using the dropdown to the right of the pagination buttons. This capability is available for all milestones and for the filtered view labeled "Suggested milestones only".'
      }
    ]
  },
  addingMilestoneToMto: {
    title: 'Adding a milestone to your MTO',
    step1: {
      title: 'Navigate to the milestone library',
      description:
        'From the table actions area or the MTO empty state, click the button labeled "Add milestones from library". Visit either of the tutorials below to learn more about navigating to the milestone library.',
      link1: 'Using the table actions area',
      link2: 'Starting an MTO for a new model'
    },
    step2: {
      title: '(Optional) Click "About this milestone"',
      description:
        'From the milestone library, find the card for the milestone you want to add to your MTO. At the bottom of the card, click on the button labeled "About this milestone".  When you click this button, it will open a side panel that contains additional information about the milestone you are considering for your MTO, including: the title, category, description, a list of team members or roles often responsible for facilitating the completion of the work for this milestone, and a list of solutions that are commonly used to fulfill this milestone. You may add this milestone to your matrix by clicking the button labeled "Add to matrix". When you click this button, it will open a screen titled "Add a solution for this milestone?" which will allow you to optionally add a solution or solutions for this milestone to your MTO at the same time. You may click the X in the top left corner of the panel at any time to close the informational panel.',
      altText: 'A screenshot of the milestone information panel.',
      caption:
        'Image caption: A screenshot of the milestone information panel, showing details about a common milestone including category, description, roles that commonly facilitate work for this milestone, and common solutions.'
    },
    step3: {
      title: 'Click "Add to matrix"',
      description:
        'If you completed the optional step above, click the button on the milestone information panel labeled "Add to matrix". If you did not open the milestone information panel, browse the milestone library to find the card for the milestone you want to add to your MTO. At the bottom of the card, click on the button labeled "Add to matrix".  When you click the button for either option, it will open a screen titled "Add a solution for this milestone?" which will allow you to optionally add a solution or solutions for this milestone to your MTO at the same time. '
    },
    step4: {
      title: '(Optional) Add a solution to this milestone',
      description:
        'Complete the optional fields in the form to add a solution or solutions to this milestone at the same time you add the milestone:',
      list: [
        '<bold>Solutions:</bold> select from a list of solutions that are available in MINT. You may select multiple, and are encouraged to select all that apply.'
      ],
      altText:
        'A screenshot of the form to add solutions while adding a milestone.',
      caption:
        'Image caption: A screenshot of the form to add solutions while adding a milestone.'
    },
    step5: {
      title: 'Click "Add without solutions" or "Add with x solutions"',
      description:
        'If you have chosen to add the milestone without adding solutions, click the button labeled "Add without solutions". If you have chosen to add your milestone with solutions, click the button labeled "Add with x solutions", with x being the number of solutions you have selected from the list. If at any time you change your mind, you may click the "Cancel" button or the X icon in the top right corner to close the pop-up without adding the milestone to your MTO.'
    }
  }
};
export default usingMilestoneLibrary;
