import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetUserInfo from 'queries/GetUserInfo';
import GetClearanceStatuses from 'queries/PrepareForClearance/GetClearanceStatuses';
import { TaskStatus } from 'types/graphql-global-types';

import PrepareForClearanceCheckList, {
  initialPrepareForClearanceValues,
  SectionClearanceLabel
} from './index';

const clearanceMockData = initialPrepareForClearanceValues;

clearanceMockData.basics.status = TaskStatus.READY_FOR_CLEARANCE;

const modelID = 'd94958a4-2259-4fe9-b94c-f62492c43287';

const readyForClearanceBy = 'MINT';
const readyForClearanceDts = '2022-10-24T19:32:24.412662Z';

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

const sectionClearanceLabelMock = [
  {
    request: {
      query: GetUserInfo,
      variables: { username: readyForClearanceBy }
    },
    result: {
      data: {
        userAccount: {
          id: '',
          username: '',
          commonName: 'Jerry Seinfeld',
          email: '',
          givenName: '',
          familyName: ''
        }
      }
    }
  }
];

describe('Prepare for clearance checklist', () => {
  it('renders without errors and unchecks an item', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/task-list/prepare-for-clearance`]}
      >
        <MockedProvider mocks={clearanceMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/prepare-for-clearance">
            <PrepareForClearanceCheckList modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('prepare-for-clearance-basics')).toBeChecked();
    });

    userEvent.click(screen.getByTestId('prepare-for-clearance-basics'));

    await waitFor(() => {
      expect(
        screen.getByTestId('prepare-for-clearance-basics')
      ).not.toBeChecked();
    });
  });

  it('renders SectionClearanceLabel', async () => {
    render(
      <MockedProvider mocks={sectionClearanceLabelMock} addTypename={false}>
        <SectionClearanceLabel
          readyForClearanceBy={readyForClearanceBy}
          readyForClearanceDts={readyForClearanceDts}
        />
      </MockedProvider>
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
        initialEntries={[`/models/${modelID}/task-list/prepare-for-clearance`]}
      >
        <MockedProvider mocks={clearanceMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/prepare-for-clearance">
            <PrepareForClearanceCheckList modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('prepare-for-clearance-basics')).toBeChecked();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
