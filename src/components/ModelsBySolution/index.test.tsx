import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { GetFavoritesQuery, ModelStatus, TeamRole } from 'gql/gen/graphql';

import FavoriteCard from './index';

type FavoritesType = GetFavoritesQuery['modelPlanCollection'][0];

const mockModel: FavoritesType = {
  id: '0186774a-80b0-454c-b69e-c4e949343483',
  modelName: 'Plan For General Characteristics',
  nameHistory: ['first', 'second'],
  isFavorite: true,
  status: ModelStatus.PLAN_DRAFT,
  isCollaborator: false,
  basics: {
    id: '123',
    performancePeriodStarts: '2022-06-03T17:41:40.962971Z',
    goal: 'The goal',
    __typename: 'PlanBasics'
  },
  crs: [
    {
      __typename: 'PlanCR',
      idNumber: 'CR 123'
    }
  ],
  tdls: [
    {
      __typename: 'PlanTDL',
      idNumber: 'TDL 456'
    }
  ],
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

describe('FavoriteCard', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <FavoriteCard modelPlan={mockModel} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders model plan info translated text', () => {
    const { getByText } = render(
      <MemoryRouter>
        <FavoriteCard modelPlan={mockModel} />
      </MemoryRouter>
    );

    expect(getByText('Plan For General Characteristics')).toBeInTheDocument();
    expect(getByText('The goal')).toBeInTheDocument();
    expect(getByText('Draft Model Plan')).toBeInTheDocument();
  });
});
