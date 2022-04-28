import * as Yup from 'yup';

const planBasicsPageOneSchema = Yup.object().shape({
  modelName: Yup.string().trim().required('Enter the Model Name'),
  modelCategory: Yup.string().required('Enter the Model Category'),
  cmsComponent: Yup.array()
    .min(1, 'Select a CMS Component')
    .required('Select a CMS Component')
});

export default planBasicsPageOneSchema;
