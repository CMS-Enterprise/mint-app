export const modelToOperations: any = {};

export const modelToOperationsMisc: Record<string, any> = {
  heading: 'Model-to-operations matrix',
  forModel: 'for {{ modelName }}',
  milestones: 'Milestones',
  'systems-and-solutions': 'IT systems and solutions',
  needHelpDiscussion: 'Need help?',
  isMTOReady: 'Is this MTO ready for review?',
  isMTOInProgress: 'Is this MTO still in progress',
  lastUpdated: 'MTO last updated {{date}}',
  emptyMTO: 'Your model-to-operations matrix is a bit empty!',
  emptyMTOdescription: 'Choose an option below to get started.',
  returnToCollaboration: 'Return to model collaboration area',
  startWithCategories: 'Start with categories or templates',
  aboutTemplates: 'About templates',
  aboutTemplatesDescription:
    'All models are unique, but many have similarities based on key characteristics of the model. Templates contain a combination of categories, milestones, and/or solutions. They are starting points for certain model types and can be further customized once added.',
  aboutCategories: 'About categories',
  aboutCategoriesDescription:
    'Many teams find it useful to organize the model milestones in their into overarching high-level categories and sub-categories. MINT offers a template set of standard categories as a starting point for new MTOs. The categories can be further customized once added.',
  optionsCard: {
    milestones: {
      label: 'Milestones',
      header: 'Start with model milestones',
      description:
        'Model milestones are the key activities and functions that models must accomplish in order to be ready to go live. Most will be fulfilled by one or more IT systems or solutions. Many milestones are similar across models, so MINT offers a library of common milestones to select from.',
      buttonText: 'Browse common milestones',
      linkText: 'or, add a custom milestone'
    },
    'systems-and-solutions': {
      label: 'Operational solutions',
      header: 'Start with IT systems or other solutions',
      description:
        'Models use a variety of IT systems or solutions to fulfill model requirements. These could be IT systems, contracts or contract vehicles, cross-cutting groups, and more. Many models use similar methodologies, so MINT offers a library of common solutions to select from.',
      buttonText: 'Browse common solutions',
      linkText: 'or, add a custom solution'
    },
    template: {
      label: 'Template',
      header: 'Standard categories',
      description: '18 categories, 0 milestones, 0 solutions',
      buttonText: 'Use this template'
    }
  },
  table: {
    modelMilestone: 'Model milestone',
    facilitatedBy: 'Facilitated by',
    solutions: 'Solutions',
    needBy: 'Need by',
    status: 'Status',
    actions: 'Actions',
    openActionMenu: 'Open action menu',
    expandRow: 'Expand row',
    collapseRow: 'Collapse row',
    noneAdded: 'None added yet',
    editDetails: 'Edit details',
    menu: {
      close: 'Close menu',
      moveCategoryUp: 'Move category up',
      moveSubCategoryUp: 'Move sub-category up',
      moveCategoryDown: 'Move category down',
      moveSubCategoryDown: 'Move sub-category down',
      addMilestone: 'Add model milestone',
      moveToAnotherCategory: 'Move to another category',
      addSubCategory: 'Add sub-category',
      editCategoryTitle: 'Edit category title',
      editSubCategoryTitle: 'Edit sub-category title',
      removeCategory: 'Remove category',
      removeSubCategory: 'Remove sub-category'
    }
  }
};

export default modelToOperations;
