import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import CommonMilestoneConfirmationModal from '.';

describe('CommonMilestoneConfirmationModal Component', () => {
  const defaultProps = {
    isModalOpen: true,
    closeModal: () => {},
    onConfirmClick: () => {}
  };

  const renderComponent = (actionType: 'edit' | 'remove') => {
    return createMemoryRouter([
      {
        path: '/',
        element: (
          <CommonMilestoneConfirmationModal
            {...defaultProps}
            actionType={actionType}
          />
        )
      }
    ]);
  };

  it('renders the edit context correctly', () => {
    const { getByText, getByRole } = render(
      <MockedProvider addTypename={false}>
        <RouterProvider router={renderComponent('edit')} />
      </MockedProvider>
    );

    expect(
      getByText('Are you sure you want to save changes?')
    ).toBeInTheDocument();

    const confirmBtn = getByRole('button', {
      name: /Save changes/i
    });
    expect(confirmBtn).toBeInTheDocument();
    expect(confirmBtn).not.toHaveClass('bg-error');
  });

  it('renders the remove context with error styling', () => {
    const { getByText, getByRole } = render(
      <MockedProvider addTypename={false}>
        <RouterProvider router={renderComponent('remove')} />
      </MockedProvider>
    );

    expect(
      getByText('Are you sure you want to remove this common milestone?')
    ).toBeInTheDocument();

    const confirmBtn = getByRole('button', {
      name: /Remove/i
    });
    expect(confirmBtn).toHaveClass('bg-error');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MockedProvider addTypename={false}>
        <RouterProvider router={renderComponent('edit')} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
