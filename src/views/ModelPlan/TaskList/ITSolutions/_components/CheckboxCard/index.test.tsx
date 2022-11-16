import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';

import { OperationalSolutionKey } from 'types/graphql-global-types';

import { initialValues } from '../../SelectSolutions';

import CheckboxCard from '.';

const solution = [
  {
    __typename: 'OperationalSolution' as const,
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Research, Measurement, Assessment, Design, and Analysis (RMADA)',
    key: OperationalSolutionKey.RMADA,
    needed: true,
    pocName: 'John Doe',
    nameOther: null
  }
];

const handleSubmit = jest.fn();

describe('IT Solutions CheckboxCard', () => {
  it('matches snapshot', async () => {
    await act(async () => {
      const { asFragment, getByRole } = render(
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <CheckboxCard solution={solution[0]} index={0} />
        </Formik>
      );

      const checkbox = getByRole('checkbox', { name: /select a solution/i });

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
