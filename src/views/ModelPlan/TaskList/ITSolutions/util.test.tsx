import React from 'react';
import { GetOperationalNeeds_modelPlan_operationalNeeds as GetOperationalNeedsOperationalNeedsType } from 'gql/gen/types/GetOperationalNeeds';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import {
  OperationalNeedKey,
  OpSolutionStatus
} from 'types/graphql-global-types';

import { OperationalNeedStatus } from './_components/NeedsStatus';
import { GetOperationalNeedsTableType } from './Home/operationalNeedsTable';
import {
  filterNeedsFormatSolutions,
  filterPossibleNeeds,
  returnActionLinks
} from './util';

const modelID = 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06';

const operationalNeed: any = {
  needKey: OperationalNeedKey.ACQUIRE_AN_EVAL_CONT,
  needID: '0b9e42ff-05b3-45c1-9464-5041307d1671',
  id: 'b7290d2c-0eae-4df4-8657-b22b5df3159e'
};

describe('Operational Solutions Util', () => {
  it('returns formatted needed solutions', async () => {
    expect(
      filterNeedsFormatSolutions([
        {
          name: 'Recruit participants',
          needed: true,
          solutions: [
            {
              name: 'Salesforce',
              needed: true
            }
          ]
        }
      ] as GetOperationalNeedsOperationalNeedsType[])
    ).toEqual([
      {
        name: 'Salesforce',
        needed: true,
        needName: 'Recruit participants'
      }
    ]);
  });

  it('returns formatted possible', async () => {
    const possibleNeed = {
      name: 'Recruit participants',
      __typename: 'OperationalNeed',
      key: OperationalNeedKey.RECRUIT_PARTICIPANTS,
      needed: false,
      solutions: [
        {
          name: 'Salesforce'
        }
      ]
    } as GetOperationalNeedsOperationalNeedsType;
    expect(filterPossibleNeeds([possibleNeed])).toEqual([
      { ...possibleNeed, status: OperationalNeedStatus.NOT_NEEDED }
    ]);
  });

  it('returns Action link per status value', async () => {
    expect(
      returnActionLinks(
        OpSolutionStatus.NOT_STARTED,
        operationalNeed as GetOperationalNeedsTableType,
        modelID
      )
    ).toEqual(
      <UswdsReactLink
        to={{
          pathname: `/models/${modelID}/task-list/ops-eval-and-learning/evaluation`,
          state: {
            scrollElement: 'evaluationApproaches'
          }
        }}
      >
        {i18next.t('opSolutionsMisc:itSolutionsTable.changePlanAnswer')}
      </UswdsReactLink>
    );

    expect(
      returnActionLinks(
        OpSolutionStatus.ONBOARDING,
        operationalNeed as GetOperationalNeedsTableType,
        modelID
      )
    ).toEqual(
      <>
        <UswdsReactLink
          to={`/models/${modelID}/task-list/it-solutions/${operationalNeed.needID}/solution-implementation-details/${operationalNeed.id}`}
          className="margin-right-2"
        >
          {i18next.t('opSolutionsMisc:itSolutionsTable.updateStatus')}
        </UswdsReactLink>
        <UswdsReactLink
          to={`/models/${modelID}/task-list/it-solutions/${operationalNeed.needID}/${operationalNeed.id}/solution-details`}
        >
          {i18next.t('opSolutionsMisc:itSolutionsTable.viewDetails')}
        </UswdsReactLink>
      </>
    );

    expect(
      returnActionLinks(
        OperationalNeedStatus.NOT_NEEDED,
        operationalNeed as GetOperationalNeedsTableType,
        modelID
      )
    ).toEqual(
      <UswdsReactLink
        to={{
          pathname: `/models/${modelID}/task-list/ops-eval-and-learning/evaluation`,
          state: {
            scrollElement: 'evaluationApproaches'
          }
        }}
      >
        {i18next.t('opSolutionsMisc:itSolutionsTable.changeAnswer')}
      </UswdsReactLink>
    );
  });
});
