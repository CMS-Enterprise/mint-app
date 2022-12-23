import * as Yup from 'yup';

const planBasicsSchema = {
  pageOneSchema: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    basics: Yup.object().shape({
      modelCategory: Yup.string()
        .nullable()
        .required('Enter the Model Category'),
      cmsCenters: Yup.array()
        .min(1, 'Select a CMS Component')
        .required('Select a CMS Component')
    })
  }),

  pageOneSchemaWithOther: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    basics: Yup.object().shape({
      modelCategory: Yup.string()
        .nullable()
        .required('Enter the Model Category'),
      cmsCenters: Yup.array()
        .min(1, 'Select a CMS Component')
        .required('Select a CMS Component'),
      cmsOther: Yup.string().required('Please specific CMS Component')
    })
  }),

  pageOneSchemaWithOtherAndCmmi: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    basics: Yup.object().shape({
      modelCategory: Yup.string()
        .nullable()
        .required('Enter the Model Category'),
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
    })
  }),

  pageOneSchemaWithCmmiGroups: Yup.object().shape({
    modelName: Yup.string().trim().required('Enter the Model Name'),
    basics: Yup.object().shape({
      modelCategory: Yup.string()
        .nullable()
        .required('Enter the Model Category'),
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
    })
  }),

  pageThreeSchema: Yup.object().shape({
    phasedIn: Yup.boolean().nullable().required('Please answer question')
  })
};

export default planBasicsSchema;
