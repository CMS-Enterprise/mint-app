import * as Yup from 'yup';

const planBasicsSchema = {
  pageOneSchema: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().required('Enter the Model Category'),
    asdf: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
    cmsComponent: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component')
  }),

  pageOneSchemaWithCmmiGroup: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().required('Enter the Model Category'),
    asdf: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
    cmsComponent: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component'),
    cmmiGroup: Yup.array()
      .min(1, 'Select a CMMI Group')
      .required('Select a CMMI Group')
  })
};

export default planBasicsSchema;
