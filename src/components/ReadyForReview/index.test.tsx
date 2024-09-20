import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { TaskStatus } from 'gql/generated/graphql';

import ReadyForReview from './index';

const onSubmit = (values: any) => {};

const initialValues = {
  id: 'readyForReview',
  field: 'field',
  sectionName: 'Basics',
  status: TaskStatus.IN_PROGRESS,
  readyForReviewBy: 'Jerry Seinfeld',
  readyForReviewDts: '2024-05-12T15:01:39.190679Z',
  setFieldValue: (field: string, value: any) => {}
};

describe('The ReadyForReview Component', () => {
  it('renders the component in formik', async () => {
    const { getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <ReadyForReview {...initialValues} />
      </Formik>
    );

    await waitFor(() => {
      expect(getByTestId('readyForReview')).toBeInTheDocument();
    });
  });

  it('renders the component with status = READY_FOR_REVIEW', async () => {
    const { getByText, getByTestId } = render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <ReadyForReview
          {...initialValues}
          status={TaskStatus.READY_FOR_REVIEW}
        />
      </Formik>
    );

    await waitFor(() => {
      const component = getByTestId('readyForReview') as HTMLInputElement;
      expect(component).toBeInTheDocument();
      expect(component.checked).toEqual(true);
      expect(getByText(/Jerry Seinfeld/)).toBeInTheDocument();
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <ReadyForReview {...initialValues} />
      </Formik>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
