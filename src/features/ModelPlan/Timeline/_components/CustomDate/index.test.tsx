import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import {
  render,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomTimelineDateType } from 'gql/generated/graphql';
import { customDateID, customDateMocks, modelID } from 'tests/mock/general';
import MockedProvider from 'tests/MockedProvider';

import CustomDate from '.';

describe('CustomDate', () => {
  it('renders add new custom date form when rendered', () => {
    const router = createMemoryRouter(
      [
        {
          path: `/models/:modelID/collaboration-area/model-timeline/customDate/new`,
          element: <CustomDate />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-timeline/customDate/new`
        ]
      }
    );

    const { getByText, getByRole, getByTestId } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(getByText('Add a date')).toBeInTheDocument();
    expect(
      getByText('Add a custom date or date range to your model timeline.')
    ).toBeInTheDocument();
    expect(getByRole('button', { name: /save date/i })).toBeDisabled();
    expect(getByTestId('date-title')).toHaveValue('');
  });

  it('keeps the submit button disabled until required fields are filled', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        {
          path: `/models/:modelID/collaboration-area/model-timeline/customDate/new`,
          element: <CustomDate />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-timeline/customDate/new`
        ]
      }
    );

    const { container, getByRole, getByTestId } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const submitBtn = getByRole('button', { name: /save date/i });
    expect(submitBtn).toBeDisabled();

    await user.type(getByTestId('date-title'), 'My Custom Date');

    await user.click(getByTestId(CustomTimelineDateType.SINGLE));

    await waitFor(() => {
      expect(container.querySelector('#startDate')).toBeInTheDocument();
    });

    const dateInput = container.querySelector('#startDate')!;
    await user.type(dateInput, '11/11/2026');

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });
  });

  it('renders edit a chosen custom date form when rendered', async () => {
    const router = createMemoryRouter(
      [
        {
          path: `/models/:modelID/collaboration-area/model-timeline/customDate/:customDateID`,
          element: <CustomDate />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-timeline/customDate/${customDateID}`
        ]
      }
    );

    const { getByText, getByRole, getByTestId } = render(
      <MockedProvider mocks={customDateMocks}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitForElementToBeRemoved(() =>
      getByTestId('custom-date-timeline-loading')
    );

    await waitFor(() => expect(getByText('Edit a date')).toBeInTheDocument());
    await waitFor(() =>
      expect(
        getByText(
          'Make changes to a custom date or date range on your model timeline.'
        )
      ).toBeInTheDocument()
    );

    await waitFor(() => {
      expect(getByTestId('date-title')).toHaveValue('My Custom Date');
    });
    await waitFor(() => {
      expect(getByRole('button', { name: 'Save changes' })).toBeDisabled();
    });
  });

  it('matches the snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: `/models/:modelID/collaboration-area/model-timeline/customDate/new`,
          element: <CustomDate />
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-timeline/customDate/new`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
