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
    heading: 'Navigate to “Solutions and IT systems”',
    altText: 'MTO table tabs',
    text: 'From the tab bar above the table and below the page header, click the tab labeled “Solutions and IT systems”.',
    caption:
      'Image caption: A screenshot of the tab bar at the top of the model-to-operations matrix showing the tabs for the milestone view and the solutions and IT systems view.'
  },
  step3: {
    heading: 'Find the solution you want to edit',
    altText: 'MTO solution table option',
    text: 'Using the solutions and IT systems table, locate the row for the solution you wish to edit.',
    caption:
      'Image caption: A screenshot of the solutions and IT systems table view of the MTO, showing the header area and part of the table including three added solutions.'
  },
  step4: {
    heading: 'Click “Edit details”',
    text: 'In the far right column of the solution row, click the button labeled “Edit details”. This will open a panel on the right side of your screen which allows you to edit a variety of details about the solution.'
  },
  step5: {
    heading: 'Edit details in the solution panel',
    altText: 'Solution edit panel',
    text: 'The solution panel allows users to edit a variety of information about solutions in their MTO, including:',
    list: [
      '<bold>Facilitated by:</bold> the main individual or role responsible for ensuring the work for this solution is completed. Users may also choose to list alternative individuals or roles who will assist with the work. IT Leads can add or remove roles via the edit panel. They may select as many as apply.',
      '<bold>Need by:</bold> the date that the work for this solution needs to be completed by. This date could help account for interdependencies between solutions, or it could be related to the go live date of the model if this solution does not impact other milestones or solutions.',
      '<bold>Status:</bold> the progress status of the solution. This will default to “Not started”, but can be manually set to “Onboarding”, “Backlog”, “In progress” or “Completed”. IT Leads can select one of the five options from the edit panel.',
      '<bold>Risk indicator:</bold> an icon that shows whether or not work for this solution is at risk. This is an important flag for the purposes of scanning for critical MTO items. This will default to “No risk (on track)” which shows no icon. The other available risk indicators are “Some risk (off track)”, which is shown as a yellow triangle icon, and “Significantly at risk”, shown my a red circle icon. IT Leads can select one of the three options from the edit panel.',
      '<bold>Related milestones:</bold> the milestones that rely on this IT system or solution. From the edit panel, an IT Lead can add or remove milestones that are related to this solution.'
    ],
    caption:
      'Image caption: A screenshot of the side panel used to edit details about a solution or IT system.'
  },
  step6: {
    heading: 'Save your changes',
    text: 'There are two options to save changes within the solution panel. Any changes will be reflected in a changes counter in the righthand side of the panel header bar. Next to the counter is a button labeled “Save”. Users may click this to save the changes made in the solution panel. Users may also save changes by clicking the button labeled “Save changes” at the bottom of the edit panel.'
  }
};
export default usingSolutionsAndITSystemsTable;
