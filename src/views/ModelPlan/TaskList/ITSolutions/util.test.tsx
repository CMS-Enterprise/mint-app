import React from 'react';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { GetOperationalNeeds_modelPlan_operationalNeeds as GetOperationalNeedsOperationalNeedsType } from 'queries/ITSolutions/types/GetOperationalNeeds';
import {
  OperationalNeedKey,
  OpSolutionStatus
} from 'types/graphql-global-types';

import { OperationalNeedStatus } from './_components/NeedsStatus';
import {
  filterNeedsFormatSolutions,
  filterPossibleNeeds,
  returnActionLinks,
  SolutionAsNeed
} from './util';

const operationalNeed: any = {
  needKey: OperationalNeedKey.ACQUIRE_AN_EVAL_CONT,
  needID: '1234-4321'
};

describe('IT Solutions Util', () => {
  it('returns formatted needed solutions', async () => {
    expect(
      filterNeedsFormatSolutions([
        {
          name: 'Advertise the model',
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
        needName: 'Advertise the model'
      }
    ]);
  });

  it('returns formatted possible', async () => {
    const possibleNeed = {
      name: 'Advertise the model',
      __typename: 'OperationalNeed',
      key: OperationalNeedKey.ADVERTISE_MODEL,
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
        operationalNeed as SolutionAsNeed,
        '123'
      )
    ).toEqual(
      <UswdsReactLink to="/models/123/task-list/ops-eval-and-learning/evaluation">
        {i18next.t('itSolutions:itSolutionsTable.changePlanAnswer')}
      </UswdsReactLink>
    );

    expect(
      returnActionLinks(
        OpSolutionStatus.ONBOARDING,
        operationalNeed as SolutionAsNeed,
        '123'
      )
    ).toEqual(
      <>
        <UswdsReactLink
          to="/models/123/task-list/it-solutions/1234-4321/update-status"
          className="margin-right-2"
        >
          {i18next.t('itSolutions:itSolutionsTable.updateStatus')}
        </UswdsReactLink>
        <UswdsReactLink to="/">
          {i18next.t('itSolutions:itSolutionsTable.viewDetails')}
        </UswdsReactLink>
      </>
    );

    expect(
      returnActionLinks(
        OperationalNeedStatus.NOT_NEEDED,
        operationalNeed as SolutionAsNeed,
        '123'
      )
    ).toEqual(
      <UswdsReactLink to="/models/123/task-list/ops-eval-and-learning/evaluation">
        {i18next.t('itSolutions:itSolutionsTable.changeAnswer')}
      </UswdsReactLink>
    );
  });
});
