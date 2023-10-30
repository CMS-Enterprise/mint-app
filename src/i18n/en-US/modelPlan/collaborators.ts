import { TranslationCollaborators } from 'types/translation';

export const collaborators: TranslationCollaborators = {
  username: {
    gqlField: 'username',
    goField: 'Username',
    dbField: 'username',
    label: 'Team member name',
    dataType: 'string',
    formType: 'select'
  },
  teamRole: {
    gqlField: 'teamRole',
    goField: 'TeamRole',
    dbField: 'team_role',
    label: 'Team member role(s)',
    dataType: 'enum',
    formType: 'select',
    options: {
      EVALUATION: 'Evaluation',
      IT_LEAD: 'IT Lead',
      LEADERSHIP: 'Leadership',
      LEARNING: 'Learning',
      MODEL_LEAD: 'Model Lead',
      MODEL_TEAM: 'Model Team',
      OACT: 'OACT',
      PAYMENT: 'Payment',
      QUALITY: 'Quality'
    }
  }
};

type NestedTranslation = Record<string, string>;

export const collaboratorsMisc: Record<string, string | NestedTranslation> = {
  csvTitle: 'Collaborator',
  EUAID: 'EUA ID',
  roles: 'Role(s)',
  teamBreadcrumb: 'Add model team members',
  addATeamMember: 'Add a team member',
  updateATeamMember: 'Edit a team member',
  addTeamMemberButton: 'Add team member',
  updateTeamMember: 'Update team member',
  manageModelTeam: 'Manage model team',
  manageModelTeamInfo:
    'Add and remove model team members and manage their roles.',
  searchTeamInfo: 'Search for a team member to add to your model team.',
  startTyping: 'Start typing the person’s name you want to add',
  teamInfo:
    'Team members are all eligible to view and edit all sections of a Model Plan, including uploading and removing documents as well as adding or removing team members.',
  searchMemberInfo:
    'This new team member will be able to view and edit anything about a model plan. Please make sure this individual should be able to do this before you proceed.',
  lastModelLeadMemberInfo:
    'If this team member is no longer the Model Lead, you must add a new Model Lead before removing that role for this team member.',
  dontAddTeamMember: 'Don’t add a team member and return to the previous page',
  dontUpdateTeamMember:
    'Don’t edit a team member and return to the previous page',
  successMessage: 'Success! {{-collaborator}} has been added as {{-role}}.',
  successUpdateMessage:
    'Success! {{-collaborator}} has been updated as {{-role}}.',
  existingMember:
    'This person is already a member of your model team. Please select a different person to add to your team.',
  headingTeamMembers: 'Add model team members',
  teamMemberInfo:
    'Add any team members who will be collaborating on your Model Plan. You can edit this list at any time.',
  addTeamMembers: 'Add model team members',
  addTeamMembersInfo:
    'Add any team members who will be collaborating on your Model Plan.  You can edit this list at any time.',
  teamMembers: 'Team members',
  table: {
    name: 'Name',
    role: 'Role',
    dateAdded: 'Date added',
    actions: 'Actions',
    edit: 'Edit',
    remove: 'Remove',
    noCollaborators: 'No associated team members',
    noCollaboratorsInfo: 'Please add any team members'
  },
  continueWithoutAdding: 'Continue without adding team members',
  teamMemberName: 'Team member name',
  teamMemberRole: 'Team member role',
  addAnotherMember: 'Add another team member',
  modal: {
    heading: 'Are you sure you want to remove {{-collaborator}}?',
    subheading:
      '​​This team member will not be able to edit this Model Plan after they have been removed.',
    confirm: 'Yes, remove team member',
    no: 'No, keep team member',
    remove: 'Remove'
  },
  selfModal: {
    heading: 'Are you sure you want to remove yourself?',
    subheading:
      'You will not be able to edit this Model Plan after you have been removed.',
    confirm: 'Remove yourself',
    no: 'Keep yourself'
  },
  success: {
    heading: 'Success! You have removed yourself from {{-modelName}}.',
    message:
      'If you need to edit the Model Plan in the future, please contact a member of the model team or the MINT Team.'
  }
};

export default collaborators;
