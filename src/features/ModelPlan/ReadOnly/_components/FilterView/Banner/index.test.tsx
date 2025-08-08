import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { modelID } from 'tests/mock/readonly';

import MessageProvider from 'contexts/MessageContext';

import { filterGroups } from '../BodyContent/_filterGroupMapping';

import Banner from './index';

describe('Filter View Modal', () => {
  const openFilterModal = vi.fn();
  const openExportModal = vi.fn();
  it('renders without crashing', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <Banner
                openFilterModal={openFilterModal}
                openExportModal={openExportModal}
                filteredView={'CMMI' as (typeof filterGroups)[number]}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions&hide-milestones-without-solutions=false&type=all`
        ]
      }
    );
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('group-filter-banner')).toBeInTheDocument();
      expect(screen.getByText('CMMI')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <Banner
                openFilterModal={openFilterModal}
                openExportModal={openExportModal}
                filteredView={'CMMI' as (typeof filterGroups)[number]}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=solutions&hide-milestones-without-solutions=false&type=all`
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('group-filter-banner')).toBeInTheDocument();
      expect(screen.getByText('CMMI')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
