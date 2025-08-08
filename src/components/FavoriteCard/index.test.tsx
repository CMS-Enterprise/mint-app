import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import {
  GetFavoritesQuery,
  ModelStatus,
  TeamRole
} from 'gql/generated/graphql';

import FavoriteCard from './index';

type FavoritesType = GetFavoritesQuery['modelPlanCollection'][0];

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
    goal: 'The goal',
    __typename: 'PlanBasics'
  },
  timeline: {
    __typename: 'PlanTimeline',
    id: '789',
    performancePeriodStarts: '2022-06-03T17:41:40.962971Z'
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

const mockRemove = () => null;

describe('FavoriteCard', () => {
  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <FavoriteCard modelPlan={mockModel} removeFavorite={mockRemove} />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders model plan info translated text', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <FavoriteCard modelPlan={mockModel} removeFavorite={mockRemove} />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText } = render(<RouterProvider router={router} />);

    expect(getByText('Plan For General Characteristics')).toBeInTheDocument();
    expect(getByText('The goal')).toBeInTheDocument();
    expect(getByText('Draft Model Plan')).toBeInTheDocument();
  });
});
