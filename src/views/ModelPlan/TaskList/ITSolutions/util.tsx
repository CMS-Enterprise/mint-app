import React from 'react';
import {
  GetOperationalNeedsQuery,
  OperationalNeedKey,
  OpSolutionStatus
} from 'gql/gen/graphql';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import operationalNeedMap from 'data/operationalNeedMap';

import { OperationalNeedStatus } from './_components/NeedsStatus';

type GetOperationalNeedsOperationalNeedsType = GetOperationalNeedsQuery['modelPlan']['operationalNeeds'][0];
type GetOperationalNeedsSolutionsType = GetOperationalNeedsQuery['modelPlan']['operationalNeeds'][0]['solutions'][0];

// Utility function for getting a list of operational needs that are not answered/needed
export const filterPossibleNeeds = (
  needs: GetOperationalNeedsOperationalNeedsType[]
) => {
  return needs
    .filter(need => !need.needed)
    .map(need => {
      return {
        ...need,
        status:
          need.needed === null
            ? OperationalNeedStatus.NOT_ANSWERED
            : OperationalNeedStatus.NOT_NEEDED
      };
    });
};

// Utility function for formatting solutions of needed operational needs
export const filterNeedsFormatSolutions = (
  needs: GetOperationalNeedsOperationalNeedsType[]
) => {
  let operationalSolutions: GetOperationalNeedsSolutionsType[] = [];
  needs
    .filter(need => need.needed)
    .forEach(need => {
      if (need.solutions.length > 0) {
        operationalSolutions = operationalSolutions.concat(
          formatSolutionsFromNeed(need)
        );
      } else {
        operationalSolutions.push(
          emptySolution(need.nameOther || need.name, need.id, need.key)
        );
      }
    });
  return operationalSolutions;
};

// Utility to add the parent operational need data/name to each solution
const formatSolutionsFromNeed = (
  need: GetOperationalNeedsOperationalNeedsType
) => {
  return need.solutions
    .filter(solution => solution.needed) // Don't display !needed solutions in table
    .map(solution => {
      return {
        ...solution,
        needName: need.nameOther || need.name,
        needKey: need.key,
        needID: need.id
      };
    });
};

// Utility to populate an empty solution from an operational need
const emptySolution = (
  needName: string | null | undefined,
  needID: string,
  key?: OperationalNeedKey | null
) => {
  return {
    __typename: 'OperationalSolution',
    id: needID,
    status: OpSolutionStatus.NOT_STARTED,
    otherHeader: '',
    needName,
    name: '',
    mustStartDts: null,
    mustFinishDts: null,
    needed: false,
    nameOther: null,
    key,
    operationalSolutionSubtasks: [],
    pocEmail: null,
    pocName: null,
    createdBy: '',
    createdDts: ''
  } as GetOperationalNeedsSolutionsType;
};

// Used to type as solution with a need key
interface SolutionAsNeed extends GetOperationalNeedsOperationalNeedsType {
  needKey?: string;
  needID: string;
}

