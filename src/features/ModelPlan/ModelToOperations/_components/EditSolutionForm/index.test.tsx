import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  GetMtoSolutionDocument,
  GetMtoSolutionQuery,
  GetMtoSolutionQueryVariables,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  MtoSolutionStatus,
  MtoSolutionType
} from 'gql/generated/graphql';
import { allMilestonesMock, modelID } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import EditSolutionForm from './index';

const solutionMock = (
  milestones: GetMtoSolutionQuery['mtoSolution']['milestones']
): MockedResponse<GetMtoSolutionQuery, GetMtoSolutionQueryVariables> => {
  return {
    request: {
      query: GetMtoSolutionDocument,
      variables: {
        id: '1'
      }
    },
    result: {
      data: {
        __typename: 'Query',
        mtoSolution: {
          __typename: 'MTOSolution',
          id: '1',
          name: 'Solution 1',
          key: null,
          status: MtoSolutionStatus.COMPLETED,
          riskIndicator: MtoRiskIndicator.AT_RISK,
          addedFromSolutionLibrary: true,
          facilitatedBy: null,
          facilitatedByOther: '',
          type: MtoSolutionType.IT_SYSTEM,
          neededBy: '2121-08-01',
          pocName: 'Test Name',
          pocEmail: 'jon@oddball.io',
          milestones: [
            {
              __typename: 'MTOMilestone',
              id: '123',
              mtoCommonMilestoneID: '123456',
              name: 'Milestone 1',
              status: MtoMilestoneStatus.COMPLETED,
              riskIndicator: MtoRiskIndicator.AT_RISK,
              commonMilestone: {
                __typename: 'MTOCommonMilestone',
                id: '123456',
                name: 'Common Milestone 1',
                isAdded: true
              }
            },
            ...(milestones || [])
          ]
        }
      }
    }
  };
};

describe('EditSolutionForm Component', () => {
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  const renderForm = (
    hasMultipleMilestones: boolean = false,
    params: string = ''
  ) => {
    const solutionResponse = solutionMock(
      hasMultipleMilestones
        ? [
            {
              __typename: 'MTOMilestone',
              id: '456',
              mtoCommonMilestoneID: '789',
              name: 'Milestone 2',
              status: MtoMilestoneStatus.COMPLETED,
              riskIndicator: MtoRiskIndicator.AT_RISK,
              commonMilestone: {
                __typename: 'MTOCommonMilestone',
                id: '789',
                name: 'Common Milestone 2',
                isAdded: true
              }
            }
          ]
        : []
    );

    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <EditSolutionForm
                closeModal={vi.fn()}
                setIsDirty={vi.fn()}
                setCloseDestination={vi.fn()}
                setFooter={() => {}}
                submitted={{ current: false }}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions&hide-milestones-without-solutions=false&type=all&edit-solution=1${params}`
        ]
      }
    );

    return render(
      <MockedProvider mocks={[solutionResponse, allMilestonesMock]}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
  };

  it('renders correctly and matches snapshot', async () => {
    const { asFragment, getByTestId } = renderForm();

    await waitForElementToBeRemoved(() => getByTestId('page-loading'));

    await waitFor(() => {
      expect(screen.getByText('Solution 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Milestone 1')).toBeInTheDocument();
    });

    // Renders related milestones table
    expect(
      await screen.findByRole('heading', { name: 'Related milestones' })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders warning when editing a solution from a milestone and it applies to multiple milestones', async () => {
    renderForm(true, '&source=milestone');

    expect(
      await screen.findByText(
        'This solution is selected for 2 milestones. Updating the status and information here will also update it for the other milestones.'
      )
    ).toBeInTheDocument();
  });

  it('hides related milestones table when editing a solution from a milestone', async () => {
    renderForm(false, '&source=milestone');

    expect(
      screen.queryByRole('heading', { name: 'Related milestones' })
    ).toBeNull();
  });
});
