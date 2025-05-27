const usingSolutionsAndITSystemsTable = {
  title: 'Using the solutions and IT systems table',
  breadcrumb: 'Using the solutions and IT systems table',
  description:
    'The solutions and IT systems table is accessible from the tab bar below the model-to-operations matrix (MTO) header area and is one of the main MTO content views in MINT. It is closely related to the milestone table, since each one offers a slightly different view of content you have added to your MTO.',
  solutionTable: 'Columns in the solution table',
  solutionTableDescription:
    'The solutions and IT systems table includes a variety of information about the solutions you’ve added to your MTO. This information is contained within the following columns:',
  solutionTableList: [
    '<bold>Risk indicator:</bold> an icon that shows whether or not this solution is at risk. This is an important flag for the purposes of scanning for critical MTO items. This will default to “No risk (on track)” which shows no icon. The other available risk indicators are “Some risk (off track)”, which is shown as a yellow triangle icon, and “Significantly at risk”, shown my a red circle icon.',
    '<bold>Solution:</bold> the title of the solution or IT system',
    '<bold>Related milestones:</bold> the milestones that rely on this solution or IT system. From the edit panel, an IT Lead can add or remove milestones that are related to this solution.',
    '<bold>Facilitated by:</bold> the main individual or role responsible for ensuring the work for this solution is completed. Users may also choose to list alternative individuals or roles who will assist with the work.',
    '<bold>Need by:</bold> the date that the work for this milestone needs to be completed by. This date could help account for interdependencies between milestones, or it could be related to the go live date of the model if this milestone does not impact other milestones.',
    '<bold>Status:</bold> the progress status of the solution. This will default to “Not started”, but can be manually set to “Onboarding”, “Backlog”, “In progress” or “Completed”.'
  ],
  solutionTableSubDescription:
    'The last column is the “Actions” column, which includes a button on every row that is labeled “Edit details”. This button will open a side panel that allows users to edit the details of a solution, including many of the fields above.',
  addingASolution: 'Adding a solution',
  addingASolutionDescription:
    'There are a few ways to add a new solution to your MTO. IT Leads could navigate to the solution library and add common solutions from there. Users may also choose to add a custom solution, which can be done from the table actions area or from the solution library. Users may also add a solution by adding it to a milestone from the milestone table view of the MTO.',
  editingASolution: 'Editing a solution',
  editingASolutionDescription:
    'As described above, users can use the “Actions” column in the solution table to edit the details of a solution, including things like updating the status and risk indicator. Custom solutions may have additional editable fields, such as solution title. Common solutions added from the solution library have some details preset that cannot be edited.',
  step1: {
    heading: 'Navigate to your model’s MTO',
    altText: 'Collaboration area in progress',
    text: 'From the model collaboration area, locate the card for the “Model-to-operations matrix” and click on the “Go to matrix” button to navigate to the MTO for your model.',
    caption:
      'Image caption: A screenshot of the model collaboration area for a model called Rural Health Enablement Model which shows the collaboration area cards for “Model Plan”, “Data exchange approach”, and “Model-to-operations matrix”.'
  },
  step2: {
    heading: 'Navigate to your new model',
    altText: 'MINT homepage',
    text: 'From the MINT homepage, navigate to the new model that you have been assigned to. You can find a list of models you have been assigned to in the “My Model Plans” section of the homepage. Because MINT offers customizable homepages, it’s possible that this section may not appear on your homepage. If you don’t see it, locate the area titled “Did you know you can customize this page?” in the top right of the page and click the “Edit homepage settings” link to add the “My Model Plans” section to your home page.',
    caption:
      'Image caption: A screenshot of the MINT homepage showing the “My Model Plans” section as well as the ability to customize a user’s homepage.'
  },
  step3: {
    heading: 'Navigate to the MTO',
    altText: 'Collaboration area not started',
    text: 'From the model collaboration area, locate the card for the “Model-to-operations matrix” and click on the “Go to matrix” button to navigate to the MTO for your model.',
    caption:
      'Image caption: A screenshot of the model collaboration area for a model called Rural Health Enablement Model which shows the collaboration area cards for “Model Plan”, “Data exchange approach”, and “Model-to-operations matrix”.'
  },
  step4: {
    heading: 'Choose an option to start your MTO',
    altText: 'Empty MTO',
    text: 'After navigating to the MTO, you should see an empty state that will give you a variety of options to start. You may choose to begin by:',
    list: [
      'adding a template such as the one for standard categories,',
      'adding common milestones from the milestone library,',
      'adding common solutions from the solution library,',
      'or creating a custom milestone or solution.'
    ],
    caption:
      'Image caption: A screenshot of the empty state for the model-to-operations matrix for the Rural Health Enablement model. The empty state shows a variety of options for starting an MTO.'
  },
  step5: {
    heading: 'Continue adding content',
    text: 'Once you choose an option from the above step to get started, you will be taken to the main MTO view where you can continue adding milestones, solutions, categories, and more.'
  }
};
export default usingSolutionsAndITSystemsTable;
