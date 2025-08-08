import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { modelID } from 'tests/mock/readonly';

import MessageProvider from 'contexts/MessageContext';

import FilterViewModal from './index';

describe('Filter View Modal', () => {
  it('renders without crashing', async () => {
    const closeModal = vi.fn();
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <FilterViewModal filteredView="" closeModal={closeModal} />
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

    render(<RouterProvider router={router} />);
  });

  it('matches snapshot', async () => {
    const closeModal = vi.fn();
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <FilterViewModal filteredView="" closeModal={closeModal} />
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
      expect(screen.getByTestId('filter-view-modal')).toBeInTheDocument();

      const combobox = screen.getByTestId('combo-box-select');
      userEvent.selectOptions(combobox, ['cmmi']);
      expect(combobox).toHaveValue('cmmi');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
