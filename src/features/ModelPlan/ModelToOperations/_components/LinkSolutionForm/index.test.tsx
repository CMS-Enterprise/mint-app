import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  GetMtoMilestoneQuery,
  MtoCommonMilestoneKey,
  MtoCommonSolutionKey,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  MtoSolutionStatus
} from 'gql/generated/graphql';
import {
  categoryMock,
  milestoneMock,
  modelID,
  possibleSolutionsMock
} from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import LinkSolutionForm from '.';

type MilestoneType = GetMtoMilestoneQuery['mtoMilestone'];

const milestone: MilestoneType = {
  __typename: 'MTOMilestone',
  id: '123',
  name: 'Milestone 1',
  key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
  responsibleComponent: [],
  facilitatedBy: [],
  needBy: '2021-08-01',
  status: MtoMilestoneStatus.COMPLETED,
  riskIndicator: MtoRiskIndicator.AT_RISK,
  addedFromMilestoneLibrary: true,
  isDraft: false,
  categories: {
    __typename: 'MTOCategories',
    category: {
      __typename: 'MTOCategory',
      id: '1',
      name: 'Category 1'
    },
    subCategory: {
      __typename: 'MTOSubcategory',
      id: '2',
      name: 'Subcategory 1'
    }
  },
  commonMilestone: {
    __typename: 'MTOCommonMilestone',
    description: 'Description 1',
    key: MtoCommonMilestoneKey.ACQUIRE_AN_EVAL_CONT,
    commonSolutions: [
      {
        __typename: 'MTOCommonSolution',
        key: MtoCommonSolutionKey.BCDA
      }
    ]
  },
  solutions: [
    {
      __typename: 'MTOSolution',
      id: '1',
      name: 'Solution 1',
      key: MtoCommonSolutionKey.BCDA,
      status: MtoSolutionStatus.COMPLETED,
      riskIndicator: MtoRiskIndicator.AT_RISK,
      commonSolution: {
        __typename: 'MTOCommonSolution',
        name: 'common solution 1',
        key: MtoCommonSolutionKey.BCDA,
        isAdded: true
      }
    }
  ],
  notes: []
};

describe('LinkSolutionForm', () => {
  it('renders and matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <LinkSolutionForm
                milestone={milestone}
                commonSolutionKeys={[MtoCommonSolutionKey.BCDA]}
                setCommonSolutionKeys={() => null}
                solutionIDs={[]}
                setSolutionIDs={() => null}
                allSolutions={{
                  __typename: 'ModelsToOperationMatrix',
                  commonSolutions: [],
                  info: {
                    __typename: 'MTOInfo',
                    id: '123'
                  },
                  solutions: []
                }}
                setCloseDestination={() => null}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=milestones&edit-milestone=123`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider
        mocks={[
          ...milestoneMock('123'),
          ...categoryMock,
          ...possibleSolutionsMock
        ]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByRole('checkbox')).toBeChecked();

    expect(asFragment()).toMatchSnapshot();
  });
});
