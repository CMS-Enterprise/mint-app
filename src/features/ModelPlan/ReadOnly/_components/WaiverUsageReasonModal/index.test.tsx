import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { SelectedWaiver } from '../SelectedWaiversTable';

import WaiverUsageReasonModal from '.';

const selectedWaiver: SelectedWaiver = {
  __typename: 'CommonWaiver',
  id: 'test123',
  name: 'test common waiver',
  isSuggested: false,
  usingReason: 'Second thought'
};

describe('WaiverUsageReasonModal Component', () => {
  it('should render provided waiver info', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <WaiverUsageReasonModal
              isOpen
              closeModal={() => {}}
              selectedWaiver={{
                ...selectedWaiver,
                usingReason: ''
              }}
            />
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { getByText } = render(<RouterProvider router={router} />);
    expect(getByText('Waiver usage reason')).toBeInTheDocument();
    expect(getByText('Waiver title:')).toBeInTheDocument();
    expect(getByText('test common waiver')).toBeInTheDocument();
    expect(getByText('Usage reason:')).toBeInTheDocument();
    expect(getByText('Not answered yet')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    render(
      <WaiverUsageReasonModal
        isOpen
        closeModal={() => {}}
        selectedWaiver={selectedWaiver}
      />
    );

    const modal = screen.getByTestId('waiver-test123-usage-reason-modal');
    expect(modal).toMatchSnapshot();
  });
});
