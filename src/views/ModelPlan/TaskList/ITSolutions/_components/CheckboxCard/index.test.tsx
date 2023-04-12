import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act, render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';

import {
  OperationalSolutionKey,
  OpSolutionStatus
} from 'types/graphql-global-types';

import { initialValues } from '../../SelectSolutions';

import CheckboxCard from '.';

const solution = [
  {
    __typename: 'OperationalSolution' as const,
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
    isOther: false,
    key: OperationalSolutionKey.RMADA,
    mustStartDts: null,
    mustFinishDts: null,
    status: OpSolutionStatus.IN_PROGRESS,
    needed: true,
    otherHeader: null,
    pocName: 'John Doe',
    pocEmail: '',
    nameOther: null
  }
];

const handleSubmit = jest.fn();

describe('IT Solutions CheckboxCard', () => {
  it('matches snapshot', async () => {
    await act(async () => {
      const { asFragment, getByRole } = render(
        <MemoryRouter
          initialEntries={[
            '/models/602287ff-d9d5-4203-86eb-e168fbd47242/task-list/it-solutions/f92a8a35-86de-4e03-a81a-bd8bec2e30e3/select-solutions'
          ]}
        >
          <Route path="/models/:modelID/task-list/it-solutions/:operationalNeedID/select-solutions">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              <CheckboxCard solution={solution[0]} index={0} />
            </Formik>
          </Route>
        </MemoryRouter>
      );

      const checkbox = getByRole('checkbox', { name: /select a solution/i });

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
