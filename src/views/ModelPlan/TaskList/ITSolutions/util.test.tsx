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
  returnActionLinks
} from './util';

const operationalNeed: any = {
  needKey: OperationalNeedKey.ACQUIRE_AN_EVAL_CONT
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
              name: 'Salesforce'
            }
          ]
        }
      ] as GetOperationalNeedsOperationalNeedsType[])
    ).toEqual([
      {
        name: 'Salesforce',
        needName: 'Advertise the model'
      }
    ]);
  });

  it('returns formatted possible', async () => {
    const possibleNeed = {
      name: 'Advertise the model',
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
        operationalNeed as GetOperationalNeedsOperationalNeedsType,
        '123'
      )
    ).toEqual(
      <UswdsReactLink to="/">
        {i18next.t('itSolutions:itSolutionsTable.changePlanAnswer')}
      </UswdsReactLink>
    );

    expect(
      returnActionLinks(
        OpSolutionStatus.NOT_STARTED,
        operationalNeed as GetOperationalNeedsOperationalNeedsType,
        '123'
      )
    ).toEqual(
      <>
        <UswdsReactLink to="/" className="margin-right-2">
          {i18next.t('itSolutions:itSolutionsTable.updateStatus')}
        </UswdsReactLink>
        <UswdsReactLink to="/">
          {i18next.t('itSolutions:itSolutionsTable.viewDetails')}
        </UswdsReactLink>
      </>
    );

    expect(
      returnActionLinks(
        OpSolutionStatus.NOT_STARTED,
        operationalNeed as GetOperationalNeedsOperationalNeedsType,
        '123'
      )
    ).toEqual(
      <UswdsReactLink to="/">
        {i18next.t('itSolutions:itSolutionsTable.answer')}
      </UswdsReactLink>
    );
  });
});
