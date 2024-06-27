import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import {
  GetHomepageSettingsDocument,
  GetPossibleOperationalSolutionsDocument,
  OperationalSolutionKey,
  ViewCustomizationType
} from 'gql/gen/graphql';

import { MessageProvider } from 'hooks/useMessage';

import SelectSolutionSettings from './selectSolutions';
import SettingsOrder, { moveItem } from './settingsOrder';
import HomePageSettings from '.';

const mocks = [
  {
    request: {
      query: GetHomepageSettingsDocument
    },
    result: {
      data: {
        userViewCustomization: {
          id: '3b29f11e-7dd4-4385-8056-27468d3dd562',
          viewCustomization: [
            ViewCustomizationType.MODELS_BY_OPERATIONAL_SOLUTION,
            ViewCustomizationType.MODELS_WITH_CR_TDL
          ],
          possibleOperationalSolutions: [
            OperationalSolutionKey.INNOVATION,
            OperationalSolutionKey.ACO_OS
          ],
          __typename: 'UserViewCustomization'
        }
      }
    }
  }
];

const solutionsMock = {
  request: {
    query: GetPossibleOperationalSolutionsDocument
  },
  result: {
    data: {
      possibleOperationalSolutions: [
        {
          id: 1,
          name: '4innovation (4i)',
          key: OperationalSolutionKey.INNOVATION,
          __typename: 'PossibleOperationalSolution'
        },
        {
          id: 2,
          name: 'Accountable Care Organization - Operational System (ACO-OS)',
          key: OperationalSolutionKey.ACO_OS,
          __typename: 'PossibleOperationalSolution'
        },
        {
          id: 3,
          name: 'Automated Plan Payment System (APPS)',
          key: OperationalSolutionKey.APPS,
          __typename: 'PossibleOperationalSolution'
        },
        {
          id: 4,
          name: 'Centralized Data Exchange (CDX)',
          key: OperationalSolutionKey.CDX,
          __typename: 'PossibleOperationalSolution'
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
