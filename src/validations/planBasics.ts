import * as Yup from 'yup';

const datePickerSchema = Yup.date()
  .nullable()
  .min(new Date(), 'Date cannot be in the past');

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
    modelType: Yup.string().required('A model type is required')
  }),

  pageThreeSchema: Yup.object().shape({
    completeICIP: datePickerSchema,
    clearanceStarts: datePickerSchema,
    clearanceEnds: datePickerSchema,
    announced: datePickerSchema,
    applicationsStart: datePickerSchema,
    applicationsEnd: datePickerSchema,
    performancePeriodStarts: datePickerSchema,
    performancePeriodEnds: datePickerSchema,
    wrapUpEnds: datePickerSchema,
    phasedIn: Yup.boolean().required('Please answer question')
  })
};

export default planBasicsSchema;
