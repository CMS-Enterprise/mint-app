import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetFavoritesDocument,
  GetFavoritesQuery,
  GetHomepageSettingsDocument,
  ModelPlanFilter,
  ModelStatus,
  TeamRole,
  ViewCustomizationType
} from 'gql/generated/graphql';
import { set } from 'lodash';
import configureMockStore from 'redux-mock-store';
import { modelPlanCollectionMock } from 'tests/mock/general';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import HomeNew from '.';

type FavoritesType = GetFavoritesQuery['modelPlanCollection'][0];

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => {},
        logout: async () => {}
      }
    };
  }
}));

const mockModel: FavoritesType = {
  id: '0186774a-80b0-454c-b69e-c4e949343483',
  modelName: 'Plan For General Characteristics',
  nameHistory: ['first', 'second'],
  isFavorite: true,
  status: ModelStatus.PLAN_DRAFT,
  isCollaborator: false,
  echimpCRsAndTDLs: [
    {
      id: '123',
      __typename: 'EChimpCR'
    },
    {
      id: '456',
      __typename: 'EChimpTDL'
    }
  ],
  basics: {
    id: '123',
    performancePeriodStarts: '2022-06-03T17:41:40.962971Z',
    goal: 'The goal',
    __typename: 'PlanBasics'
  },
  collaborators: [
    {
      userAccount: {
        id: '890',
        __typename: 'UserAccount',
        commonName: 'Test User'
      },
      id: '2134234',
      teamRoles: [TeamRole.MODEL_LEAD],
      __typename: 'PlanCollaborator'
    }
  ],
  __typename: 'ModelPlan'
};

const settingsMock = [
  {
    request: {
      query: GetHomepageSettingsDocument
    },
    result: {
      data: {
        userViewCustomization: {
          id: '3b29f11e-7dd4-4385-8056-27468d3dd562',
          viewCustomization: [] as ViewCustomizationType[],
          possibleOperationalSolutions: [] as ViewCustomizationType[],
          __typename: 'UserViewCustomization'
        }
      }
    }
  },
  {
    request: {
      query: GetFavoritesDocument,
      variables: {
        filter: ModelPlanFilter.INCLUDE_ALL
      }
    },
    result: {
      data: {
        modelPlanCollection: [mockModel]
      }
    }
  }
];

describe('The home page', () => {
  const mockStore = configureMockStore();

  const mockAuthReducer = {
    isUserSet: true,
    groups: []
  };

  const store = mockStore({ auth: mockAuthReducer });

  it('renders empty message for no settings selected', async () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={[`/`]}>
        <VerboseMockedProvider
          mocks={[
            ...settingsMock,
            ...modelPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL),
            ...modelPlanCollectionMock(ModelPlanFilter.COLLAB_ONLY)
          ]}
          addTypename={false}
        >
          <Route path="/">
            <Provider store={store}>
              <MessageProvider>
                <HomeNew />
              </MessageProvider>
            </Provider>
          </Route>
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(
      getByText('Your homepage looks a little empty.')
    ).toBeInTheDocument();
  });

  it('renders settings with a predefined order', async () => {
    const settingsWithOrder = set(
      [...settingsMock],
      '0.result.data.userViewCustomization.viewCustomization',
      [
        ViewCustomizationType.ALL_MODEL_PLANS,
        ViewCustomizationType.MY_MODEL_PLANS
      ]
    );

    const { getByTestId } = render(
      <MemoryRouter initialEntries={[`/`]}>
        <MockedProvider
          mocks={[
            ...settingsWithOrder,
            ...modelPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL),
            ...modelPlanCollectionMock(ModelPlanFilter.COLLAB_ONLY)
          ]}
          addTypename={false}
        >
          <Route path="/">
            <Provider store={store}>
              <MessageProvider>
                <HomeNew />
              </MessageProvider>
            </Provider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    const settingsHeaders = getByTestId('homepage').querySelectorAll('h2');
    expect(settingsHeaders.length).toEqual(2);
    expect(settingsHeaders[0].textContent).toEqual('All Model Plans');
    expect(settingsHeaders[1].textContent).toEqual('My Model Plans');
  });

  it('matches setting snapshot', async () => {
    const settingsWithOrder = set(
      [...settingsMock],
      '0.result.data.userViewCustomization.viewCustomization',
      [
        ViewCustomizationType.ALL_MODEL_PLANS,
        ViewCustomizationType.MY_MODEL_PLANS
      ]
    );

    const { asFragment, getByTestId } = render(
      <MemoryRouter initialEntries={[`/`]}>
        <MockedProvider
          mocks={[
            ...settingsWithOrder,
            ...modelPlanCollectionMock(ModelPlanFilter.INCLUDE_ALL),
            ...modelPlanCollectionMock(ModelPlanFilter.COLLAB_ONLY)
          ]}
          addTypename={false}
        >
          <Route path="/">
            <Provider store={store}>
              <MessageProvider>
                <HomeNew />
              </MessageProvider>
            </Provider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(async () => {
      await waitForElementToBeRemoved(() =>
        getByTestId('all-model-plans-table')
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
