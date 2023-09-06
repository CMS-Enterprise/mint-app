import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { GetAllModelPlans_modelPlanCollection as ModelPlanType } from 'queries/ReadOnly/types/GetAllModelPlans';
import {
  ModelCategory,
  ModelStatus,
  TeamRole
} from 'types/graphql-global-types';

import FavoriteCard from './index';

const mockModel: ModelPlanType = {
  id: '0186774a-80b0-454c-b69e-c4e949343483',
  modelName: 'Plan For General Characteristics',
  nameHistory: ['first', 'second'],
  status: ModelStatus.PLAN_DRAFT,
  isFavorite: true,
  isCollaborator: false,
  basics: {
    performancePeriodStarts: '2022-06-03T17:41:40.962971Z',
    modelCategory: ModelCategory.STATE_BASED,
    additionalModelCategories: [],
    goal: 'The goal',
    __typename: 'PlanBasics'
  },
  crTdls: [
    {
      __typename: 'PlanCrTdl',
      id: '123',
      idNumber: 'CR 123'
    }
  ],
  collaborators: [
    {
      userAccount: {
        id: '890',
        __typename: 'UserAccount',
        email: '',
        username: 'MINT',
        commonName: 'Test User'
      },
      userID: '123',
      teamRole: TeamRole.MODEL_LEAD,
      __typename: 'PlanCollaborator'
    }
  ],
  __typename: 'ModelPlan'
};

const mockRemove = () => null;

describe('FavoriteCard', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <FavoriteCard modelPlan={mockModel} removeFavorite={mockRemove} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders model plan info translated text', () => {
    const { getByText } = render(
      <MemoryRouter>
        <FavoriteCard modelPlan={mockModel} removeFavorite={mockRemove} />
      </MemoryRouter>
    );

    expect(getByText('Plan For General Characteristics')).toBeInTheDocument();
    expect(getByText('The goal')).toBeInTheDocument();
    expect(getByText('Draft model plan')).toBeInTheDocument();
  });
});
