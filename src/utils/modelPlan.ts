import {
  GetModelCollaboratorsQuery,
  GetModelPlanQuery,
  TeamRole
} from 'gql/generated/graphql';
import { orderBy } from 'lodash';

import { getKeys } from 'types/translation';

type GetCollaboratorsType =
  GetModelCollaboratorsQuery['modelPlan']['collaborators'][0];
type DiscussionType = GetModelPlanQuery['modelPlan']['discussions'][0];

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

const orderByLastName = (object: any[], order?: boolean | 'asc' | 'desc') =>
  orderBy(object, item => item.userAccount.commonName.split(' ')[1], [
    order ?? false
  ]);

export const collaboratorsOrderedByModelLeads = (
  collab: GetCollaboratorsType[],
  order?: boolean | 'asc' | 'desc'
) => {
  const modelLeads = orderByLastName(
    collab.filter(
      c => c.teamRoles.includes(TeamRole.MODEL_LEAD),
      order ?? false
    )
  );
  const everyoneElse = orderByLastName(
    collab.filter(
      c => !c.teamRoles.includes(TeamRole.MODEL_LEAD),
      order ?? false
    )
  );

  return [...modelLeads, ...everyoneElse];
};

// Used to conditionally insert items into an array literal
export const insertIf = (condition: boolean, ...elements: any) => {
  return condition ? elements : [];
};

export const covertToLowercaseAndDashes = (string: string) =>
  string.toLowerCase().replace(/\s+/g, '-');
