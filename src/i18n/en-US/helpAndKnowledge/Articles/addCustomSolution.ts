const addCustomSolution = {
  title: 'How to add a custom solution',
  description:
    'When possible, MINT encourages users to add solutions to a Model-to-operations matrix (MTO) via the solution library. However, MINT’s solution library does not currently offer a comprehensive list of all IT systems, contracts, and other operational solutions used for models. because of this and the unique needs of individual models, IT Leads may need to create custom solutions for a given model. IT Leads are able to create custom solutions directly from the Model-to-operations matrix (MTO) for their model.',
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
    heading: 'Click create a custom solution',
    text: 'In the “Operational solutions” section of the table actions area, click the button labeled “or, create a custom solution”. This button will open a form, allowing you to input content for your custom solution.'
  },
  step4: {
    heading: 'Complete the content in the form',
    altText:
      'A screenshot of the form that allows a user to add a custom solution.',
    text: 'The new solution form will ask you to complete the following fields:',
    list: [
      '<bold>Solution type:</bold> choose the solution type most applicable to the solution you are adding. The available options are: IT system; Contract vehicle, contractor, or other contract; Cross-cutting group; or Other.',
      '<bold>Solution title:</bold> a concise description of your solution. Try to keep these brief and understandable.',
      '<bold>Point of contact email address:</bold> The email address (likely a cms.hhs.gov address) for the person or team mailbox that is the primary point of contact for the solution you are adding.'
    ],
    caption:
      'Image caption: A screenshot of the form that allows a user to add a custom solution.'
  },
  step5: {
    heading: 'Click “Add solution”',
    text: 'Once you have completed all fields in the form, click the “Add solution” button. Once you do so, your solution will be visible in the “Solutions and IT systems” tab of your MTO. If at any time you change your mind, you may click the “Cancel” button or the X icon in the top right corner to close the pop-up without adding a new solution.'
  }
};
export default addCustomSolution;
