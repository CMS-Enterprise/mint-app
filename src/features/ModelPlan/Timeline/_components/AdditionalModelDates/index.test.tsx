import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import { CustomTimelineDateType } from 'gql/generated/graphql';

import { CustomTimelineDates } from '../..';

import AdditionalModelDates from '.';

const onSubmit = (values: any) => {};

const initialValues: CustomTimelineDates = [
  {
    __typename: 'CustomTimelineDate',
    id: '123',
    title: 'title 1',
    description: 'Im a fake description.',
    dateType: CustomTimelineDateType.SINGLE,
    startDate: '2026-07-09T06:00:00Z'
  },
  {
    __typename: 'CustomTimelineDate',
    id: '456',
    title: 'second title',
    dateType: CustomTimelineDateType.RANGE,
    startDate: '2026-07-08T06:00:00Z',
    endDate: '2026-07-15T06:00:00Z'
  }
];

describe('AdditionalModelDates', () => {
  it('renders custom dates when provided', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              <AdditionalModelDates customTimelineDates={initialValues} />
            </Formik>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText } = render(<RouterProvider router={router} />);

    expect(getByText('title 1')).toBeInTheDocument();
    expect(getByText('second title')).toBeInTheDocument();
  });

  it('renders no custom dates when none are provided', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <Formik initialValues={[]} onSubmit={onSubmit}>
              <AdditionalModelDates customTimelineDates={[]} />
            </Formik>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText, queryByText } = render(
      <RouterProvider router={router} />
    );

    expect(
      getByText(
        'There are not currently any additional dates listed for this model.'
      )
    ).toBeInTheDocument();
    expect(queryByText('title 1')).not.toBeInTheDocument();
    expect(queryByText('second title')).not.toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              <AdditionalModelDates customTimelineDates={initialValues} />
            </Formik>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
