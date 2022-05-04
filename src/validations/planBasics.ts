import * as Yup from 'yup';

const planBasicsSchema = {
  pageOneSchema: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().required('Enter the Model Category'),
    cmsCenters: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component')
  }),

  pageOneSchemaWithCmmiGroup: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().required('Enter the Model Category'),
    cmsCenters: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component'),
    cmmiGroup: Yup.array()
      .min(1, 'Select a CMMI Group')
      .required('Select a CMMI Group')
  }),

  pageTwoSchema: Yup.object().shape({
    modelType: Yup.string().required('A model type is required'),
    problem: Yup.string().trim().required('Tell us about the problem'),
    goal: Yup.string().trim().required('Tell us about the goal'),
    testInterventions: Yup.string()
      .trim()
      .required('Tell us about the test interventions')
  }),

  pageThreeSchema: Yup.object().shape({
    completeICIP: Yup.date().required('Please enter a date'),
    clearanceStarts: Yup.date().required('Please enter a date'),
    clearanceEnds: Yup.date().required('Please enter a date'),
    announced: Yup.date().required('Please enter a date'),
    applicationsStart: Yup.date().required('Please enter a date'),
    applicationsEnd: Yup.date().required('Please enter a date'),
    performancePeriodStarts: Yup.date().required('Please enter a date'),
    performancePeriodEnds: Yup.date().required('Please enter a date'),
    wrapUpEnds: Yup.date().required('Please enter a date'),
    phasedIn: Yup.string().required('Please answer question')
  })
};

export default planBasicsSchema;
