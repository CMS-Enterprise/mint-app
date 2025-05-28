const addCustomMilestone = {
  title: 'How to add a custom milestone',
  description:
    'MINT encourages users to leverage the common milestones available in the milestone library, but the unique needs of individual models often necessitate the creation of custom milestones for a given model. Custom milestones and IT milestones allow IT Leads to identify and document system-specific milestones that align with the operational needs of the model. IT Leads can create these custom milestones directly within the model-to-Operations matrix (MTO) to ensure their model’s operational requirements are fully captured.',
  step1: {
    heading: 'Navigate to your model’s MTO',
    altText:
      'A screenshot of the model collaboration area for a model called Rural Health Enablement Model which shows the collaboration area cards for “Model Plan”, “Data exchange approach”, and “Model-to-operations matrix”',
    text: 'From the model collaboration area, locate the card for the “Model-to-operations matrix” and click on the “Go to matrix” button to navigate to the MTO for your model.',
    caption:
      'Image caption: A screenshot of the model collaboration area for a model called Rural Health Enablement Model which shows the collaboration area cards for “Model Plan”, “Data exchange approach”, and “Model-to-operations matrix”.'
  },
  step2: {
    heading: 'Locate the table actions area',
    altText:
      'A screenshot of the table actions area visible at the top of the main MTO table views',
    text: 'If you have already started your MTO, you will find the “Table actions” area below the page header and above the main MTO table.',
    caption:
      'Image caption: A screenshot of the table actions area visible at the top of the main MTO table views.'
  },
  step3: {
    heading: 'Click create a custom milestone',
    text: 'In the “Milestones” section of the table actions area, click the button labeled “or, create a custom milestone”. This button will open a form, allowing you to input content for your custom milestone.'
  },
  step4: {
    heading: 'Complete the content in the form',
    altText:
      'A screenshot of the form that allows a user to add a custom milestone.',
    text: 'The new milestone form will ask you to complete the following fields:',
    list: [
      '<bold>Primary category:</bold> the main milestone category that this milestone fits within. You may later create a new category if your MTO does not currently have one that fits your new milestone. There is also an “Uncategorized” primary category.',
      '<bold>Sub-category:</bold> the category within the primary category that your milestone fits within. You may later create a new sub-category if this category in your MTO does not currently have a sub-category that fits your new milestone. For every primary category, there is also an “Uncategorized” sub-category.',
      '<bold>Milestone title:</bold> a concise description of your milestone. Try to keep these brief and understandable.'
    ],
    caption:
      'Image caption: A screenshot of the form that allows a user to add a custom milestone.'
  },
  step5: {
    heading: 'Click “Add milestone”',
    text: 'Once you have completed all fields in the form, click the “Add milestone” button. Once you do so, your milestone will be visible in the “Milestones” tab of your MTO. If at any time you change your mind, you may click the “Cancel” button or the X icon in the top right corner to close the pop-up without adding a new milestone.'
  }
};
export default addCustomMilestone;
