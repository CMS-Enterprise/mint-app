import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import {
  ComponentGroup,
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

import SelectSolutionSettings from './SelectSolutions';
import SettingsForm from './Settings';
import SettingsOrder, { moveItem } from './SettingsOrder';

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
          componentGroups: [] as unknown as ComponentGroup[],
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
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/form',
          element: (
            <MessageProvider>
              <SettingsForm />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/form']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches order snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/order',
          element: (
            <MessageProvider>
              <SettingsOrder />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/order']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches solutions snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/homepage-settings/solutions',
          element: (
            <MessageProvider>
              <SelectSolutionSettings />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/homepage-settings/solutions']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={[...mocks, solutionsMock]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
