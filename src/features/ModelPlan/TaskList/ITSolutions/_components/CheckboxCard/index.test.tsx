import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  act,
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { Formik } from 'formik';
import {
  OperationalSolutionKey,
  OpSolutionStatus
} from 'gql/generated/graphql';
import { possibleSolutionsMock } from 'tests/mock/solutions';

import VerboseMockedProvider from 'utils/testing/MockedProvider';

import { initialValues } from '../../SelectSolutions';

import CheckboxCard from '.';

const solution = [
  {
    __typename: 'OperationalSolution' as const,
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
    key: OperationalSolutionKey.RMADA,
    mustStartDts: null,
    mustFinishDts: null,
    status: OpSolutionStatus.IN_PROGRESS,
    isCommonSolution: true,
    needed: true,
    pocName: 'John Doe',
    pocEmail: '',
    nameOther: null,
    isOther: false,
    otherHeader: null
  }
];

const mocks = [...possibleSolutionsMock];

const handleSubmit = vi.fn();

describe('Operational Solutions CheckboxCard', () => {
  it('matches snapshot', async () => {
    await act(async () => {
      const { asFragment, getByRole, getByText, getByTestId } = render(
        <MemoryRouter
          initialEntries={[
            '/models/602287ff-d9d5-4203-86eb-e168fbd47242/collaboration-area/task-list/it-solutions/f92a8a35-86de-4e03-a81a-bd8bec2e30e3/select-solutions'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/task-list/it-solutions/:operationalNeedID/select-solutions">
            <VerboseMockedProvider mocks={mocks} addTypename={false}>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <CheckboxCard solution={solution[0]} index={0} />
              </Formik>
            </VerboseMockedProvider>
          </Route>
        </MemoryRouter>
      );

      await waitForElementToBeRemoved(() => getByTestId('spinner'));

      await waitFor(() => {
        expect(getByText('at.mint@oddball.io')).toBeInTheDocument();
      });

      const checkbox = getByRole('checkbox', { name: /Select this solution/i });

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
