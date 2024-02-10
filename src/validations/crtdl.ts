import * as Yup from 'yup';

export const TDLValidationSchema = Yup.object().shape({
  idNumber: Yup.string().trim().required('Must enter an ID number'),
  title: Yup.string().required('Must enter a title'),
  dateInitiated: Yup.string().required('Must enter a intiated date')
});

export const CRValidationSchema = TDLValidationSchema.shape({
  dateImplementedMonth: Yup.string().required(
    'Must enter implementation date month'
  ),
  dateImplementedYear: Yup.string().required(
    'Must enter implementation date year'
  )
});
