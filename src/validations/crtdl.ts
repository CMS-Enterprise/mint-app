import * as Yup from 'yup';

const CRTDLValidationSchema = Yup.object().shape({
  idNumber: Yup.string().trim().required('Enter an ID number'),
  dateInitiated: Yup.string().required('Enter a date initiated'),
  title: Yup.string().required('Enter a title')
});

export default CRTDLValidationSchema;
