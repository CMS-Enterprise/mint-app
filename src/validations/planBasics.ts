import * as Yup from 'yup';

const datePickerSchema = Yup.date()
  .nullable()
  .notRequired()
  .min(new Date(), 'Date cannot be in the past');

const planBasicsSchema = {
  pageOneSchema: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().nullable().required('Enter the Model Category'),
    cmsCenters: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component')
  }),

  pageOneSchemaWithOther: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().nullable().required('Enter the Model Category'),
    cmsCenters: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component'),
    cmsOther: Yup.string().required('Please specific CMS Component')
  }),

  pageOneSchemaWithOtherAndCmmi: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().nullable().required('Enter the Model Category'),
    cmsCenters: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component'),
    cmsOther: Yup.string().required('Please specific CMS Component'),
    cmmiGroups: Yup.array().when('cmsCenters', {
      is: (val: [string]) => {
        return val.includes('CMMI');
      },
      then: Yup.array()
        .min(1, 'Select a CMMI Group')
        .required('Select a CMMI Group')
    })
  }),

  pageOneSchemaWithCmmiGroups: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    modelCategory: Yup.string().nullable().required('Enter the Model Category'),
    cmsCenters: Yup.array()
      .min(1, 'Select a CMS Component')
      .required('Select a CMS Component'),
    cmmiGroups: Yup.array().when('cmsCenters', {
      is: (val: [string]) => {
        return val.includes('CMMI');
      },
      then: Yup.array()
        .min(1, 'Select a CMMI Group')
        .required('Select a CMMI Group')
    })
  }),

  pageTwoSchema: Yup.object().shape({
    modelType: Yup.string().nullable().required('A model type is required')
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
    phasedIn: Yup.boolean().nullable().required('Please answer question')
  })
};

export default planBasicsSchema;
