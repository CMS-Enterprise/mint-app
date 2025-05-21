const usingMilestoneTable = {
  title: 'Using the milestone table',
  breadcrumb: 'Using the milestone table',
  description:
    'The milestone table is the main model-to-operations matrix (MTO) content view in MINT. It is closely related to the solutions and IT systems table, since each one offers a slightly different view of content you have added to your MTO.',
  columsInMilestoneTable: 'Columns in the milestone table',
  columsInMilestoneTableDescription:
    'The milestone table includes a variety of information about the model milestones you’ve added to your MTO. This information is contained within the following columns:',
  columsInMilestoneTableList: [
    {
      title: 'Risk indicator:',
      description:
        ' an icon that shows whether or not this milestone is at risk. This is an important flag for the purposes of scanning for critical MTO items. This will default to “No risk (on track)” which shows no icon. The other available risk indicators are “Some risk (off track)”, which is shown as a yellow triangle icon, and “Significantly at risk”, shown my a red circle icon.'
    },
    {
      title: 'Model milestone:',
      description:
        ' the title of the milestone. Usually fairly descriptive of the work that needs to take place.'
    },
    {
      title: 'Facilitated by:',
      description:
        ' the main individual or role responsible for ensuring the work for this milestone is completed. Users may also choose to list alternative individuals or roles who will assist with the work.'
    },
    {
      title: 'Solutions:',
      description:
        ' the solutions and IT systems selected to implement this milestone. Some milestones may not have solutions yet if the IT Lead or other team member has not yet selected any for a variety of reasons.'
    },
    {
      title: 'Need by:',
      description:
        ' the date that the work for this milestone needs to be completed by. This date could help account for interdependencies between milestones, or it could be related to the go live date of the model if this milestone does not impact other milestones.'
    },
    {
      title: 'Status:',
      description:
        ' the progress status of the milestone. This will default to “Not started”, but can be manually set to “In progress” or “Completed”.'
    }
  ],
  columsInMilestoneTableSummary:
    'The last column is the “Actions” column, which includes a button on every row that is labeled “Edit details”. This button will open a side panel that allows users to edit the details of a milestone, including many of the fields above.',
  addingMilestone: 'Adding a milestone',
  addingMilestoneDescription:
    'There are a few ways to add a new milestone to your MTO: ',
  addingMilestoneList: [
    'IT Leads could navigate to the milestone library and add common milestones from there.',
    'Users may also choose to add a custom milestone, which can be done from the table actions area or from the milestone library.',
    'Users may also add a milestone directly to a category by using the menu icon on the right side of any category row.'
  ],
  editingMilestone: 'Editing a milestone',
  editingMilestoneDescription:
    'As described above, users can use the “Actions” column in the milestone table to edit the details of a milestone, including things like updating the status and risk indicator. Custom milestones may have additional editable fields, such as milestone title. Common milestones added from the milestone library have some details preset that cannot be edited.',
  editingMilestoneList: [
    {
      title: 'Navigate to your model’s MTO',
      description:
        'From the model collaboration area, locate the card for the “Model-to-operations matrix” and click on the “Go to matrix” button to navigate to the MTO for your model.'
    },
    {
      title: 'Find the milestone you want to edit',
      description:
        'Using the milestone table, locate the row for the milestone you wish to edit.'
    },
    {
      title: 'Click “Edit details”',
      description:
        'In the far right column of the milestone row, click the button labeled “Edit details”. This will open a panel on the right side of your screen which allows you to edit a variety of details about the milestone.'
    },
    {
      title: 'Edit details in the milestone panel',
      description:
        'The milestone panel allows users to edit a variety of information about milestones in their MTO, including:'
    },
    {
      title: 'Save your changes',
      description:
        'There are two options to save changes within the milestone panel. Any changes will be reflected in a changes counter in the righthand side of the panel header bar. Next to the counter is a button labeled “Save”. Users may click this to save the changes made in the milestone panel. Users may also save changes by clicking the button labeled “Save changes” at the bottom of the milestone panel. '
    }
  ],
  removingMilestone: 'Removing a milestone',
  removingMilestoneDescription:
    'As described above, users can use the “Actions” column in the milestone table to open the milestone edit panel. From the edit panel, users may also remove a milestone.',
  removingMilestoneList: [
    {
      title: 'Follow steps 1-3 from the process above',
      description:
        'Complete steps 1-3 (“Navigate to your model’s MTO”, “Find the milestone you want to edit”, and “Click ‘Edit details’”) from the process described above in the “Editing a milestone” section.'
    },
    {
      title: 'Click “Remove milestone”',
      description:
        'At the bottom of the milestone panel, click the button labeled “Remove milestone”. This will open a confirmation screen.'
    },
    {
      title: 'Confirm milestone removal',
      description:
        'In the confirmation screen, click the button labeled “Remove milestone”. If you change your mind, you may click the X icon in the top right corner or click the button labeled “Go back” to close the pop-up without removing your milestone.'
    }
  ],
  addingOrRemovingCategory: 'Adding or removing a category',
  addingOrRemovingCategoryDescription:
    'Categories and sub-categories are used to help group milestones within the MTO milestone table. IT Leads can add categories in a variety of different ways. Custom categories may be added from the table actions area. Users may also choose to add the template of standard categories, which can also be accessed from the table actions area. Users may also add a sub-category to a primary category by using the menu icon on the right side of any primary category row. Users may also choose to remove a category or sub-category using the menu on the right side of the category rows. Removing a category will not remove the milestones within it, any milestones in the removed category will become “Uncategorized”.',
  organizingCategories: 'Organizing categories',
  organizingCategoriesDescription:
    'Categories and sub-categories are used to help order, group, and organize milestones within an MTO. IT Leads and other users can arrange categories in a variety of ways to help better organize an MTO.',
  reorderingCategories: 'Reordering categories',
  reorderingCategoriesDescription:
    'IT Leads and other users may reorder categories and sub-categories within the MTO by dragging and dropping them to other locations in the table. Users may also move a sub-category up and down within its primary category by using the menu icon on the right side of the sub-category row. Similarly, users may rearrange primary categories by using the menu icon on the right side of the primary category row and selecting the option labeled “Move category up” or “Move category down”.',
  renamingCategories: 'Renaming categories',
  renamingCategoriesDescription:
    'Using the menu on the right of any primary or sub-category row, users may select the option labeled “Edit category title” or “Edit sub-category title” to rename the category. Choosing this option will open a screen that allows users to input a new title.',
  ExpandingCollapsingCategories: 'Expanding and collapsing categories',
  ExpandingCollapsingCategoriesDescription:
    'IT Leads and other users may use the + and - icons on the left side of any primary or sub-category row to expand and collapse the category rows. Collapsing a primary category will hide all the milestones and sub-categories contained within it. Similarly, collapsing a sub-category will hide all the milestones contained within it.',

  stillNeedHelp: 'Still need help?',
  stillNeedHelpDescription:
    'If you’d like to know more about the Model-to-operations capabilities in MINT, please feel free to reach out to the MINT team at <email>MINTTeam@cms.hhs.gov</email> or <slack>chat with us on Slack</slack>.'
};
export default usingMilestoneTable;
