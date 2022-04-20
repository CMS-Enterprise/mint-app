import i18next from 'i18next';
/**
 * Translate the API enum to a human readable string
 */
const translateTeamRole = (teamRole: string) => {
  switch (teamRole) {
    case 'MODEL_LEAD':
      return i18next.t('modelPlan:teamRoles.modelLead');
    default:
      return '';
  }
};

export default translateTeamRole;
