import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { allMilestonesMock, modelID, solutionMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import EditSolutionForm from './index';

describe('EditSolutionForm Component', () => {
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  const renderForm = (addedFromSolutionLibrary: boolean = true) => {
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
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions&hide-milestones-without-solutions=false&type=all&edit-solution=1`
        ]
      }
    );

    return render(
      <MockedProvider
        mocks={[solutionMock('1', addedFromSolutionLibrary), allMilestonesMock]}
        addTypename={false}
      >
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

    expect(asFragment()).toMatchSnapshot();
  });
});
