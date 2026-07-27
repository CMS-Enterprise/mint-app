import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import MockedProvider from 'tests/MockedProvider';

import DateRangeModal from './index';

describe('DateRangeModal', () => {
  it('disables the download button until both dates are selected', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MockedProvider mocks={[]} addTypename={false}>
              <DateRangeModal isModalOpen closeModal={() => {}} />
            </MockedProvider>
          )
        }
      ],
      { initialEntries: ['/'] }
    );

    render(<RouterProvider router={router} />);

    const downloadButton = screen.getByRole('button', {
      name: i18next.t('analytics:download')
    });
    expect(downloadButton).toBeDisabled();

    const [startInput, endInput] = screen.getAllByRole('textbox');
    await user.type(startInput, '07/20/2023');
    await user.type(endInput, '07/21/2023');

    expect(downloadButton).toBeEnabled();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MockedProvider mocks={[]} addTypename={false}>
              <DateRangeModal isModalOpen closeModal={() => {}} />
            </MockedProvider>
          )
        }
      ],
      { initialEntries: ['/'] }
    );

    const { baseElement } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
