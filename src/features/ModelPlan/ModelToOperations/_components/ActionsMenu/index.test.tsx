import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { categoryMock, milestoneMock, modelID } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import ActionMenu from '.';

describe('Component', () => {
  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
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
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('opens and closes the modal based on URL parameter', () => {
    render(
      <MemoryRouter
        initialEntries={[
          `/models/${modelID}/collaboration-area/model-to-operations/matrix?edit-milestone=123`
        ]}
      >
        <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
          <MockedProvider
            mocks={[...milestoneMock, ...categoryMock]}
            addTypename={false}
          >
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
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
