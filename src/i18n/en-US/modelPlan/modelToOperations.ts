import { TranslationMTOInfo } from 'types/translation';

import {
  MtoMilestoneStatus,
  MtoSolutionStatus,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const solutionStatuses: Record<MtoSolutionStatus, any> = {
  NOT_STARTED: {
    status: 'Not started',
    description: 'No work has started on this IT system or solution'
  },
  ONBOARDING: {
    status: 'Onboarding',
    description:
      'Work is being planned related to this model (e.g., contract modification, change request, onboarding request, etc.)'
  },
  BACKLOG: {
    status: 'Backlog',
    description: 'Model work is in the project team’s backlog'
  },
  IN_PROGRESS: {
    status: 'In progress',
    description:
      'Work for this model is in progress (e.g., development, configuration, testing, etc.)'
  },
  COMPLETED: {
    status: 'Completed',
    description: 'Work related to this model is finished'
  }
};

const milestoneStatuses: Record<MtoMilestoneStatus, any> = {
  NOT_STARTED: {
    status: 'Not started',
    description:
      'No work has started on any part of this milestone or any solution associated with it'
  },
  IN_PROGRESS: {
    status: 'In progress',
    description:
      'Work for this milestone and/or any of its selected solutions is in progress (e.g., coordination, development, configuration, testing, etc.)'
  },
  COMPLETED: {
    status: 'Completed',
    description:
      'Work for this milestone and all of its selected solutions is finished'
  }
};

export const modelToOperations: TranslationMTOInfo = {
  readyForReviewBy: {
    gqlField: 'readyForReviewBy',
    goField: 'ReadyForReviewBy',
    dbField: 'ready_for_review_by',
    label: 'Ready for review by',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01,
    tableReference: TableName.USER_ACCOUNT
  },
  readyForReviewDTS: {
    gqlField: 'readyForReviewDTS',
    goField: 'ReadyForReviewDTS',
    dbField: 'ready_for_review_dts',
    label: 'Ready for review at',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.02
  }
};

export const modelToOperationsMisc: Record<string, any> = {
  heading: 'Model-to-operations matrix',
  forModel: 'for {{ modelName }}',
  milestones: 'Milestones',
  solutions: 'Solutions and IT systems',
  needHelpDiscussion: 'Need help?',
  isMTOReady: 'Is this MTO ready for review?',
  isMTOInProgress: 'Is this MTO still in progress?',
  lastUpdated: 'MTO last updated {{date}}',
  warningRedirect:
    'Your answer to this question may have implications for the milestones and solutions or IT systems you select to implement your model. MINT may suggest additional content for your Model-to-operations matrix (MTO). <link1>Go to your MTO</link1> to review any suggestions.',
  emptyMTO: 'Your model-to-operations matrix (MTO) is a bit empty!',
  emptyMTOReadView:
    'The model-to-operations matrix (MTO) for this model hasn’t been started yet. Check back again later for updates.',
  emptyMTOReadViewWithSolutions:
    'The model-to-operations matrix (MTO) for this model hasn’t been started yet. Check back again later for updates.',
  noMilestonesReadView:
    'There are not yet any milestones added to this matrix.',
  noSolutionsReadView:
    'There are not yet any operational solutions added to this matrix. To see milestones without solutions, change your selected filters above.',
  emptyMTOdescription: 'Choose an option below to get started.',
  returnToCollaboration: 'Return to model collaboration area',
  returnToMTO: 'Return to model-to-operations matrix (MTO)',
  startWithCategories: 'Start with categories or templates',
  aboutTemplates: 'About templates',
  aboutTemplatesDescription:
    'All models are unique, but many have similarities based on key characteristics of the model. Templates contain a combination of categories, milestones, and/or solutions. They are starting points for certain model types and can be further customized once added.',
  aboutCategories: 'About categories',
  aboutCategoriesDescription:
    'Many teams find it useful to organize the milestones in their MTO into overarching high-level categories and sub-categories. MINT offers a template set of standard categories as a starting point for new MTOs. The categories can be further customized once added.',
  successReorder: 'Your categories have been reordered.',
  errorReorderForm:
    'There was an error saving your changes. Please try again. If the error persists, please try again another time.',
  suggestedMilestoneBanner: {
    empty:
      "There aren't currently any suggested milestones for your model. MINT may suggest model milestones as you and your team fill out more of your <s>Model Plan</s>.",
    notEmpty_part1: {
      output: 'There is {{count}} suggested milestone ',
      output_other: 'There are {{count}} suggested milestones '
    },
    notEmpty_part2:
      'for your model based on answers in the Model Plan. <s>View suggested milestones<arrow></arrow></s>'
  },
  optionsCard: {
    milestones: {
      label: 'Milestones',
      header: 'Start with model milestones',
      description:
        'Model milestones are the key activities and functions that models must accomplish in order to be ready to go live. Most will be fulfilled by one or more solutions or IT systems. Many milestones are similar across models, so MINT offers a library of common milestones to select from.',
      buttonText: 'Add milestones from library',
      linkText: 'or, create a custom milestone'
    },
    solutions: {
      label: 'Operational solutions',
      header: 'Start with solutions or IT systems',
      description:
        'Models use a variety of solutions or IT systems to fulfill model requirements. These could be IT systems, contracts or contract vehicles, cross-cutting groups, and more. Many models use similar methodologies, so MINT offers a library of common solutions to select from.',
      buttonText: 'Add solutions from library',
      linkText: 'or, create a custom solution'
    },
    template: {
      label: 'Template',
      header: 'Standard categories',
      description: '24 categories, 0 milestones, 0 solutions',
      buttonText: 'Add this template',
      templateCount:
        '{{categoryCount}} categories, {{milestoneCount}} milestones, {{solutionCount}} solutions',
      availableTemplates: '{{selected}} of {{available}} available templates',
      viewTemplates: 'View all templates in the library',
      errorFetchingTemplates: 'Failed to fetch templates'
    }
  },
  table: {
    modelMilestone: 'Model milestone',
    facilitatedBy: 'Facilitated by',
    solutions: 'Solutions',
    solution: 'Solution',
    relatedMilestones: 'Related milestones',
    needBy: 'Need by',
    status: 'Status',
    actions: 'Actions',
    openActionMenu: 'Open action menu',
    expandRow: 'Expand row',
    collapseRow: 'Collapse row',
    noneAdded: 'None added yet',
    editDetails: 'Edit details',
    milestones: 'milestones',
    milestonesCount: '{{count}} milestone',
    milestonesCount_other: '{{count}} milestones',
    selectASolution: 'Select a solution',
    noRelatedMilestones: 'No related milestones',
    moreMilestones: '+ {{count}} more milestone',
    moreMilestones_other: '+ {{count}} more milestones',
    menu: {
      close: 'Close menu',
      moveCategoryUp: 'Move category up',
      moveSubCategoryUp: 'Move sub-category up',
      moveCategoryDown: 'Move category down',
      moveSubCategoryDown: 'Move sub-category down',
      addMilestone: 'Create model milestone',
      moveToAnotherCategory: 'Move to another category',
      addSubCategory: 'Create sub-category',
      editCategoryTitle: 'Edit category title',
      editSubCategoryTitle: 'Edit sub-category title',
      removeCategory: 'Remove category',
      removeSubCategory: 'Remove sub-category'
    },
    tableActions: {
      tableActions: 'Table actions',
      showActions: 'Show actions',
      hideActions: 'Hide actions',
      milestones: 'Milestones',
      commonMilestones: '{{number}} common milestones',
      browseMilestoneLibrary: 'Add milestones from library',
      operationalSolutions: 'Operational solutions',
      commonSolutions: '{{number}} common solutions and IT systems',
      browseSolutionLibrary: 'Add solutions from library',
      templateAndCategories: 'Templates and categories',
      availableTemplates: '5 available templates',
      standardCategories: 'Standard categories',
      addTemplateFromLibrary: 'Add templates from library',
      addCustomCategory: 'or, create a custom category'
    },
    alert: {
      noSolutions:
        'There are not yet any operational solutions added to this matrix. To see milestones without solutions, change your selected filters above.',
      noFilterSelections:
        'There are no operational solutions that match your filter selections.'
    }
  },
  errorReorder: 'Failed to reorder the MTO matrix.  Please try again.',
  readyForReview: {
    headingInReview: 'Set MTO status to ready for review?',
    headingInProgress: 'Set MTO status to in progress?',
    descriptionReady:
      'The "ready for review" status indicates to others viewing your MTO that your milestones and chosen solutions are relatively well set, though you may continue to update content and statuses.',
    descriptionInProgress:
      'The "in progress" status indicates to others viewing your MTO that you are still extensively adding, removing, and reorganizing milestones and chosen solutions.',
    markAsReady: 'Mark as ready for review',
    markAsInProgress: 'Mark as in progress',
    goBack: 'Go back to MTO',
    error: 'Failed to update MTO status',
    cancel: 'Cancel'
  },
  modal: {
    addButton: 'Add {{type}}',
    cancel: 'Cancel',
    allFieldsRequired:
      'Fields marked with an asterisk ( <s>*</s> ) are required.',

    category: {
      title: 'Add a new category',
      selectPrimaryCategory: {
        label: 'Select primary category',
        sublabel:
          'Choose a primary category if you are adding a sub-category, or choose "None" if you are adding a primary category.'
      },

      categoryTitle: {
        label: 'New category title'
      },
      selectOptions: {
        default: '- Select - ',
        none: 'None (this is a primary category)'
      },
      alert: {
        success: {
          parent: 'Your category (<b>{{category}}</b>) has been added.',
          subcategory: 'Your sub-category (<b>{{category}}</b>) has been added.'
        },
        error:
          'There was an error adding your category. Please try again. If the error persists, please try again another time.'
      }
    },
    milestone: {
      title: 'Add a new model milestone',
      selectPrimaryCategory: {
        label: 'Select primary category'
      },
      selectSubcategory: {
        label: 'Select sub-category'
      },
      milestoneCategory: {
        label: 'Category',
        sublabel:
          'If you don’t see what you’re looking for, you may add a custom category from the main page of your MTO.'
      },
      milestoneSubcategory: {
        label: 'Sub-category',
        sublabel:
          'If you don’t see what you’re looking for, you may add a custom category from the main page of your MTO.'
      },
      milestoneTitle: 'Milestone title',
      alert: {
        info: 'Before adding this milestone, consider checking the <milestoneLibrary>milestone library</milestoneLibrary> to see if MINT offers a similar preset milestone.',
        infoLibrary:
          'Once you create this custom milestone, it will be visible in your MTO but will not be visible in the milestone library.',
        success: 'Your milestone (<bold>{{milestone}}</bold>) has been added.',
        error:
          'There was an error adding your milestone. Please try again. If the error persists, please try again another time.'
      }
    },
    editMilestone: {
      milestoneTitle: 'Milestone details',
      readviewDescription:
        'Calculate benchmarks and share information with participants so they know what standard they will be compared to for the performance period.',
      alert: {
        info: 'Before adding this milestone, consider checking the <s>milestone library</s> to see if MINT offers a similar preset milestone.',
        success:
          'Your milestone (<bold>{{milestone}}</bold>) has been updated.',
        error:
          'There was an error adding your milestone. Please try again. If the error persists, please try again another time.'
      },
      assignedToInfo:
        'This individual will receive an email notification from MINT when you assign this milestone.',
      statusInfo: [
        '<bold>Not started</bold>: No work has started on any part of this milestone or any solution associated with it',
        '<bold>In progress</bold>: Work for this milestone and/or any of its selected solutions is in progress (e.g., coordination, development, configuration, testing, etc.)',
        '<bold>Completed</bold>: Work for this milestone and all of its selected solutions is finished'
      ],
      custom: 'Custom',
      saveChanges: 'Save changes',
      save: 'Save',
      unsavedChanges: '{{count}} unsaved change',
      unsavedChanges_other: '{{count}} unsaved changes',
      removeMilestone: 'Remove milestone',
      noneSpecified: 'None specified',
      notAssigned: 'Not assigned',
      areYouSure: 'Are you sure you want to remove this custom milestone?',
      areYouSureCommon: 'Are you sure you want to remove this milestone?',
      customTooltip:
        'As opposed to common milestones available in the MINT milestone library, custom milestones were created by this IT Lead and model team specifically for this model.',
      removeDescription:
        'This action cannot be undone. Any operational solutions or IT systems associated with this milestone will remain visible in the solution view of your MTO, but will no longer be related to this milestone.',
      removeCommonDescription:
        'This action cannot be undone. You may add this milestone again from the milestone library, but you will lose any changes you have made. Any operational solutions or IT systems associated with this milestone will remain visible in the solution view of your MTO, but will no longer be related to this milestone.',
      goBack: 'Go back',
      leave: 'Are you sure you want to leave ?',
      leaveDescription:
        'You have made {{count}} changes that will not be saved if you navigate away from this view.',
      successUpdated:
        'Your milestone (<bold>{{milestone}}</bold>) has been updated.',
      errorUpdated:
        'There was an error updating your milestone. Please try again. If the error persists, please try again another time.',
      errorNameAlreadyExists:
        'There is already a model milestone in your MTO named “{{milestone}}”. Please choose a different name for this milestone.',
      successRemoved: 'Your milestone ({{milestone}}) has been removed.',
      errorRemoved:
        'There was an error removing your milestone. Please try again. If the error persists, please try again another time.',
      leaveConfim: {
        heading: 'Are you sure you want to leave?',
        description:
          'You have made changes that will not be saved if you navigate away from this view.',
        confirm: 'Leave without saving',
        dontLeave: 'Don’t leave'
      },
      selectedSolutions: 'Selected solutions',
      selectedSolutionsCount:
        '{{count}} solutions associated with this milestone',
      selectedSolutionsCount_other:
        '{{count}} solution associated with this milestone',
      editSolutions: 'Edit solutions',
      noSolutions:
        'You haven’t selected any solutions or IT systems to implement this milestone.',
      noSolutionsTable:
        'There are no solutions or IT systems selected to implement this milestone.',
      solution: 'Solution',
      status: 'Status',
      selectedSolutionCount_other: '{{count}} selected solutions',
      selectedSolutionCount: '{{count}} selected solution',
      suggestedSolutions: 'Suggested solutions',
      selectedSolutionsDescription:
        'These solutions are commonly used for this milestone.',
      selectThisSolution: 'Select this solution',
      availableSolutionsDescription:
        'Select from other operational solutions and IT systems included in MINT, including any custom solutions you may have added to your MTO. Select all that apply.',
      visitSolutionLibrary:
        'You may visit the <solution>solution library</solution> or <help>help center</help> to learn more about the solutions below.',
      suggestedSolution: 'Suggested solutions for this milestone',
      customSolution: 'Custom solutions added to this MTO',
      otherSolutions: 'Other available solutions',
      backToMilestone: 'Back to milestone details',
      charactersAllowed: '75 characters allowed',
      solutionInfo:
        'To view more information about the solutions associated with this milestone, navigate to the <link1>“Solutions and IT systems” tab</link1> in your MTO. From there you may edit details about the solutions, including the status.'
    },
    editSolution: {
      solutionTitle: 'Solution details',
      learnMore: 'Learn more about this solution',
      label: {
        solutionTitle: 'Solution title',
        solutionType: 'Solution type'
      },
      alert: {
        info: 'Before adding this solution, consider checking the <s>solution library</s> to see if MINT offers a similar preset solution.',
        success: 'Your milestone (<bold>{{solution}}</bold>) has been updated.',
        error:
          'There was an error adding your solution. Please try again. If the error persists, please try again another time.'
      },
      statusInfo: [
        '<bold>Not started</bold>: No work has started on any part of this solution or any solution associated with it',
        '<bold>In progress</bold>: Work for this solution and/or any of its selected solutions is in progress (e.g., coordination, development, configuration, testing, etc.)',
        '<bold>Completed</bold>: Work for this solution and all of its selected solutions is finished'
      ],
      customTooltip:
        'As opposed to common operational solutions and IT systems available in the MINT solution library, custom solutions were created by this IT Lead and model team specifically for this model. This could be because they are existing systems or solutions that are not yet available in the MINT solution library, or because they are completely custom implementation solutions for this model.',
      custom: 'Custom',
      saveChanges: 'Save changes',
      save: 'Save',
      unsavedChanges: '{{count}} unsaved change',
      unsavedChanges_other: '{{count}} unsaved changes',
      removeSolution: 'Remove solution',
      noneSpecified: 'None specified',
      noMilestonesTable:
        'This solution is not yet related to any specific model milestones.',
      areYouSure: 'Are you sure you want to remove this solution?',
      areYouSureCustom: 'Are you sure you want to remove this custom solution?',
      removeDescription:
        'This action cannot be undone. You may add this solution again from the solution library, but you will lose any changes you have made. Any milestones associated with this solution will remain visible in the milestone view of your MTO, but will no longer be related to this solution.',
      removeCustomDescription:
        'This action cannot be undone. Any milestones associated with this solution will remain visible in the milestone view of your MTO, but will no longer be related to this solution.',
      goBack: 'Go back',
      leave: 'Are you sure you want to leave ?',
      leaveDescription:
        'You have made {{count}} changes that will not be saved if you navigate away from this view.',
      successUpdated:
        'Your solution (<bold>{{solution}}</bold>) has been updated.',
      errorUpdated:
        'There was an error updating your solution. Please try again. If the error persists, please try again another time.',
      errorNameAlreadyExists:
        'There is already a solution in your MTO named “{{solution}}”. Please choose a different name for this solution.',
      successRemoved: 'Your solution ({{solution}}) has been removed.',
      errorRemoved:
        'There was an error removing your solution. Please try again. If the error persists, please try again another time.',
      leaveConfim: {
        heading: 'Are you sure you want to leave?',
        description:
          'You have made changes that will not be saved if you navigate away from this view.',
        confirm: 'Leave without saving',
        dontLeave: 'Don’t leave'
      },
      selectedMilestones: 'Related milestones',
      selectedMilestonesCount:
        '{{count}} milestone associated with this solution',
      selectedMilestonesCount_other:
        '{{count}} milestones associated with this solution',
      editMilestones: 'Edit related milestones',
      noMilestones:
        'You haven’t identified any specific milestones that this solution will help implement.',
      milestone: 'Milestone',
      helpText: 'Select all that apply',
      status: 'Status',
      selectedMilestoneCount_other: '{{count}} associated milestones',
      selectedMilestoneCount: '{{count}} associated milestone',
      relatedMilestoneCount_other: '{{count}} related milestones',
      relatedMilestoneCount: '{{count}} related milestone',
      suggestedMilestones: 'Suggested milestones',
      selectedMilestonesDescription:
        'These milestones are commonly used for this solution.',
      selectThisMilestone: 'Select this milestone',
      availableMilestonesDescription:
        'Select from other operational milestones and IT systems included in MINT, including any custom milestones you may have added to your MTO. Select all that apply.',
      visitMilestoneLibrary:
        'You may add additional milestones to your MTO from the <milestone>milestone library</milestone> or by adding a custom milestone from the main page of your MTO.',
      customMilestone: 'Milestones in your MTO that often use this solution',
      otherMilestones: 'Other milestones in your MTO',
      backToSolution: 'Back to solution details',
      milestoneInfo:
        'To view more information about the milestones using this solution, navigate to the <link1>“Milestones” tab</link1> in your MTO. From there you may edit details about the milestones, including the status.'
    },
    solution: {
      title: 'Add a new solution',
      label: {
        solutionType: 'What type of solution is this?',
        solutionTitle: 'Please add a title for your solution',
        pocName: 'Point of contact name',
        pocEmail: 'Point of contact email address',
        emailError: 'Please use a valid email address format.'
      },
      pocHeading: 'Solution point of contact information',
      pocSubheading:
        'Add the name and contact information for the person or team who is the primary point of contact for this solution.',
      alert: {
        info: "Please double-check that you aren't creating an operational solution or IT system that already exists in the <s>solution library</s>.",
        success: 'Your solution (<bold>{{solution}}</bold>) has been added.',
        error:
          'There was an error adding your solution. Please try again. If the error persists, please try again another time.',
        fromSolutionLibrary:
          'Once you create this custom solution, it will be visible in your MTO but will not be visible in the solution library.'
      }
    },
    solutionToMilestone: {
      title: 'Add a solution for this milestone?',
      description:
        'You may choose to add solution(s) for this milestone simultaneously, or you may do so later. Any added solutions will be associated with this milestone and will appear in the solution view of your MTO.',
      selectedMilestone: 'Selected milestone: ',
      alert: {
        success: 'Your solution (<bold>{{solution}}</bold>) has been added.',
        error:
          'There was an error adding your solution. Please try again. If the error persists, please try again another time.'
      },
      add: 'Add with {{count}} solution',
      add_other: 'Add with {{count}} solutions',
      add_zero: 'Add without solutions'
    },
    selectSolution: {
      title: 'Add a solution for this milestone?',
      description:
        'Any added solutions will be associated with this milestone and will also appear in the solution view of your MTO.',
      label: 'Solution',
      helperText:
        'Select from all operational solutions and IT systems included in MINT. Select all that apply. You may learn more about any non-custom operational solutions by visiting MINT’s <solution>solution library</solution> or <help>help center.</help>',
      cta: {
        disabled: 'Add solutions',
        add: 'Add {{count}} solution',
        add_other: 'Add {{count}} solutions'
      },
      alert: {
        success: 'Your solution(s) have been added.',
        error:
          'There was an error adding your solution(s). Please try again. If the error persists, please try again another time.'
      }
    },
    moveSubCategory: {
      title: 'Move sub-category to a new category',
      description:
        'This action will also move any milestones within this sub-category.',
      currentCategory: 'Current category',
      newCategory: 'New category',
      add: 'Add with {{count}} solution',
      add_other: 'Add with {{count}} solutions',
      add_zero: 'Add without solutions',
      subcategoryExists:
        'There is already a sub-category named "{{name}}" in this primary category. To avoid issues, please select a different primary category or rename this sub-category before moving it.'
    },
    editCategoryTitle: {
      title: 'Edit category title',
      label: 'Current title',
      newTitle: 'New title',
      saveChanges: 'Save changes',
      alert: {
        success: 'Your category title (<b>{{title}}</b>) has been updated.',
        error:
          'There was an error editing the title. Please try again. If the error persists, please try again another time.'
      }
    },
    removeCategory: {
      title: 'Are you sure you want to remove this category?',
      copy: 'This action cannot be undone. This will also remove any sub-categories in this category. Any milestones will move to the “Uncategorized” category in your MTO.',
      button: 'Remove category',
      errorAlert:
        'There was an error removing this category. Please try again. If the error persists, please try again another time.',
      goBack: 'Go back',
      successAlert: 'Your category has been removed.'
    },
    removeSubcategory: {
      title: 'Are you sure you want to remove this sub-category?',
      copy: 'This action cannot be undone. Any milestones will move to the “Uncategorized” sub-category in this primary category.',
      button: 'Remove sub-category',
      errorAlert:
        'There was an error removing this sub-category. Please try again. If the error persists, please try again another time.',
      goBack: 'Go back',
      successAlert: 'Your category has been removed.'
    },
    addTemplate: {
      title: 'Are you sure you want to continue?',
      selectedTemplate: '<bold>Selected template:</bold> {{template}}',
      description: 'Adding this template to your MTO will add:',
      categories:
        '{{count}} categories (including {{primaryCount}} primary categories)',
      milestones: '{{count}} milestones',
      solutions: '{{count}} solutions',
      description2:
        'Adding this template will only add items that you have not yet added to your MTO. If you have already added this template, you may not see any new items appear.',
      success: 'Your template <bold>({{category}})</bold> has been added.',
      error:
        'There was an error adding this template. Please try again. If the error persists, please try again another time.',
      addTemplate: 'Add template',
      dontAdd: 'Don’t add template',
      failedToFetch: 'Failed to fetch template'
    },
    addToExistingMilestone: {
      title: 'Add to existing milestone?',
      description:
        'You may choose to add this solution to existing milestones in your MTO, or you may do so later.',
      label: 'Milestones',
      helpText: 'Select all that apply.',
      selectedLabel: 'Selected milestones',
      selectedSolution: 'Selected solution: ',
      noMilestone:
        'You have not yet added any milestones to your MTO. You may do so from the milestone library or by adding a custom milestone.',
      cta: {
        empty: 'Add without milestone',
        add: 'Add to {{count}} milestone',
        add_other: 'Add to {{count}} milestones'
      },
      alert: {
        error:
          'There was an error adding your solution and any milestone(s) you selected for it. Please try again. If the error persists, please try again another time.',
        info: 'You have not yet added any milestones to your MTO. You may do so from the milestone library or by adding a custom milestone.',
        success:
          'Your solution (<b>{{title}}</b>) has been added and will be visible on your MTO.'
      }
    }
  },
  templateLibrary: {
    heading: 'Template library',
    description:
      'Browse the model-to-operations (MTO) matrix templates available in MINT. Templates contain a combination of categories, milestones, and/or solutions. They are starting points for certain model types and can be further customized once added. Add any templates that are relevant for your MTO.',
    hideAdded: 'Hide added templates ({{count}})',
    template: 'Template',
    templateCount:
      '{{categoryCount}} categories, {{milestoneCount}} milestones, {{solutionCount}} solutions',
    addToMatrix: 'Add to matrix',
    aboutThisTemplate: 'About this template',
    templateDetails: 'Template details',
    added: 'Added',
    returnToMTO: 'Return to model-to-operations matrix',
    alertHeading: 'There are no model templates that match your search.',
    alertDescription:
      'Please double-check your search and try again. If you’re searching for a milestone that you believe should be a part of MINT, please contact the MINT Team at <email>MINTTeam@cms.hhs.gov</email>.',
    alertDescriptionWithFilter:
      'Please double-check your search and filters and try again. If you’re searching for a template that you believe should be a part of MINT, please contact the MINT Team at <email>MINTTeam@cms.hhs.gov</email>.',
    templateContents: 'Template contents',
    contentDetails:
      'The categories, milestones, and solutions listed below will be added to your model-to-operations (MTO) matrix if you choose to add this template.',
    category: 'Category',
    subCategory: 'Sub-category',
    milestone: 'Milestone',
    solution: 'Solution',
    selectedSolutions: 'Selected solutions',
    relatedMilestones: 'Related milestones',
    noMilestones:
      'There are no milestones or categories included in this template.',
    noSolutions:
      'There are no solutions or IT systems included in this template.',
    noneSpecified: 'None specified'
  },
  milestoneLibrary: {
    heading: 'Milestone library',
    description:
      'Browse this collection of common model milestones that are frequently used in CMMI models and demonstrations. Add any milestones that are relevant for your model to your model-to-operations matrix (MTO). Some milestones are suggested for your model based on answers to questions in your Model Plan.',
    suggestedMilestones: 'Suggested milestones only ({{count}})',
    allMilestones: 'All common milestones ({{count}})',
    hideAdded: 'Hide added milestones ({{count}})',
    milestone: 'Milestone',
    suggested: 'Suggested',
    isDraft: 'Draft',
    category: 'Category: {{category}}',
    facilitatedByArray: 'Facilitated by: {{facilitatedBy}}',
    addToMatrix: 'Add to matrix',
    aboutThisMilestone: 'About this milestone',
    milestoneDetails: 'Milestone details',
    whySuggested: 'Why is this suggested?',
    youAnswered: 'In the Model Plan, you answered:',
    changeAnswer: 'Want to change your answer?',
    goToQuestion: 'Go to the question',
    added: 'Added',
    noSuggestedHeading: 'There are no suggested milestones for your model.',
    noSuggestedDescription:
      'MINT hasn’t yet suggested any milestones for your model. As you and your team fill out more of your <link1>Model Plan</link1>, MINT may display suggested common milestones for your model here. To view all available common milestones, click the button above labeled “All common milestones”.',
    dontSeeMilestone: 'Don’t see a milestone you need?',
    checkMilestones:
      'Check <link1>all available milestones</link1> or <button1>create a custom milestone</button1>.',
    addCustomMilestone: 'Create a custom milestone',
    aboutSolution: 'About this solution',
    commonSolutions: 'Common solutions',
    alertHeading: 'There are no model milestones that match your search.',
    alertDescription:
      'Please double-check your search and try again. If you’re searching for a milestone that you believe should be a part of MINT, please contact the MINT Team at <email>MINTTeam@cms.hhs.gov</email>.'
  },
  solutionLibrary: {
    heading: 'Solution library',
    description:
      'Browse common available operational solutions and IT systems and add them to your model-to-operations matrix (MTO). Solutions in this library include IT systems, contractors and contract vehicles, cross-cutting groups, and more. You will be able to associate these solutions with any relevant model milestones.',
    hideAdded: 'Hide added solutions ({{count}})',
    tabs: {
      allSolutions: 'All common solutions ({{count}})',
      itSystems: 'IT systems ({{count}})',
      contracts: 'Contracts and contractors ({{count}})',
      crossCutting: 'Cross-cutting groups ({{count}})'
    },
    cardTypes: {
      IT_SYSTEM: 'IT system',
      CONTRACTOR: 'Contracts and contractors',
      CROSS_CUTTING_GROUP: 'Cross-cutting group',
      OTHER: 'Other'
    },
    dontSeeSolution: 'Don’t see the solution you need?',
    checkAllSolutions:
      'Check <link1>all available solutions</link1> or <button1>create a custom solution</button1>.',
    addCustomSolution: 'Create a custom solution',
    aboutThisSolution: 'About this solution',
    IT_SYSTEM: 'IT system',
    CONTRACTOR: 'Contract vehicle, contractor, or other contract',
    CROSS_CUTTING_GROUP: 'Cross-cutting group',
    OTHER: 'Other',
    emptyFilter: {
      heading: 'There are no {{solution}} that match your search.',
      'text-firstHalf': 'Please double-check your search and try again. ',
      checkAllSolutions:
        'You may also try checking <link1>all available solutions</link1>. ',
      'text-secondHalf':
        'If you’re searching for {{solution}} that you believe should be a part of MINT, please contact the MINT Team at ',
      email: '<email1>MINTTeam@cms.hhs.gov</email1>.',
      solution: {
        all: {
          heading: 'operational solutions',
          body: 'a solution'
        },
        'it-systems': {
          heading: 'IT systems',
          body: 'an IT system'
        },
        contracts: {
          heading: 'contract vehicles, contractors, or other contracts',
          body: 'a contract vehicle, contractor, or other contract'
        },
        'cross-cut': {
          heading: 'cross-cutting groups',
          body: 'a cross-cutting group'
        }
      }
    }
  },
  solutionTable: {
    tabs: {
      allSolutions: 'All solutions ({{count}})',
      itSystems: 'IT systems ({{count}})',
      contracts: 'Contracts and contractors ({{count}})',
      other: 'Other solutions ({{count}})'
    },
    hideAdded: 'Hide milestones without solutions ({{count}})'
  },
  validation: {
    fillOut: 'Please fill out the required field.',
    invalidDate: 'Please enter a valid date.'
  },
  solutionStatusButton: 'Solution implementation statuses',
  solutionStatuses,
  milestoneStatusButton: 'Milestone implementation statuses',
  milestoneStatuses
};

export default modelToOperations;
