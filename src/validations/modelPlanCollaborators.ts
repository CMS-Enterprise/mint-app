import * as Yup from 'yup';

const CollaboratorsValidationSchema = Yup.object().shape({
  fullName: Yup.string().trim().required('Enter a team member name'),
  teamRole: Yup.string().required('Enter a role for this team member')
});

export default CollaboratorsValidationSchema;
