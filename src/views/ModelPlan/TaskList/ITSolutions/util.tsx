import React from 'react';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import {
  GetOperationalNeeds_modelPlan_operationalNeeds as GetOperationalNeedsOperationalNeedsType,
  GetOperationalNeeds_modelPlan_operationalNeeds_solutions_solutions as GetOperationalNeedsSolutionsType
} from 'queries/ITSolutions/types/GetOperationalNeeds';
import { OpSolutionStatus } from 'types/graphql-global-types';

import { OperationalNeedStatus } from './_components/NeedsStatus';

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
      if (need.solutions.solutions.length > 0) {
        operationalSolutions = operationalSolutions.concat(
          formatSolutionsFromNeed(need)
        );
      } else {
        operationalSolutions.push(
          emptySolution(need.nameOther || need.name, need.id)
        );
      }
    });
  return operationalSolutions;
};

// Utility to add the parent operational need data/name to each solution
const formatSolutionsFromNeed = (
  need: GetOperationalNeedsOperationalNeedsType
) => {
  return need.solutions.solutions
    .filter(solution => !solution.archived) // Don't display archived solutions in table
    .map(solution => {
      return { ...solution, needName: need.nameOther || need.name };
    });
};

// Utility to populate an empty solution from an operational need
const emptySolution = (needName: string | null, needID: string) => {
  return {
    __typename: 'OperationalSolution',
    id: needID,
    status: OpSolutionStatus.NOT_STARTED,
    needName,
    name: '',
    mustStartDts: null,
    mustFinishDts: null,
    archived: false,
    nameOther: null,
    key: null,
    pocEmail: null,
    pocName: null,
    createdBy: '',
    createdDts: ''
  } as GetOperationalNeedsSolutionsType;
};

// Returns operational need/solutions table action links according to status
export const returnActionLinks = (
  status: OperationalNeedStatus | OpSolutionStatus
): JSX.Element => {
  switch (status) {
    case OpSolutionStatus.AT_RISK:
    case OpSolutionStatus.COMPLETED:
    case OpSolutionStatus.BACKLOG:
    case OpSolutionStatus.IN_PROGRESS:
    case OpSolutionStatus.ONBOARDING:
      return (
        <>
          <UswdsReactLink to="/" className="margin-right-2">
            {i18next.t('itSolutions:itSolutionsTable.updateStatus')}
          </UswdsReactLink>
          <UswdsReactLink to="/">
            {i18next.t('itSolutions:itSolutionsTable.viewDetails')}
          </UswdsReactLink>
        </>
      );
    case OpSolutionStatus.NOT_STARTED:
      return (
        <UswdsReactLink to="/">
          {i18next.t('itSolutions:itSolutionsTable.changePlanAnswer')}
        </UswdsReactLink>
      );
    case OperationalNeedStatus.NOT_NEEDED:
      return (
        <UswdsReactLink to="/">
          {i18next.t('itSolutions:itSolutionsTable.changeAnswer')}
        </UswdsReactLink>
      );
    case OperationalNeedStatus.NOT_ANSWERED:
      return (
        <UswdsReactLink to="/">
          {i18next.t('itSolutions:itSolutionsTable.answer')}
        </UswdsReactLink>
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
        i18next.t('itSolutions:itSolutionsTable.updateStatus') +
        i18next.t('itSolutions:itSolutionsTable.viewDetails')
      );
    case OpSolutionStatus.NOT_STARTED:
      return i18next.t('itSolutions:itSolutionsTable.changePlanAnswer');
    case OperationalNeedStatus.NOT_NEEDED:
      return i18next.t('itSolutions:itSolutionsTable.changeAnswer');
    case OperationalNeedStatus.NOT_ANSWERED:
      return i18next.t('itSolutions:itSolutionsTable.answer');
    default:
      return '';
  }
};
