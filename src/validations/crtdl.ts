import * as Yup from 'yup';

const CRTDLValidationSchema = Yup.object().shape({
  idNumber: Yup.string().trim().required('Enter an ID number'),
  title: Yup.string().required('Enter a title'),
  dateInitiated: Yup.string().required('Enter a date initiated')
  // dateImplementedMonth: Yup.string().when('type', {
  //   is: true,
  //   then: Yup.string().required('Must enter implementation date month')
  // })
});

export default CRTDLValidationSchema;
