import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import MockedProvider from 'tests/MockedProvider';

import DownloadSectionModal from './index';

describe('DownloadSectionModal', () => {
  it('disables the download button until a filter option is selected', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MockedProvider mocks={[]} addTypename={false}>
              <DownloadSectionModal
                isModalOpen
                closeModal={() => {}}
                reportType="allModels"
              />
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

    expect(screen.getByText('Configure download list')).toBeInTheDocument();

    expect(
      screen.getByText(
        'Select the model statuses or groups of models you would like to include in this download. MINT will include all models from the selected groups in your excel download.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Ended')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Draft Model Plan'));

    expect(downloadButton).toBeEnabled();
  });

  it('basic model info should not show inactive statuses as a filter option', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MockedProvider mocks={[]} addTypename={false}>
              <DownloadSectionModal
                isModalOpen
                closeModal={() => {}}
                reportType="basicModelInfo"
              />
            </MockedProvider>
          )
        }
      ],
      { initialEntries: ['/'] }
    );

    render(<RouterProvider router={router} />);

    expect(screen.queryByText('Ended')).not.toBeInTheDocument();
    expect(screen.queryByText('Paused')).not.toBeInTheDocument();
    expect(screen.queryByText('Canceled')).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MockedProvider mocks={[]} addTypename={false}>
              <DownloadSectionModal
                isModalOpen
                closeModal={() => {}}
                reportType="allModels"
              />
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
