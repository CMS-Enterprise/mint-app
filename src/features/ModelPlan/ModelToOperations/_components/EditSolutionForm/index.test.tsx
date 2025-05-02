import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import { allMilestonesMock, modelID, solutionMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import EditSolutionForm from './index';

describe('EditSolutionForm Component', () => {
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  const renderForm = (addedFromSolutionLibrary: boolean = true) => {
    return render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions&hide-milestones-without-solutions=false&type=all&edit-solution=1`
        ]}
      >
        <MockedProvider
          mocks={[
            solutionMock('1', addedFromSolutionLibrary),
            allMilestonesMock
          ]}
          addTypename={false}
        >
          <MessageProvider>
            <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
              <EditSolutionForm
                closeModal={vi.fn()}
                setIsDirty={vi.fn()}
                submitted={{ current: false }}
              />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
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

  it('displays a confirmation modal when the remove button is clicked', async () => {
    renderForm();

    await waitFor(() => {
      expect(screen.getByText('Solution 1')).toBeInTheDocument();
    });

    const removeButton = screen.getByText(
      i18next.t<string, {}, string>(
        'modelToOperationsMisc:modal.editSolution.removeSolution'
      )
    );

    await userEvent.click(removeButton);

    expect(
      screen.getByText(
        i18next.t<string, {}, string>(
          'modelToOperationsMisc:modal.editSolution.areYouSure'
        )
      )
    ).toBeInTheDocument();
  });
});
