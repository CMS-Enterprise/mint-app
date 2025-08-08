import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import {
  allMTOSolutionsMock,
  categoryMock,
  milestoneMock,
  modelID
} from 'tests/mock/mto';

import { EditMTOMilestoneProvider } from 'contexts/EditMTOMilestoneContext';
import MessageProvider from 'contexts/MessageContext';

import ActionMenu from '.';

describe('Component', () => {
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/',
          element: (
            <MessageProvider>
              <ActionMenu
                rowType="milestone"
                milestoneID="123"
                subCategoryID="1234"
                primaryCategoryID="12345"
                MoveDown={<></>}
                MoveUp={<></>}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/`]
      }
    );

    const { asFragment } = render(<RouterProvider router={router} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('opens and closes the modal based on URL parameter', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MessageProvider>
              <EditMTOMilestoneProvider>
                <ActionMenu
                  rowType="milestone"
                  milestoneID="123"
                  subCategoryID="1234"
                  primaryCategoryID="12345"
                  MoveDown={<></>}
                  MoveUp={<></>}
                />
              </EditMTOMilestoneProvider>
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?view=milestones&edit-milestone=123`
        ]
      }
    );

    render(
      <MockedProvider
        mocks={[
          ...milestoneMock('123'),
          ...categoryMock,
          ...allMTOSolutionsMock
        ]}
        addTypename={false}
      >
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
