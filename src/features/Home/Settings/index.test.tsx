import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import {
  GetGlobalMtoCommonSolutionsDocument,
  GetGlobalMtoCommonSolutionsQuery,
  GetGlobalMtoCommonSolutionsQueryVariables,
  GetHomepageSettingsDocument,
  GetHomepageSettingsQuery,
  GetHomepageSettingsQueryVariables,
  MtoCommonSolutionKey,
  ViewCustomizationType
} from 'gql/generated/graphql';

import MessageProvider from 'contexts/MessageContext';

import SelectSolutionSettings from './selectSolutions';
import HomePageSettings from './settings';
import SettingsOrder, { moveItem } from './settingsOrder';

const mocks: MockedResponse<
  GetHomepageSettingsQuery,
  GetHomepageSettingsQueryVariables
>[] = [
  {
    request: {
      query: GetHomepageSettingsDocument
    },
    result: {
      data: {
        __typename: 'Query',
        userViewCustomization: {
          id: '3b29f11e-7dd4-4385-8056-27468d3dd562',
          viewCustomization: [
            ViewCustomizationType.MODELS_BY_SOLUTION,
            ViewCustomizationType.MODELS_WITH_CR_TDL
          ],
          solutions: [
            MtoCommonSolutionKey.INNOVATION,
            MtoCommonSolutionKey.ACO_OS
          ],
          __typename: 'UserViewCustomization'
        }
      }
    }
  }
];

const solutionsMock: MockedResponse<
  GetGlobalMtoCommonSolutionsQuery,
  GetGlobalMtoCommonSolutionsQueryVariables
> = {
  request: {
    query: GetGlobalMtoCommonSolutionsDocument
  },
  result: {
    data: {
      __typename: 'Query',
      mtoCommonSolutions: [
        {
          name: '4innovation (4i)',
          key: MtoCommonSolutionKey.INNOVATION,
          __typename: 'MTOCommonSolution'
        },
        {
          name: 'Accountable Care Organization - Operational System (ACO-OS)',
          key: MtoCommonSolutionKey.ACO_OS,
          __typename: 'MTOCommonSolution'
        },
        {
          name: 'Automated Plan Payment System (APPS)',
          key: MtoCommonSolutionKey.APPS,
          __typename: 'MTOCommonSolution'
        },
        {
          name: 'Centralized Data Exchange (CDX)',
          key: MtoCommonSolutionKey.CDX,
          __typename: 'MTOCommonSolution'
        }
      ]
    }
  }
};

describe('moveItem function', () => {
  const initialArray = [
    ViewCustomizationType.ALL_MODEL_PLANS,
    ViewCustomizationType.MY_MODEL_PLANS,
    ViewCustomizationType.FOLLOWED_MODELS
  ];

  it('should move an item up in the array', () => {
    const expectedArray = [
      ViewCustomizationType.MY_MODEL_PLANS,
      ViewCustomizationType.ALL_MODEL_PLANS,
      ViewCustomizationType.FOLLOWED_MODELS
    ];
    const result = moveItem([...initialArray], 1, 'up');
    expect(result.viewCustomization).toEqual(expectedArray);
  });

  it('should move an item down in the array', () => {
    const expectedArray = [
      ViewCustomizationType.ALL_MODEL_PLANS,
      ViewCustomizationType.FOLLOWED_MODELS,
      ViewCustomizationType.MY_MODEL_PLANS
    ];
    const result = moveItem([...initialArray], 1, 'down');
    expect(result.viewCustomization).toEqual(expectedArray);
  });

  it('should not move an item if moving up and it is the first item', () => {
    const result = moveItem([...initialArray], 0, 'up');
    expect(result.viewCustomization).toEqual(initialArray);
  });

  it('should not move an item if moving down and it is the last item', () => {
    const result = moveItem([...initialArray], 2, 'down');
    expect(result.viewCustomization).toEqual(initialArray);
  });
});

describe('settings snapshots', () => {
  it('matches setting snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/homepage-settings`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/homepage-settings">
            <MessageProvider>
              <HomePageSettings />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches order snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/homepage-settings/order`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/homepage-settings/order">
            <MessageProvider>
              {' '}
              <SettingsOrder />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches solutions snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/homepage-settings/solutions`]}>
        <MockedProvider mocks={[...mocks, solutionsMock]} addTypename={false}>
          <Route path="/homepage-settings/solutions">
            <MessageProvider>
              <SelectSolutionSettings />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
