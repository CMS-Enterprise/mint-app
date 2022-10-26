import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetClearanceStatuses from 'queries/PrepareForClearance/GetClearanceStatuses';
import { TaskStatus } from 'types/graphql-global-types';

import { initialPrepareForClearanceValues } from '../Checklist';

import ClearanceReview from '.';

const modelID = 'd94958a4-2259-4fe9-b94c-f62492c43287';
const basicsID = 'a093a178-5ec6-4a62-94df-f9b9179ee84e';

const clearanceMockData = initialPrepareForClearanceValues;

clearanceMockData.basics.status = TaskStatus.READY_FOR_CLEARANCE;
clearanceMockData.basics.id = basicsID;

const clearanceMock = [
  {
    request: {
      query: GetClearanceStatuses,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          ...clearanceMockData
        }
      }
    }
  }
];

// console.log(JSON.stringify(clearanceMock, null, 4));

describe('ClearanceReview component', () => {
  it('renders readonly component', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/prepare-for-clearance/basics/${basicsID}`
        ]}
      >
        <MockedProvider mocks={clearanceMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/prepare-for-clearance/:section/:sectionID">
            <ClearanceReview modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--model-basics')
      ).toBeInTheDocument();
    });
  });

  it('renders modal if already cleared', async () => {
    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = jest.fn();

    const { getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/prepare-for-clearance/basics/${basicsID}`
        ]}
      >
        <MockedProvider mocks={clearanceMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/prepare-for-clearance/:section/:sectionID">
            <ClearanceReview modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('modify-task-list-for-clearance')).toBeInTheDocument();
    });

    userEvent.click(getByTestId('modify-task-list-for-clearance'));

    await waitFor(() => {
      expect(getByTestId('clearance-modal-header')).toHaveTextContent(
        'Are you sure you want to update this Model Plan section?'
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/task-list/prepare-for-clearance/basics/${basicsID}`
        ]}
      >
        <MockedProvider mocks={clearanceMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/prepare-for-clearance/:section/:sectionID">
            <ClearanceReview modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('read-only-model-plan--model-basics')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
