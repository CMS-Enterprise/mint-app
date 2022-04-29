import * as Yup from 'yup';

const planBasicsPageOneSchema = Yup.object().shape({
  modelName: Yup.string().trim().required('Enter the Model Name'),
  modelCategory: Yup.string().required('Enter the Model Category'),
  asdf: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
  cmsComponent: Yup.array()
    .min(1, 'Select a CMS Component')
    .required('Select a CMS Component')
  // cmmiGroup: Yup.array()
  //   .min(1, 'Select a CMMI Group')
  //   .required('Select a CMMI Group')
  // cmmiGroup: Yup.array().when('cmsComponent', (cmsComponent: string[]) => (cmsComponent === ['CMMI']),
  //   then: Yup.array()
  //     .min(1, 'Select a CMMI Group')
  //     .required('Select a CMMI Group')
  // ),
  // voyageEndDate: Yup.date().when('voyageStartDate', (voyageStartDate, schema) =>
  //   moment(voyageStartDate).isValid() ? schema.min(voyageStartDate) : schema
  // )
  // email: Yup.string()
  //   .email()
  //   .when('showEmail', showEmail => {
  //     if (showEmail) return Yup.string().required('Must enter email address');
  //   }),
});

export default planBasicsPageOneSchema;
