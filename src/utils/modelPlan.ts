import { TeamRole } from 'gql/gen/graphql';
import i18next from 'i18next';
import { orderBy } from 'lodash';

import { GetModelCollaborators_modelPlan_collaborators as GetCollaboratorsType } from 'queries/Collaborators/types/GetModelCollaborators';
import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';
import {
  DocumentType,
  OperationalSolutionKey,
  OperationalSolutionSubtaskStatus
} from 'types/graphql-global-types';
import { getKeys } from 'types/translation';

/**
 * Translate the API enum to a human readable string
 */

export const translateSubtasks = (status: string) => {
  switch (status) {
    case OperationalSolutionSubtaskStatus.TODO:
      return i18next.t('itSolutions:subtasks.todo');
    case OperationalSolutionSubtaskStatus.IN_PROGRESS:
      return i18next.t('itSolutions:subtasks.inProgress');
    case OperationalSolutionSubtaskStatus.DONE:
      return i18next.t('itSolutions:subtasks.done');
    default:
      return '';
  }
};

export const translateOperationalSolutionKey = (
  key: OperationalSolutionKey
) => {
  switch (key) {
    case OperationalSolutionKey.CONTRACTOR:
      return i18next.t('itSolutions:operationalSolutionKey.contractor');
    case OperationalSolutionKey.CROSS_MODEL_CONTRACT:
      return i18next.t('itSolutions:operationalSolutionKey.crossModelContract');
    case OperationalSolutionKey.EXISTING_CMS_DATA_AND_PROCESS:
      return i18next.t(
        'itSolutions:operationalSolutionKey.existingCmsDataAndProcess'
      );
    case OperationalSolutionKey.INTERNAL_STAFF:
      return i18next.t('itSolutions:operationalSolutionKey.interalStaff');
    case OperationalSolutionKey.OTHER_NEW_PROCESS:
      return i18next.t('itSolutions:operationalSolutionKey.otherNewProcess');
    default:
      return '';
  }
};

export const translateOpNeedsStatusType = (type: string) => {
  switch (type) {
    case 'NOT_NEEDED':
      return i18next.t('itSolutions:status.notNeeded');
    case 'NOT_ANSWERED':
      return i18next.t('itSolutions:status.notAnswered');
    case 'NOT_STARTED':
      return i18next.t('itSolutions:status.notStarted');
    case 'ONBOARDING':
      return i18next.t('itSolutions:status.onboarding');
    case 'BACKLOG':
      return i18next.t('itSolutions:status.backlog');
    case 'IN_PROGRESS':
      return i18next.t('itSolutions:status.inProgress');
    case 'COMPLETED':
      return i18next.t('itSolutions:status.completed');
    case 'AT_RISK':
      return i18next.t('itSolutions:status.atRisk');
    default:
      return '';
  }
};

/**
 * Translate the document type API enum to a human readable string
 */

// TODO import gql gen document type
export const translateDocumentType = (documentType: DocumentType) => {
  switch (documentType) {
    case 'CONCEPT_PAPER':
      return i18next.t('documents:documentTypes.concept');
    case 'DESIGN_PARAMETERS_MEMO':
      return i18next.t('documents:documentTypes.designParamMemo');
    case 'POLICY_PAPER':
      return i18next.t('documents:documentTypes.policy');
    case 'ICIP_DRAFT':
      return i18next.t('documents:documentTypes.icipDraft');
    case 'MARKET_RESEARCH':
      return i18next.t('documents:documentTypes.marketResearch');
    case 'OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION':
      return i18next.t('documents:documentTypes.adminOfficePresentation');
    case 'OTHER':
      return i18next.t('documents:documentTypes.other');
    default:
      return '';
  }
};

// Sorts discussions by the most recent reply
export const sortRepliesByDate = (
  discussionA: DiscussionType,
  discussionB: DiscussionType
) => {
  if (
    (discussionA.replies[discussionA.replies.length - 1]?.createdDts || 0) <
    (discussionB.replies[discussionB.replies.length - 1]?.createdDts || 0)
  ) {
    return 1;
  }
  if (
    (discussionA.replies[discussionA.replies.length - 1]?.createdDts || 0) >
    (discussionB.replies[discussionB.replies.length - 1]?.createdDts || 0)
  ) {
    return -1;
  }
  return 0;
};

// Used to map MultiSelect options from Enums
export const mapMultiSelectOptions = (
  translationMethod: (key: string) => string,
  type: { [s: number]: string }
) =>
  Object.keys(type)
    .sort(sortOtherEnum)
    .map(key => ({
      value: key,
      label: translationMethod(key)
    }));

// Used to map MultiSelect options from Enums
export const composeMultiSelectOptions = (
  translationObject: Record<string, string>,
  sublabels?: Record<string, string>,
  disabledValue?: string
) =>
  getKeys(translationObject).map(key => ({
    value: key,
    label: translationObject[key],
    subLabel: sublabels ? sublabels[key] : null,
    isDisabled: key === disabledValue
  }));

// Sort mapped enums to be alphabetical and have 'OTHER' come last
export const sortOtherEnum = (a: string, b: string) => {
  if (
    b === 'NA' ||
    b === 'NO' ||
    b === 'NO_SELECTING_PARTICIPANTS' ||
    b === 'NO_COMMUNICATION' ||
    b === 'NO_IDENTIFIERS' ||
    b === 'NOT_APPLICABLE' ||
    b === 'NOT_PLANNING_TO_COLLECT_DATA' ||
    b === 'NOT_PLANNING_TO_SEND_DATA' ||
    b === 'NO_LEARNING_SYSTEM' ||
    b === 'NOT_APM' ||
    b === 'NONE_OF_THE_ABOVE'
  )
    return -1;
  if (a < b || b === 'OTHER') {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

// Sort possible operational needs
export const sortPossibleOperationalNeeds = (
  a: { name: string },
  b: { name: string }
) => {
  if (a.name === 'Other new process') return 1;

  if (b.name === 'Other new process') return -1;

  if (a.name < b.name) return -1;

  if (a.name > b.name) return 1;

  return 0;
};

export const sortPayTypeEnums = (a: string, b: string) => {
  if (a < b || b === 'GRANTS') {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

export const isUUID = (uuid: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  );

/* Takes first letter of first and last name */
/* i.e. Steve Rogers == SR */
export const getUserInitials = (user: string) =>
  user
    ?.split(' ')
    .map(name => returnValidLetter(name?.charAt(0)).toUpperCase())
    .join('');

// Check if a single character is a valid letter
export const returnValidLetter = (str: string) =>
  str.length === 1 && str.match(/[a-z]/i) ? str : '';

const orderByLastName = (object: any[]) =>
  orderBy(object, item => item.userAccount.commonName.split(' ')[1]);

export const collaboratorsOrderedByModelLeads = (
  collab: GetCollaboratorsType[]
) => {
  const modelLeads = orderByLastName(
    collab.filter(c => c.teamRoles.includes(TeamRole.MODEL_LEAD))
  );
  const everyoneElse = orderByLastName(
    collab.filter(c => !c.teamRoles.includes(TeamRole.MODEL_LEAD))
  );

  return [...modelLeads, ...everyoneElse];
};
