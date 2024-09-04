import { TranslationCollaborators } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const collaborators: TranslationCollaborators = {
  userID: {
    gqlField: 'userID',
    goField: 'UserID',
    dbField: 'user_id',
    label: 'User ID',
    dataType: TranslationDataType.UUID,
    formType: TranslationFormType.TEXT,
    order: 1.01,
    tableReference: TableName.USER_ACCOUNT
  },
  username: {
    gqlField: 'username',
    goField: 'Username',
    dbField: 'user_account.username',
    label: 'Team member name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.SELECT,
    order: 1.02
  },
  teamRoles: {
    gqlField: 'teamRoles',
    goField: 'TeamRoles',
    dbField: 'team_roles',
    label: 'Team member role(s)',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    order: 1.03,
    options: {
      CM_FFS_COUNTERPART: 'CM FFS counterpart',
      COR: `Contracting Officer's Representative (COR)`,
      EVALUATION: 'Evaluation',
      IT_LEAD: 'IT Lead',
      LEADERSHIP: 'Leadership',
      LEARNING: 'Learning',
      MODEL_LEAD: 'Model Lead',
      MODEL_TEAM: 'Model Team',
      OACT: 'Office of the Actuary (OACT)',
      PAYMENT: 'Payment',
      QUALITY: 'Quality'
    }
  }
};

type NestedTranslation = Record<string, string | string[]>;

export const collaboratorsMisc: Record<string, string | NestedTranslation> = {
  csvTitle: 'Collaborator',
  EUAID: 'EUA ID',
  roles: 'Role(s)',
  teamBreadcrumb: 'Add model team members',
  addATeamMember: 'Add a team member',
  updateATeamMember: 'Edit team member roles',
  addTeamMemberButton: 'Add team member',
  manageModelTeam: 'Manage model team',
  manageModelTeamInfo:
    'Add and remove model team members and manage their roles.',
  searchTeamInfo: 'Search for a team member to add to your model team.',
  startTyping:
    'Search by name. This field searches CMS’ EUA database. Looking up your team member will provide their name and email address.',
  teamInfo:
    'Team members are all eligible to view and edit all sections of a Model Plan, including uploading and removing documents as well as adding or removing team members.',
  searchMemberInfo:
    'This new team member will be able to view and edit anything about a Model Plan. Please make sure this individual should be able to do this before you proceed.',
  lastModelLeadMemberInfo:
    'If this team member is no longer the Model Lead, you must add a new Model Lead before removing that role for this team member.',
  dontAddTeamMember: 'Don’t add a team member and return to previous page',
  saveChanges: 'Save changes',
  dontUpdateTeamMember: 'Don’t edit roles and return to previous page',
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
    role: 'Role(s)',
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
    confirm: 'Remove team member',
    no: 'Keep team member',
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
  },
  teamRoles: '+ {{count}} role',
  teamRoles_other: '+{{count}} roles',
  rolesInfo: {
    label: 'What roles are available?',
    baseRoles: [
      '<bold>Model Lead:</bold> Individual(s) responsible for the overall design, development, and implementation of the model.',
      '<bold>IT Lead:</bold> Individual(s) responsible for coordinating IT implementation activities and timelines. The IT Lead also acts as a liaison to the other CMS components who own IT systems, such as OIT. This role is often a Business Services Group (BSG) team member.',
      '<bold>Leadership:</bold> Individuals in a leadership role overseeing the design, development, and/or implementation of this model.',
      '<bold>Model Team member:</bold> Other team members supporting this model.'
    ],
    workstreamLeads: 'Workstream leads',
    workstreamLeadsInfo:
      'These roles signify primary points of contact for specific model topics.',
    workstreamRoles: [
      '<bold>Evaluation:</bold> The individual primarily responsible for coordinating work related to evaluation of this model.',
      '<bold>Learning:</bold> The individual primarily responsible for coordinating work related to learning activities for this model.',
      '<bold>Payment:</bold> The individual primarily responsible for coordinating work related to payment considerations for this model.',
      '<bold>Quality:</bold> The individual primarily responsible for coordinating work related to quality and quality measures for this model.'
    ],
    otherRolesLabel: 'Other roles',
    otherRolesInfo:
      'These roles represent points of contact for contracts as well as partners across other CMS components.',
    otherRoles: [
      '<bold>Contracting Officer’s Representative (COR):</bold> A person responsible for all contracting tasks and activities related to the one or more contracts relied on by this model.',
      '<bold>Center for Medicare (CM) Fee-for-service (FFS) counterpart:</bold> The CM team member(s) primarily responsible for working with this model team, especially with regard to FFS considerations.',
      '<bold>Office of the Actuary (OACT):</bold> The OACT team member(s) primarily responsible for working with this model team.'
    ]
  }
};

export default collaborators;
