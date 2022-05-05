import * as Yup from 'yup';

const NewModelPlanValidationSchema = Yup.object().shape({
  modelName: Yup.string().trim().required('Enter the model Name')
});

export default NewModelPlanValidationSchema;
