import { TranslationMTOInfo } from 'types/translation';

import {
  MtoCommonMilestoneKey,
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

type MilestoneCardType = {
  description: string;
};

const milestoneMap: Record<MtoCommonMilestoneKey, MilestoneCardType> = {
  [MtoCommonMilestoneKey.MANAGE_CD]: {
    description:
      'Identify the Part D and Parts C/D beneficiaries based on their enrollment in a participating MAPD or PDP plan.'
  },
  [MtoCommonMilestoneKey.REV_COL_BIDS]: {
    description:
      'Receive bids from interested plans regarding a particular pilot or demonstration.'
  },
  [MtoCommonMilestoneKey.UPDATE_CONTRACT]: {
    description:
      'Update the contract between CMS and the plan regarding the product that is being offered to beneficiaries.'
  },
  [MtoCommonMilestoneKey.SIGN_PARTICIPATION_AGREEMENTS]: {
    description:
      'Support the signing of Participation Agreements between CMS and each participant. There would be a unique document for each participant with signatures from both CMS and the participant.'
  },
  [MtoCommonMilestoneKey.RECRUIT_PARTICIPANTS]: {
    description:
      'Enable interested parties to communicate their interest to CMS. Support interested parties providing information about their organization and about their experience or interest in the model or demonstration.'
  },
  [MtoCommonMilestoneKey.REV_SCORE_APP]: {
    description:
      'Receive applications from interested parties and support panel reviews using standard evaluation criteria.'
  },
  [MtoCommonMilestoneKey.APP_SUPPORT_CON]: {
    description:
      'Advertise the opportunity to bid on work related to managing applications to a model, review the bids and select the application support contractor.'
  },
  [MtoCommonMilestoneKey.COMM_W_PART]: {
    description:
      'Offer one or more mechanisms to send information to participants (individually and/or as a group) and to receive information from participants.'
  },
  [MtoCommonMilestoneKey.VET_PROVIDERS_FOR_PROGRAM_INTEGRITY]: {
    description:
      'Screen potential participants or providers in a model for significant program integrity concerns, such as convictions of fraud or abuse or pending fraud or abuse cases.'
  },
  [MtoCommonMilestoneKey.MANAGE_PROV_OVERLAP]: {
    description:
      'Check for non-permitted provider overlaps between models (same provider in two models at the same time when that particular overlap is prohibited).'
  },
  [MtoCommonMilestoneKey.MANAGE_BEN_OVERLAP]: {
    description:
      'Check for non-permitted beneficiary overlaps between models (same beneficiary in two models at the same time when that particular overlap is prohibited).'
  },
  [MtoCommonMilestoneKey.HELPDESK_SUPPORT]: {
    description:
      'Offer mechanisms for participants to share questions and receive answers from CMS.'
  },
  [MtoCommonMilestoneKey.IDDOC_SUPPORT]: {
    description:
      'For a kidney or ACO model, get set up in the 4i/ACO-OS systems for various aspects of model operations.'
  },
  [MtoCommonMilestoneKey.ESTABLISH_BENCH]: {
    description:
      'Calculate benchmarks and share information with participants so they know what standard they will be compared to for the performance period.'
  },
  [MtoCommonMilestoneKey.PROCESS_PART_APPEALS]: {
    description:
      'Offer mechanisms for participants to appeal decisions or performance results to CMS.'
  },
  [MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT]: {
    description:
      'Advertise the opportunity to bid on work related to evaluating a model, review the bids and select evaluation contractor.'
  },
  [MtoCommonMilestoneKey.DATA_TO_MONITOR]: {
    description:
      'Gather information from participants, intermediaries, or both, to help monitor the model. Monitoring may include detecting any side effects associated with the model changes and may include checking to ensure compliance with model requirements. Note: some of this information may also be shared with the model evaluation.'
  },
  [MtoCommonMilestoneKey.DATA_TO_SUPPORT_EVAL]: {
    description:
      'Gather information from participants, intermediaries, or both, to help support model evaluation.'
  },
  [MtoCommonMilestoneKey.CLAIMS_BASED_MEASURES]: {
    description:
      'Analyze claims information to calculate a claims-based measure. This measure may be part of a broader quality strategy or methodology for the model.'
  },
  [MtoCommonMilestoneKey.QUALITY_PERFORMANCE_SCORES]: {
    description:
      'Lorem ipsum dolor sit amet consectetur. Mauris ullamcorper fusce urna pharetra id orci. Feugiat in ac ornare lobortis. Vulputate nisi et sem magna id consequat scelerisque sed sed. Facilisi id porttitor vulputate donec purus enim turpis. Viverra porttitor ut eget ante adipiscing. Id etiam commodo porta facilisi. Lectus vulputate id pretium ut neque magna aliquam cras.'
  },
  [MtoCommonMilestoneKey.SEND_REPDATA_TO_PART]: {
    description:
      'Share information with participants. Information may include reports, dashboards, raw data, or written materials.'
  },
  [MtoCommonMilestoneKey.UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR]: {
    description:
      'Execute a task order on the existing quality measures development contract or solicit a new contract. Solicitation involves advertising the opportunity to bid on work related to quality measures development for a model, reviewing the bids, and selecting a quality measures development contractor.'
  },
  [MtoCommonMilestoneKey.ACQUIRE_A_LEARN_CONT]: {
    description:
      'Select from cross-model learning contractors or solicit a new contract. Solicitation involves advertising the opportunity to bid on work related to the learning system of a model, reviewing the bids, and selecting a learning contractor.'
  },
  [MtoCommonMilestoneKey.PART_TO_PART_COLLAB]: {
    description:
      'Support participants sharing ideas and experiences with each other. This can help participants learn from the successes and challenges of others involved with the same model.'
  },
  [MtoCommonMilestoneKey.EDUCATE_BENEF]: {
    description:
      'Share information with beneficairies, either directly or via participants. This information may educate beneficiaries about their involvement in a model, about their health condition, or something else.'
  },
  [MtoCommonMilestoneKey.IT_PLATFORM_FOR_LEARNING]: {
    description:
      'Lorem ipsum dolor sit amet consectetur. Mauris ullamcorper fusce urna pharetra id orci. Feugiat in ac ornare lobortis. Vulputate nisi et sem magna id consequat scelerisque sed sed. Facilisi id porttitor vulputate donec purus enim turpis. Viverra porttitor ut eget ante adipiscing. Id etiam commodo porta facilisi. Lectus vulputate id pretium ut neque magna aliquam cras.'
  },
  [MtoCommonMilestoneKey.ADJUST_FFS_CLAIMS]: {
    description:
      'Make payment changes to the Fee-For-Service payment system for Medicare-enrolled providers or suppliers. This may involve updating payment rates to existing payments or may involve paying for things the Fee-for-Service System has not typically paid for (or no longer paying for things it typically does pay for).'
  },
  [MtoCommonMilestoneKey.MANAGE_FFS_EXCL_PAYMENTS]: {
    description:
      'Lorem ipsum dolor sit amet consectetur. Mauris ullamcorper fusce urna pharetra id orci. Feugiat in ac ornare lobortis. Vulputate nisi et sem magna id consequat scelerisque sed sed. Facilisi id porttitor vulputate donec purus enim turpis. Viverra porttitor ut eget ante adipiscing. Id etiam commodo porta facilisi. Lectus vulputate id pretium ut neque magna aliquam cras.'
  },
  [MtoCommonMilestoneKey.MAKE_NON_CLAIMS_BASED_PAYMENTS]: {
    description:
      'Make payments outside of the Fee-for-Service payment system. This may include payments to participants, providers, beneficiaries, or other parties.'
  },
  [MtoCommonMilestoneKey.COMPUTE_SHARED_SAVINGS_PAYMENT]: {
    description:
      'Calculate the performance of participants relative to the benchmark. This calculation may take into account the quality performance score and other factors. Positive results could result in shared savings and negative results could result in shared losses.'
  },
  [MtoCommonMilestoneKey.RECOVER_PAYMENTS]: {
    description:
      'When needed, recover payments from participants or providers. Payments may have been errors and may need to be recovered, or participants may have incurred losses and CMS may be recovering that money.'
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
  solutions: 'IT systems and solutions',
  needHelpDiscussion: 'Need help?',
  isMTOReady: 'Is this MTO ready for review?',
  isMTOInProgress: 'Is this MTO still in progress',
  lastUpdated: 'MTO last updated {{date}}',
  emptyMTO: 'Your model-to-operations matrix is a bit empty!',
  emptyMTOdescription: 'Choose an option below to get started.',
  returnToCollaboration: 'Return to model collaboration area',
  returnToMTO: 'Return to model-to-operations matrix',
  startWithCategories: 'Start with categories or templates',
  aboutTemplates: 'About templates',
  aboutTemplatesDescription:
    'All models are unique, but many have similarities based on key characteristics of the model. Templates contain a combination of categories, milestones, and/or solutions. They are starting points for certain model types and can be further customized once added.',
  aboutCategories: 'About categories',
  aboutCategoriesDescription:
    'Many teams find it useful to organize the model milestones in their into overarching high-level categories and sub-categories. MINT offers a template set of standard categories as a starting point for new MTOs. The categories can be further customized once added.',
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
        'Model milestones are the key activities and functions that models must accomplish in order to be ready to go live. Most will be fulfilled by one or more IT systems or solutions. Many milestones are similar across models, so MINT offers a library of common milestones to select from.',
      buttonText: 'Browse common milestones',
      linkText: 'or, add a custom milestone'
    },
    solutions: {
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
    milestones: 'milestones',
    selectASolution: 'Select a solution',
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
    },
    tableActions: {
      tableActions: 'Table actions',
      showActions: 'Show actions',
      hideActions: 'Hide actions',
      milestones: 'Milestones',
      commonMilestones: '{{number}} common milestones',
      browseMilestoneLibrary: 'Browse milestone library',
      operationalSolutions: 'Operational solutions',
      commonSolutions: '{{number}} common solutions and IT systems',
      browseSolutionLibrary: 'Browse solution library',
      templateAndCategories: 'Templates and categories',
      availableTemplates: '1 available template',
      standardCategories: 'Standard categories',
      addThisTemplate: 'Add this template',
      addCustomCategory: 'or, add a custom category'
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
    error: 'Failed to update MTO status'
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
        info: 'Before adding this milestone, consider checking the <s>milestone library</s> to see if MINT offers a similar preset milestone.',
        success: 'Your milestone ({{milestone}}) has been added.',
        error:
          'There was an error adding your milestone. Please try again. If the error persists, please try again another time.'
      }
    },
    editMilestone: {
      milestoneTitle: 'Milestone details',
      alert: {
        info: 'Before adding this milestone, consider checking the <s>milestone library</s> to see if MINT offers a similar preset milestone.',
        success: 'Your milestone ({{milestone}}) has been updated.',
        error:
          'There was an error adding your milestone. Please try again. If the error persists, please try again another time.'
      },
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
      areYouSure: 'Are you sure you want to remove this milestone?',
      removeDescription:
        'This action cannot be undone. You may add this milestone again from the milestone library, but you will lose any changes you have made. Any operational solutions or IT systems associated with this milestone will remain visible in the solution view of your MTO, but will no longer be related to this milestone.',
      goBack: 'Go back',
      leave: 'Are you sure you want to leave ?',
      leaveDescription:
        'You have made {{count}} changes that will not be saved if you navigate away from this view.',
      successUpdated: 'Your milestone ({{milestone}}) has been updated.',
      errorUpdated:
        'There was an error updating your milestone. Please try again. If the error persists, please try again another time.',
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
      backToMilestone: 'Back to milestone details'
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
        success: 'Your solution ({{solution}}) has been added.',
        error:
          'There was an error adding your solution. Please try again. If the error persists, please try again another time.'
      }
    },
    solutionToMilestone: {
      title: 'Add a solution for this milestone?',
      description:
        'You may choose to add solution(s) for this milestone simultaneously, or you may do so later. Any added solutions will be associated with this milestone and will appear in the solution view of your MTO.',
      alert: {
        success: 'Your solution ({{solution}}) has been added.',
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
      alert: {
        success: 'Your solution ({{solution}}) has been added.',
        error:
          'There was an error adding your solution. Please try again. If the error persists, please try again another time.'
      },
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
      description: 'Adding this template to your MTO will add:',
      item: '18 categories (including 8 primary categories)',
      description2:
        'Adding this template will only add items that you have not yet added to your MTO. If you have already added this template, you may not see any new items appear.',
      success: 'Your template (Standard categories) has been added.',
      error:
        'There was an error adding this template. Please try again. If the error persists, please try again another time.',
      addTemplate: 'Add template',
      dontAdd: 'Don’t add template'
    }
  },
  milestoneLibrary: {
    heading: 'Milestone library',
    description:
      'Browse this collection of common model milestones that are frequently used in CMMI models and demonstrations. Add any milestones that are relevant for your model to your model-to-operations matrix. Some milestones are suggested for your model based on answers to questions in your Model Plan.',
    milestoneMap,
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
    whySuggested: 'Why is this suggested?',
    youAnswered: 'In the Model Plan, you answered:',
    changeAnswer: 'Want to change your answer?',
    goToQuestion: 'Go to the question',
    added: 'Added',
    noSuggestedHeading:
      'There are no suggested milestones that match your search.',
    noSuggestedDescription:
      'MINT hasn’t suggested any milestones for your model that match your search. You may also try checking <link1>all available milestones</link1>. As you and your team fill out more of your <link2>Model Plan</link2>, MINT may display suggested common milestones that match your search. If you’re searching for a milestone that you believe should be a part of MINT, please contact the MINT Team at <email1>MINTTeam@cms.hhs.gov</email1>.',
    dontSeeMilestone: 'Don’t see a milestone you need?',
    checkMilestones:
      'Check <link1>all available milestones</link1> or <button1>add a custom milestone</button1>.',
    addCustomMilestone: 'Add a custom milestone',
    aboutSolution: 'About this solution',
    commonSolutions: 'Common solutions'
  },
  solutionLibrary: {
    heading: 'Solution library',
    description:
      'Browse common available operational solutions and IT systems and add them to your model-to-operations matrix. Solutions in this library include IT systems, contractors and contract vehicles, cross-cutting groups, and more. You will be able to associate these solutions with any relevant model milestones.',
    hideAdded: 'Hide added solutions ({{count}})',
    tabs: {
      allSolutions: 'All common solutions ({{count}})',
      itSystems: 'IT systems ({{count}})',
      contracts: 'Contracts and contractors ({{count}})',
      crossCutting: 'Cross-cutting groups ({{count}})'
    },
    dontSeeSolution: 'Don’t see the solution you need?',
    checkAllSolutions:
      'Check <link1>all available solutions</link1> or <button1>add a custom solution</button1>.',
    addCustomSolution: 'Add a custom solution',
    aboutThisSolution: 'About this solution',
    IT_SYSTEM: 'IT System',
    CONTRACTOR: 'Contract vehicle, contractor, or other contract',
    CROSS_CUTTING_GROUP: 'Cross-cutting group',
    OTHER: 'Other',
    emptyFilter: {
      heading: 'There are no {{solution}} that match your search.',
      text: 'Please double-check your search and try again. If you’re searching for {{solution}} that you believe should be a part of MINT, please contact the MINT Team at <link>MINTTeam@cms.hhs.gov</link>.'
    }
  },
  validation: {
    fillOut: 'Please fill out the required field.'
  }
};

export default modelToOperations;
