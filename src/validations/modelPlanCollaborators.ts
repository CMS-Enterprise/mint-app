import * as Yup from 'yup';

const CollaboratorsValidationSchema = Yup.object().shape({
  userAccount: Yup.object().shape({
    commonName: Yup.string().trim().required('Enter a team member name')
  }),
  teamRoles: Yup.array()
    .of(Yup.string())
    .required('Enter a role for this team member')
});

export default CollaboratorsValidationSchema;
