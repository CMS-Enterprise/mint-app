import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetModelSummaryDocument,
  GetModelSummaryQuery,
  KeyCharacteristic,
  ModelStatus,
  TeamRole
} from 'gql/generated/graphql';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'data/constants/jobCodes';
import allMocks from 'data/mock/readonly';
import basics from 'i18n/en-US/modelPlan/basics';
import beneficiaries from 'i18n/en-US/modelPlan/beneficiaries';
import collaborators from 'i18n/en-US/modelPlan/collaborators';
import generalCharacteristics from 'i18n/en-US/modelPlan/generalCharacteristics';
import modelPlan from 'i18n/en-US/modelPlan/modelPlan';
import opsEvalAndLearning from 'i18n/en-US/modelPlan/opsEvalAndLearning';
import participantsAndProviders from 'i18n/en-US/modelPlan/participantsAndProviders';
import payments from 'i18n/en-US/modelPlan/payments';
import { TranslationPlan } from 'types/translation';
import ReadOnly from 'features/ModelPlan/ReadOnly';

import { getAllFilterViewQuestions } from '.';

type GetModelSummaryTypes = GetModelSummaryQuery['modelPlan'];

const mockData: GetModelSummaryTypes = {
  __typename: 'ModelPlan',
  id: 'f11eb129-2c80-4080-9440-439cbe1a286f',
  abbreviation: null,
  isFavorite: false,
  modelName: 'Testing Model Summary',
  createdDts: '2022-08-23T04:00:00Z',
  modifiedDts: '2022-08-27T04:00:00Z',
  status: ModelStatus.PLAN_DRAFT,
  basics: {
    __typename: 'PlanBasics',
    goal: 'This is the goal',
    performancePeriodStarts: '2022-08-20T04:00:00Z'
  },
  generalCharacteristics: {
    __typename: 'PlanGeneralCharacteristics',
    keyCharacteristics: [KeyCharacteristic.EPISODE_BASED]
  },
  isCollaborator: true,

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
  ],
  crs: [
    {
      __typename: 'PlanCR',
      id: '123',
      idNumber: 'CR 123'
    }
  ],
  tdls: [
    {
      __typename: 'PlanTDL',
      id: '456',
      idNumber: 'TDL-123'
    }
  ]
};

const mock = [
  {
    request: {
      query: GetModelSummaryDocument,
      variables: { id: 'f11eb129-2c80-4080-9440-439cbe1a286f' }
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
          `/models/f11eb129-2c80-4080-9440-439cbe1a286f/read-only/model-basics?filter-view=cmmi`
        ]}
      >
        <MockedProvider mocks={mock} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <ReadOnly />
            </Route>
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
