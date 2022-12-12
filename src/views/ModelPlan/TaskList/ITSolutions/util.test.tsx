import React from 'react';
import i18next from 'i18next';

import UswdsReactLink from 'components/LinkWrapper';
import { GetOperationalNeeds_modelPlan_operationalNeeds as GetOperationalNeedsOperationalNeedsType } from 'queries/ITSolutions/types/GetOperationalNeeds';
import {
  OperationalNeedKey,
  OpSolutionStatus
} from 'types/graphql-global-types';

import { OperationalNeedStatus } from './_components/NeedsStatus';
import { GetOperationalNeedsTableType } from './Home/operationalNeedsTable';
import {
  filterNeedsFormatSolutions,
  filterPossibleNeeds,
  returnActionLinks,
  SolutionAsNeed
} from './util';

const modelID = 'f4f0a51d-590d-47fb-82e4-b6e6cdcfde06';

const operationalNeed: any = {
  needKey: OperationalNeedKey.ACQUIRE_AN_EVAL_CONT,
  needID: '0b9e42ff-05b3-45c1-9464-5041307d1671',
  id: 'b7290d2c-0eae-4df4-8657-b22b5df3159e'
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
<<<<<<< HEAD
        operationalNeed as GetOperationalNeedsTableType,
        modelID
=======
        operationalNeed as SolutionAsNeed,
        '123'
>>>>>>> b64fa8b2 (exported SolutionAsNeed and imported into test)
      )
    ).toEqual(
      <UswdsReactLink
        to={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
      >
        {i18next.t('itSolutions:itSolutionsTable.changePlanAnswer')}
      </UswdsReactLink>
    );

    expect(
      returnActionLinks(
        OpSolutionStatus.ONBOARDING,
<<<<<<< HEAD
        operationalNeed as GetOperationalNeedsTableType,
        modelID
=======
        operationalNeed as SolutionAsNeed,
        '123'
>>>>>>> b64fa8b2 (exported SolutionAsNeed and imported into test)
      )
    ).toEqual(
      <>
        <UswdsReactLink
<<<<<<< HEAD
          to={{
            pathname: `/models/${modelID}/task-list/it-solutions/${operationalNeed.needID}/update-status/${operationalNeed.id}`,
            state: { fromSolutionDetails: false }
          }}
=======
          to="/models/123/task-list/it-solutions/1234-4321/update-status"
>>>>>>> b64fa8b2 (exported SolutionAsNeed and imported into test)
          className="margin-right-2"
        >
          {i18next.t('itSolutions:itSolutionsTable.updateStatus')}
        </UswdsReactLink>
        <UswdsReactLink
          to={`/models/${modelID}/task-list/it-solutions/${operationalNeed.needID}/${operationalNeed.id}/solution-details`}
        >
          {i18next.t('itSolutions:itSolutionsTable.viewDetails')}
        </UswdsReactLink>
      </>
    );

    expect(
      returnActionLinks(
        OperationalNeedStatus.NOT_NEEDED,
<<<<<<< HEAD
        operationalNeed as GetOperationalNeedsTableType,
        modelID
=======
        operationalNeed as SolutionAsNeed,
        '123'
>>>>>>> b64fa8b2 (exported SolutionAsNeed and imported into test)
      )
    ).toEqual(
      <UswdsReactLink
        to={`/models/${modelID}/task-list/ops-eval-and-learning/evaluation`}
      >
        {i18next.t('itSolutions:itSolutionsTable.changeAnswer')}
      </UswdsReactLink>
    );
  });
});
