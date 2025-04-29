import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
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
  ]
};

describe('LinkSolutionForm', () => {
  it('renders and matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=milestones&edit-milestone=123`
        ]}
      >
        <MessageProvider>
          <MockedProvider
            mocks={[
              ...milestoneMock('123'),
              ...categoryMock,
              ...possibleSolutionsMock
            ]}
            addTypename={false}
          >
            <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
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
              />
            </Route>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('checkbox')).toBeChecked();

    expect(asFragment()).toMatchSnapshot();
  });
});
