import React from 'react';
import {
  GetOperationalNeedsQuery,
  OperationalNeedKey,
  OperationalSolutionKey,
  OpSolutionStatus
} from 'gql/gen/graphql';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';

import { OperationalNeedStatus } from './_components/NeedsStatus';
import { GetOperationalNeedsTableType } from './Home/operationalNeedsTable';
import {
  filterNeedsFormatSolutions,
  filterPossibleNeeds,
  returnActionLinks
} from './util';

type GetOperationalNeedsOperationalNeedsType = GetOperationalNeedsQuery['modelPlan']['operationalNeeds'];

const modelID = 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06';

const operationalNeed: any = {
  needKey: OperationalNeedKey.ACQUIRE_AN_EVAL_CONT,
  needID: '0b9e42ff-05b3-45c1-9464-5041307d1671',
  id: 'b7290d2c-0eae-4df4-8657-b22b5df3159e'
};

const needs: GetOperationalNeedsOperationalNeedsType = [
  {
    __typename: 'OperationalNeed',
    id: 'b7290d2c-0eae-4df4-8657-b22b5df3159e',
    modelPlanID: 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06',
    name: 'Recruit participants',
    key: OperationalNeedKey.RECRUIT_PARTICIPANTS,
    nameOther: null,
    modifiedDts: '2021-08-10T14:00:00Z',
    needed: true,
    solutions: [
      {
        __typename: 'OperationalSolution',
        id: 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06',
        mustFinishDts: null,
        mustStartDts: null,
        status: OpSolutionStatus.NOT_STARTED,
        createdBy: 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06',
        createdDts: '2021-08-10T14:00:00Z',
        name: 'Salesforce',
        needed: true,
        key: OperationalSolutionKey.APPS,
        operationalSolutionSubtasks: []
      }
    ]
  }
];

describe('Operational Solutions Util', () => {
  it('returns formatted needed solutions', async () => {
    expect(filterNeedsFormatSolutions(needs)).toEqual([
      {
        __typename: 'OperationalSolution',
        id: 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06',
        mustFinishDts: null,
        mustStartDts: null,
        status: OpSolutionStatus.NOT_STARTED,
        createdBy: 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06',
        createdDts: '2021-08-10T14:00:00Z',
        needID: 'b7290d2c-0eae-4df4-8657-b22b5df3159e',
        needKey: 'RECRUIT_PARTICIPANTS',
        needName: 'Recruit participants',
        name: 'Salesforce',
        needed: true,
        key: OperationalSolutionKey.APPS,
        operationalSolutionSubtasks: []
      }
    ]);
  });

  it('returns formatted possible', async () => {
    const possibleNeeds: GetOperationalNeedsOperationalNeedsType = [
      {
        __typename: 'OperationalNeed',
        id: 'b7290d2c-0eae-4df4-8657-b22b5df3159e',
        modelPlanID: 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06',
        name: 'Recruit participants',
        key: OperationalNeedKey.RECRUIT_PARTICIPANTS,
        nameOther: null,
        modifiedDts: '2021-08-10T14:00:00Z',
        needed: false,
        solutions: [
          {
            __typename: 'OperationalSolution',
            id: 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06',
            mustFinishDts: null,
            mustStartDts: null,
            status: OpSolutionStatus.NOT_STARTED,
            createdBy: 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06',
            createdDts: '2021-08-10T14:00:00Z',
            name: 'Salesforce',
            needed: true,
            key: OperationalSolutionKey.APPS,
            operationalSolutionSubtasks: []
          }
        ]
      }
    ];

    expect(filterPossibleNeeds(possibleNeeds)).toEqual([
      { ...possibleNeeds[0], status: OperationalNeedStatus.NOT_NEEDED }
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
          pathname: `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/evaluation`,
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
          to={`/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeed.needID}/solution-implementation-details/${operationalNeed.id}`}
          className="margin-right-2"
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

    expect(
      returnActionLinks(
        OperationalNeedStatus.NOT_NEEDED,
        operationalNeed as GetOperationalNeedsTableType,
        modelID
      )
    ).toEqual(
      <UswdsReactLink
        to={{
          pathname: `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/evaluation`,
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
