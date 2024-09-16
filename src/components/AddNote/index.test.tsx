import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import setup from 'tests/util';

import AddNote from './index';

const onSubmit = (values: any) => {};

describe('The AddNote component', () => {
  it('adds input to field', async () => {
    await act(async () => {
      const { user, getByTestId } = setup(
        <Formik initialValues={{ testNote: '' }} onSubmit={onSubmit}>
          <AddNote id="test-note" field="testNote" />
        </Formik>
      );

      screen.getByRole('button', { name: /Add an additional note/i }).click();

      await waitFor(async () => {
        await user.type(getByTestId('test-note'), 'Test Note');
        expect(getByTestId('test-note')).toHaveValue('Test Note');
      });
    });
  });

  it('checks if init value expands note on load', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Formik
          initialValues={{ testNote2: 'test expand' }}
          onSubmit={onSubmit}
        >
          <AddNote id="test-note-2" field="testNote2" />
        </Formik>
      );

      const button = screen.queryByTestId('add-note-toggle');
      expect(button).not.toBeInTheDocument();

      await waitFor(() => {
        expect(getByTestId('test-note-2')).toHaveValue('test expand');
      });
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <Formik initialValues={{ testNote: '' }} onSubmit={onSubmit}>
        <AddNote id="test-note" field="testNote" />
      </Formik>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
