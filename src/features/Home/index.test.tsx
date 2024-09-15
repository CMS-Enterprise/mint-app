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
  GetHomepageSettingsDocument,
  ModelPlanFilter,
  ViewCustomizationType
} from 'gql/gen/graphql';
import { set } from 'lodash';
import configureMockStore from 'redux-mock-store';

import { modelPlanCollectionMock } from 'data/mock/general';
import { MessageProvider } from 'hooks/useMessage';

import HomeNew from '.';

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
        filter: 'INCLUDE_ALL',
        isMAC: true
      }
    },
    result: {
      data: {
        modelPlanCollection: [
          {
            id: 'e671f056-2634-4af4-abad-a63850832a0a',
            modelName: 'Plan With Collaborators',
            isFavorite: true,
            nameHistory: ['Plan With Collaborators'],
            isCollaborator: true,
            status: 'PLAN_DRAFT',
            basics: {
              id: '3a1584a5-6712-4ab8-8832-86faa183d3b1',
              goal: null,
              performancePeriodStarts: null,
              __typename: 'PlanBasics'
            },
            collaborators: [
              {
                id: '064c52cf-854f-4c53-acdf-ab27ffb9cca5',
                userAccount: {
                  id: '83bb8c56-b871-43e5-9fe4-2701ad6c593e',
                  commonName: 'MINT Doe',
                  __typename: 'UserAccount'
                },
                teamRoles: ['MODEL_LEAD'],
                __typename: 'PlanCollaborator'
              },
              {
                id: 'c6866efe-30d3-4926-bf50-68d9a0150cb0',
                userAccount: {
                  id: 'ae6ed775-b4de-4b82-ab19-75c03a907726',
                  commonName: 'BTAL Doe',
                  __typename: 'UserAccount'
                },
                teamRoles: ['LEADERSHIP'],
                __typename: 'PlanCollaborator'
              }
            ],
            crs: [],
            tdls: [],
            __typename: 'ModelPlan'
          }
        ]
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
        <MockedProvider
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
        </MockedProvider>
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
