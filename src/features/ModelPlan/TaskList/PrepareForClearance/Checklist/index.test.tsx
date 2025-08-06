import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import {
  GetClearanceStatusesDocument,
  PrepareForClearanceStatus,
  TaskStatus
} from 'gql/generated/graphql';
import setup from 'tests/util';

import PrepareForClearanceCheckList, {
  initialPrepareForClearanceValues,
  SectionClearanceLabel
} from './index';

const clearanceMockData = initialPrepareForClearanceValues;

clearanceMockData.basics.status = TaskStatus.READY_FOR_CLEARANCE;

const modelID = 'd94958a4-2259-4fe9-b94c-f62492c43287';

const readyForClearanceDts = '2022-10-24T19:32:24.412662Z';

const clearanceMock = [
  {
    request: {
      query: GetClearanceStatusesDocument,
      variables: { id: modelID, includePrepareForClearance: false }
    },
    result: {
      data: {
        modelPlan: {
          id: modelID,
          modelName: 'My excellent plan that I just initiated',
          ...clearanceMockData,
          prepareForClearance: {
            status: PrepareForClearanceStatus.READY
          }
        }
      }
    }
  }
];

describe('Prepare for clearance checklist', () => {
  it('renders without errors and unchecks an item', async () => {
    const { user } = setup(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/prepare-for-clearance`
        ]}
      >
        <MockedProvider mocks={clearanceMock} addTypename={false}>
          <Routes>
          <Route
            path="/models/:modelID/collaboration-area/task-list/prepare-for-clearance"
            element={<PrepareForClearanceCheckList modelID={modelID}  />}
          />
        </Routes>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('prepare-for-clearance-basics')).toBeChecked();
    });

    await user.click(screen.getByTestId('prepare-for-clearance-basics'));

    await waitFor(() => {
      expect(
        screen.getByTestId('prepare-for-clearance-basics')
      ).not.toBeChecked();
    });
  });

  it('renders SectionClearanceLabel', async () => {
    render(
      <SectionClearanceLabel
        commonName="Jerry Seinfeld"
        readyForClearanceDts={readyForClearanceDts}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('clearance-label')).toHaveTextContent(
        'Marked ready for clearance by Jerry Seinfeld on 10/24/2022'
      );
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/task-list/prepare-for-clearance`
        ]}
      >
        <MockedProvider mocks={clearanceMock} addTypename={false}>
          <Routes>
          <Route
            path="/models/:modelID/collaboration-area/task-list/prepare-for-clearance"
            element={<PrepareForClearanceCheckList modelID={modelID}  />}
          />
        </Routes>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('prepare-for-clearance-basics')).toBeChecked();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
