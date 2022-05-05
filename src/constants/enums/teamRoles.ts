import { TeamRole } from 'types/graphql-global-types';

type teamRolesType = {
  [MODEL_LEAD: string]: string;
};

const teamRoles: teamRolesType = TeamRole;

export default teamRoles;
