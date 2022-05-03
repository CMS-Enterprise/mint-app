import * as Yup from 'yup';

const planBasicsSchema = {
  garyTest: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().required('Enter the Model Category'),
    cmsCenter: Yup.string().required('Gary gary gary')
  }),

  garyTestWithExtras: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().required('Enter the Model Category'),
    cmsCenter: Yup.string().required('Gary gary gary'),
    cmmiGroup: Yup.array()
      .min(1, 'Select a CMMI Group')
      .required('Select a CMMI Group')
  }),

  pageOneSchema: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().required('Enter the Model Category'),
    cmsCenter: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component')
  }),

  pageOneSchemaWithCmmiGroup: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().required('Enter the Model Category'),
    cmsCenter: Yup.array()
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
  })
};

export default planBasicsSchema;
