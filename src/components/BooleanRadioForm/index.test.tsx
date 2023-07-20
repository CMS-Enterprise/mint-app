import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';

import BooleanRadio from '.';

const onSubmit = (values: any) => {};

describe('The BooleanRadio component', () => {
  it('adds input to field', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <Formik
          initialValues={{ careCoordinationInvolved: null }}
          onSubmit={onSubmit}
        >
          {formikProps => {
            const { setFieldValue, values } = formikProps;
            return (
              <BooleanRadio
                field="careCoordinationInvolved"
                id="care-coordination-involved"
                value={values.careCoordinationInvolved}
                setFieldValue={setFieldValue}
                options={{
                  true: 'Yes',
                  false: 'No'
                }}
              />
            );
          }}
        </Formik>
      );

      await waitFor(() => {
        userEvent.click(getByTestId('care-coordination-involved'));
        expect(getByTestId('care-coordination-involved')).toBeChecked();
      });
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <Formik
        initialValues={{ careCoordinationInvolved: null }}
        onSubmit={onSubmit}
      >
        {formikProps => {
          const { setFieldValue, values } = formikProps;
          return (
            <BooleanRadio
              field="careCoordinationInvolved"
              id="care-coordination-involved"
              value={values.careCoordinationInvolved}
              setFieldValue={setFieldValue}
              options={{
                true: 'Yes',
                false: 'No'
              }}
            />
          );
        }}
      </Formik>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
