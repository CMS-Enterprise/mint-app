const feedback = {
  // Report a problem
  reportHeading: 'Report a problem',
  reportSubheading:
    'Did you notice something wrong with MINT? Let us know using the form below.',
  isAnonymousSubmission: {
    label: 'Would you like your feedback to remain anonymous?',
    sublabel:
      'If you select yes, your name and email will not be recorded with your feedback.',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  allowContact: {
    label: 'May the MINT team contact you for additional information?',
    sublabel:
      'If you choose to remain anonymous, we will be unable to contact you.',
    options: {
      true: 'Yes',
      false: 'No'
    }
  },
  section: {
    label: 'Which part of MINT were you using when you encountered an issue?',
    options: {
      READ_VIEW: 'Model Plan Read View',
      TASK_LIST: 'Model Plan',
      IT_SOLUTIONS: 'IT solution and implementation status tracker',
      HELP_CENTER: 'Help Center',
      OTHER: 'Other (please specify)'
    }
  },
  whatDoing: {
    label: 'What were you doing?'
  },
  whatWentWrong: {
    label: 'What went wrong?'
  },
  severity: {
    label: 'How severe was this problem?',
    options: {
      PREVENTED_TASK: 'It prevented me from completing my task',
      DELAYED_TASK: 'It delayed completion of my task',
      MINOR: 'It was a minor annoyance',
      OTHER: 'Other (please specify)'
    }
  },

  // Send Feedback
  feedbackHeading: 'Send feedback',
  feedbackSubheading:
    'Have a suggestion for how to improve MINT? Let us know using the form below.',
  cmsRole: {
    label: 'What is your role?'
  },
  mintUsedFor: {
    label: 'What have you used MINT for?',
    options: {
      VIEW_MODEL: 'To view Model Plans',
      EDIT_MODEL: 'To edit Model Plans',
      SHARE_MODEL: 'To share or export Model Plan content',
      TRACK_SOLUTIONS: 'To track operational solutions',
      CONTRIBUTE_DISCUSSIONS: 'To contribute to Model Discussions',
      VIEW_HELP: 'To view the Help Center',
      OTHER: 'Other (please specify)'
    }
  },
  systemEasyToUse: {
    label: 'The system is easy to use.',
    options: {
      AGREE: 'Agree',
      DISAGREE: 'Disagree',
      UNSURE: 'I’m not sure (please explain)'
    }
  },
  howSatisfied: {
    label: 'Overall, how satisfied are you with MINT?',
    options: {
      VERY_SATISFIED: 'Very satisfied',
      SATISFIED: 'Satisfied',
      NEUTRAL: 'Neutral',
      DISSATISFIED: 'Dissatisfied',
      VERY_DISSATISFIED: 'Very dissatisfied'
    }
  },
  howCanWeImprove: {
    label: 'How can we improve MINT?'
  },

  // Miscellaneous
  sendReport: 'Send report',
  sendFeedback: 'Send feedback',
  closeTab: 'Close tab without sending report',
  thanksforFeedback: 'Thank you for your feedback',
  feedbackReceived:
    'The MINT team has received your report and will review it.',
  closeAndReturn: 'Close tab and return to MINT',
  sendAnother: 'Send another report',
  reportWithMint: 'Report a problem with MINT',
  sendFeedbackWithMint: 'Send feedback to the MINT Team',
  footer: {
    improveMint: 'Want to help improve MINT?',
    reportProblem: 'Report a problem',
    sendFeedback: 'Send feedback',
    chatSlack: 'Chat with us on CMS Slack'
  },
  errorFeedback:
    'There was an error submitting your feedback. Please try again.'
};

export default feedback;
