import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import {
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

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    expect(asFragment()).toMatchSnapshot();
  });
});
