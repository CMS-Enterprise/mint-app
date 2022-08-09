import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';

import { GcPartCDType } from 'types/graphql-global-types';
import { translateGcPartCDType } from 'utils/modelPlan';

import { ITToolsFormComponent } from '.';

const onSubmit = (values: any) => {};

const formikValues = {
  gcPartCD: ['MARX', 'OTHER'],
  gcPartCDOther: 'Test Other'
};

describe('The ITToolsFormComponent component', () => {
  it('renders checkbox options if needs tool', async () => {
    const { getByTestId } = render(
      <Formik initialValues={formikValues} onSubmit={onSubmit}>
        <ITToolsFormComponent
          flatErrors={{}}
          formikValue={formikValues.gcPartCD}
          fieldName="gcPartCD"
          needsTool
          htmlID="gc-partc"
          EnumType={GcPartCDType}
          translation={translateGcPartCDType}
        />
      </Formik>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-gc-partc-MARX')).toBeChecked();
      expect(getByTestId('it-tools-gc-partc-OTHER')).toBeChecked();
      expect(getByTestId('it-tools-gc-partc-other')).toHaveValue('Test Other');
    });
  });

  it('renders checkbox options if does not need tool', async () => {
    const { getByTestId } = render(
      <Formik initialValues={{ gcPartCD: [] }} onSubmit={onSubmit}>
        <ITToolsFormComponent
          flatErrors={{}}
          formikValue={formikValues.gcPartCD}
          fieldName="gcPartCD"
          needsTool={false}
          htmlID="gc-partc"
          EnumType={GcPartCDType}
          translation={translateGcPartCDType}
        />
      </Formik>
    );

    await waitFor(() => {
      expect(getByTestId('it-tools-gc-partc-MARX')).toHaveAttribute('disabled');
      expect(getByTestId('it-tools-gc-partc-OTHER')).toHaveAttribute(
        'disabled'
      );
      expect(() => getByTestId('it-tools-gc-partc-other')).toThrow();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <Formik initialValues={formikValues} onSubmit={onSubmit}>
        <ITToolsFormComponent
          flatErrors={{}}
          formikValue={formikValues.gcPartCD}
          fieldName="gcPartCD"
          needsTool
          htmlID="gc-partc"
          EnumType={GcPartCDType}
          translation={translateGcPartCDType}
        />
      </Formik>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