// Returns operational need/solutions table action links according to status
export const returnActionLinks = (
  status: OperationalNeedStatus | OpSolutionStatus,
  operationalNeed: SolutionAsNeed,
  modelID: string,
  readOnly?: boolean
): JSX.Element => {
  const operationalNeedKey = operationalNeed.key || operationalNeed.needKey;

  const operationalNeedObj = operationalNeedMap[operationalNeedKey || 'NONE'];

  const solutionActionLinks = (
    <>
      <UswdsReactLink
        to={`/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeed.needID}/solution-implementation-details/${operationalNeed.id}`}
        className={`margin-right-2${readOnly ? ' display-block' : ''}`}
      >
        {i18next.t('opSolutionsMisc:itSolutionsTable.updateStatus')}
      </UswdsReactLink>
      <UswdsReactLink
        to={`/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeed.needID}/${operationalNeed.id}/solution-details`}
      >
        {i18next.t('opSolutionsMisc:itSolutionsTable.viewDetails')}
      </UswdsReactLink>
    </>
  );

  // Custom Need without a defined solution, render `Update operational need`
  if (
    !operationalNeed.nameOther &&
    !operationalNeed.key &&
    !operationalNeed.needKey
  ) {
    return (
      <UswdsReactLink
        to={`/models/${modelID}/collaboration-area/task-list/it-solutions/update-need/${operationalNeed.id}`}
      >
        {i18next.t('opSolutionsMisc:itSolutionsTable.updateNeed')}
      </UswdsReactLink>
    );
  }

  // if row is a predefined operational solution and not an operational need/custom solution, return solutionActionLinks
  if (!operationalNeedObj) {
    return solutionActionLinks;
  }

  // Otherwise check the status of the operational need and return the relevant link
  switch (status) {
    case OpSolutionStatus.AT_RISK:
    case OpSolutionStatus.COMPLETED:
    case OpSolutionStatus.BACKLOG:
    case OpSolutionStatus.IN_PROGRESS:
    case OpSolutionStatus.ONBOARDING:
      return solutionActionLinks;
    case OpSolutionStatus.NOT_STARTED:
      if (operationalNeed.nameOther) {
        return solutionActionLinks;
      }
      return (
        <UswdsReactLink
          to={{
            pathname: `/models/${modelID}/collaboration-area/task-list/${operationalNeedObj.route}`,
            state: { scrollElement: operationalNeedObj.fieldName.toString() }
          }}
        >
          {i18next.t('opSolutionsMisc:itSolutionsTable.changePlanAnswer')}
        </UswdsReactLink>
      );
    case OperationalNeedStatus.NOT_NEEDED:
      return operationalNeedObj ? (
        <UswdsReactLink
          to={{
            pathname: `/models/${modelID}/collaboration-area/task-list/${operationalNeedObj.route}`,
            state: { scrollElement: operationalNeedObj.fieldName.toString() }
          }}
        >
          {i18next.t('opSolutionsMisc:itSolutionsTable.changeAnswer')}
        </UswdsReactLink>
      ) : (
        <></>
      );
    case OperationalNeedStatus.NOT_ANSWERED:
      return operationalNeedObj ? (
        <UswdsReactLink
          to={{
            pathname: `/models/${modelID}/collaboration-area/task-list/${operationalNeedObj.route}`,
            state: {
              scrollElement:
                typeof operationalNeedObj.fieldName !== 'string'
                  ? operationalNeedObj.fieldName[0]
                  : operationalNeedObj.fieldName
            }
          }}
        >
          {i18next.t('opSolutionsMisc:itSolutionsTable.answer')}
        </UswdsReactLink>
      ) : (
        <></>
      );
    default:
      return <></>;
  }
};

// Returns operational need/solutions table action text to for global query
export const returnActionText = (
  status: OperationalNeedStatus | OpSolutionStatus
): string => {
  switch (status) {
    case OpSolutionStatus.AT_RISK:
    case OpSolutionStatus.COMPLETED:
    case OpSolutionStatus.BACKLOG:
    case OpSolutionStatus.IN_PROGRESS:
    case OpSolutionStatus.ONBOARDING:
      return (
        i18next.t('opSolutionsMisc:itSolutionsTable.updateStatus') +
        i18next.t('opSolutionsMisc:itSolutionsTable.viewDetails')
      );
    case OpSolutionStatus.NOT_STARTED:
      return i18next.t('opSolutionsMisc:itSolutionsTable.changePlanAnswer');
    case OperationalNeedStatus.NOT_NEEDED:
      return i18next.t('opSolutionsMisc:itSolutionsTable.changeAnswer');
    case OperationalNeedStatus.NOT_ANSWERED:
      return i18next.t('opSolutionsMisc:itSolutionsTable.answer');
    default:
      return '';
  }
};
