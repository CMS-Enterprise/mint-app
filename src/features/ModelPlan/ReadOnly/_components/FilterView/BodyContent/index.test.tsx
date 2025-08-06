import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import ReadOnly from 'features/ModelPlan/ReadOnly';
import {
  GetModelSummaryDocument,
  GetModelSummaryQuery,
  KeyCharacteristic,
  ModelStatus,
  TeamRole
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';
import allMocks from 'tests/mock/readonly';

import { ASSESSMENT } from 'constants/jobCodes';
import basics from 'i18n/en-US/modelPlan/basics';
import beneficiaries from 'i18n/en-US/modelPlan/beneficiaries';
import collaborators from 'i18n/en-US/modelPlan/collaborators';
import generalCharacteristics from 'i18n/en-US/modelPlan/generalCharacteristics';
import modelPlan from 'i18n/en-US/modelPlan/modelPlan';
import opsEvalAndLearning from 'i18n/en-US/modelPlan/opsEvalAndLearning';
import participantsAndProviders from 'i18n/en-US/modelPlan/participantsAndProviders';
import payments from 'i18n/en-US/modelPlan/payments';
import { TranslationPlan } from 'types/translation';

import { getAllFilterViewQuestions } from '.';

type GetModelSummaryTypes = GetModelSummaryQuery['modelPlan'];

const mockData: GetModelSummaryTypes = {
  __typename: 'ModelPlan',
  id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
  abbreviation: null,
  isFavorite: false,
  modelName: 'Testing Model Summary',
  createdDts: '2022-08-23T04:00:00Z',
  modifiedDts: '2022-08-27T04:00:00Z',
  status: ModelStatus.PLAN_DRAFT,
  mostRecentEdit: {
    __typename: 'TranslatedAudit',
    id: '123',
    date: '2022-08-27T04:00:00Z'
  },
  basics: {
    __typename: 'PlanBasics',
    id: '123',
    goal: 'This is the goal'
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    id: '123',
    keyCharacteristics: [KeyCharacteristic.EPISODE_BASED]
  },
  timeline: {
    __typename: 'PlanTimeline',
    id: '123',
    performancePeriodStarts: '2022-08-20T04:00:00Z'
  },
  isCollaborator: true,
  echimpCRsAndTDLs: [
    {
      __typename: 'EChimpCR',
      id: '123'
    },
    {
      __typename: 'EChimpTDL',
      id: '456'
    }
  ],
  collaborators: [
    {
      userAccount: {
        id: '890',
        __typename: 'UserAccount',
        email: '',
        username: 'MINT',
        commonName: 'First Collaborator'
      },
      teamRoles: [TeamRole.MODEL_LEAD],
      __typename: 'PlanCollaborator'
    }
  ]
};

const mock = [
  {
    request: {
      query: GetModelSummaryDocument,
      variables: { id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905' }
    },
    result: {
      data: {
        modelPlan: {
          ...mockData
        }
      }
    }
  },
  ...allMocks
];

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('Read Only Filtered View Body Content', () => {
  it('formats filter view translation mappings', async () => {
    expect(
      getAllFilterViewQuestions(
        {
          basics,
          collaborators,
          generalCharacteristics,
          participantsAndProviders,
          beneficiaries,
          modelPlan,
          opsEvalAndLearning,
          payments
        } as TranslationPlan,
        'mdm'
      )
    ).toEqual({
      basics: ['nameHistory'],
      modelPlan: ['nameHistory'],
      beneficiaries: [
        'beneficiaries',
        'diseaseSpecificGroup',
        'beneficiariesOther',
        'beneficiariesNote',
        'numberPeopleImpacted',
        'estimateConfidence',
        'confidenceNote',
        'beneficiaryOverlap',
        'beneficiaryOverlapNote',
        'precedenceRules',
        'precedenceRulesYes',
        'precedenceRulesNo',
        'precedenceRulesNote'
      ]
    });
  });

  it('renders without crashing', async () => {
    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/read-view/model-basics?filter-view=cmmi`
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Provider store={store}>
            <Routes>
          <Route
            path="/models/:modelID/read-view/:subinfo"
            element={<ReadOnly  />}
          />
        </Routes>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(screen.getByText('Model Team')).toBeInTheDocument();
    expect(screen.getByText('CMMI Cost Estimate')).toBeInTheDocument();

    expect(
      screen.getByTestId('read-only-model-plan--general-characteristics')
    ).toBeInTheDocument();
  });
});
