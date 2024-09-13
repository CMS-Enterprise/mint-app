import * as Yup from 'yup';

const planBasicsSchema = Yup.object().shape({
  modelName: Yup.string().trim().required('Enter the Model Name'),
  basics: Yup.object().shape({
    modelCategory: Yup.string().nullable().required('Enter the Model Category'),
    cmsCenters: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component'),
    cmmiGroups: Yup.array().when('cmsCenters', {
      is: (val: [string]) => {
        return val.includes('CMMI');
      },
      then: schema =>
        schema.min(1, 'Select a CMMI Group').required('Select a CMMI Group')
    })
  })
});

export default planBasicsSchema;
