const readOnlyModelPlan = {
  heading: 'CMMI Models and Demonstrations',
  subheading:
    'Here you can find information about all CMMI models and demonstrations.',
  allModelsLink: 'Jump to all models',
  following: {
    heading: 'Models you’re following',
    subheading:
      'You will receive email notifications when models you’re following are updated.',
    alert: {
      heading: 'You are not following any models yet.',
      subheadingPartA: 'Click the star icon',
      subheadingPartB: 'for any model to add it to this section.'
    }
  },
  allModels: {
    heading: 'All models',
    subheading:
      'Follow models that you want to stay up to date on by clicking the star icon.',
    tableHeading: {
      modelName: 'Model name',
      category: 'Category',
      status: 'Status',
      startDate: 'Model start date',
      crsAndTdls: 'CRs and TDLs'
    },
    noResults: {
      heading: 'We couldn’t find any matches for "{{-searchTerm}}".',
      subheading:
        'Double check your search for typos or try a different search.'
    }
  },
  opsEvalAndLearning: {
    headings: {
      iddoc: 'IDDOC Operations',
      icd: 'Interface Control Document (ICD)',
      testing: 'Testing',
      dataMonitoring: 'Data Monitoring',
      ccw: 'Chronic Conditions Warehouse (CCW)',
      quality: 'Quality',
      data: 'Data Sharing, Collection, and Reporting Timing and Frequency'
    },
    anotherAgency:
      'Will another Agency or State help design/operate the model?',
    evaluationApproach: 'What type of evaluation approach are you considering?',
    dataNeeded: 'What data do you need to monitor the model?',
    dataToSend: 'What data will you send to participants?',
    riskAdj: {
      performanceScores:
        'Will you make risk adjustments to performance scores?',
      feedbackResults: 'Will you make risk adjustments to feedback results?',
      payments: 'Will you make risk adjustments to payments?',
      others: 'Will you make risk adjustments to others?'
    },
    appeal: {
      performanceScores:
        'Will participants be able to appeal performance scores?',
      feedbackResults: 'Will participants be able to appeal feedback results?',
      payments: 'Will participants be able to appeal payments?',
      others: 'Will participants be able to appeal others?'
    }
  }
};

export default readOnlyModelPlan;
