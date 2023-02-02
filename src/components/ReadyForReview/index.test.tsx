import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';

import GetUserInfo from 'queries/GetUserInfo';
import { TaskStatus } from 'types/graphql-global-types';

import ReadyForReview from './index';

const onSubmit = (values: any) => {};

const intialValues = {
  id: 'readyForReview',
  field: 'field',
  sectionName: 'Basics',
  status: TaskStatus.IN_PROGRESS,
  readyForReviewBy: 'MINT',
  readyForReviewDts: '2024-05-12T15:01:39.190679Z',
  setFieldValue: (field: string, value: any) => {}
};

const mocks = [
  {
    request: {
      query: GetUserInfo,
      variables: { username: intialValues.readyForReviewBy }
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

describe('The ReadyForReview Component', () => {
  it('renders the component in formik', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Formik initialValues={intialValues} onSubmit={onSubmit}>
            <ReadyForReview {...intialValues} />
          </Formik>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(getByTestId('readyForReview')).toBeInTheDocument();
      });
    });
  });

  it('renders the component with status = READY_FOR_REVIEW', async () => {
    await act(async () => {
      const { getByText, getByTestId } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <Formik initialValues={intialValues} onSubmit={onSubmit}>
            <ReadyForReview
              {...intialValues}
              status={TaskStatus.READY_FOR_REVIEW}
            />
          </Formik>
        </MockedProvider>
      );

      await waitFor(() => {
        const component = getByTestId('readyForReview') as HTMLInputElement;
        expect(component).toBeInTheDocument();
        expect(component.checked).toEqual(true);
        expect(getByText(/Jerry Seinfeld/)).toBeInTheDocument();
      });
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Formik initialValues={intialValues} onSubmit={onSubmit}>
          <ReadyForReview {...intialValues} />
        </Formik>
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
