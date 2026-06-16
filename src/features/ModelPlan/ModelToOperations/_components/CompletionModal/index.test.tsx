import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { MtoRiskIndicator } from 'gql/generated/graphql';
import { modelID } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import CompletionModal from './index';

describe('CompletionModal Component', () => {
  const defaultProps = {
    isModalOpen: true,
    closeModal: vi.fn(),
    mode: 'milestone' as const,
    modelID,
    riskIndicator: MtoRiskIndicator.ON_TRACK,
    handleRemoveRiskIndicator: vi.fn()
  };

  const setup = (props = defaultProps) => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <MessageProvider>
              <CompletionModal {...props} />
            </MessageProvider>
          )
        }
      ],
      { initialEntries: ['/'] }
    );

    return render(<RouterProvider router={router} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when milestone is on track', () => {
    const { getByText, queryByText, getByRole } = setup();

    expect(
      getByText('You marked this milestone as complete!')
    ).toBeInTheDocument();
    expect(queryByText('Remove risk indicator')).not.toBeInTheDocument();
    expect(getByRole('link')).toHaveAttribute(
      'href',
      `/models/${defaultProps.modelID}/collaboration-area/model-to-operations/matrix?view=solutions&page=1`
    );

    const okayBtn = getByRole('button', { name: 'Okay' });
    fireEvent.click(okayBtn);

    expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it('renders correctly when milestone has a risk indicator', () => {
    const { getByText, getByRole, queryByRole } = setup({
      ...defaultProps,
      riskIndicator: MtoRiskIndicator.AT_RISK
    });

    expect(getByText(/Significantly at risk/i)).toBeInTheDocument();
    expect(
      getByText('You marked this milestone as complete!')
    ).toBeInTheDocument();

    expect(queryByRole('button', { name: 'Okay' })).not.toBeInTheDocument();

    const removeBtn = getByRole('button', { name: 'Remove risk indicator' });
    fireEvent.click(removeBtn);
    expect(defaultProps.handleRemoveRiskIndicator).toHaveBeenCalledTimes(1);
  });

  it('closes the modal when clicking "Don’t remove indicator"', () => {
    const { getByRole } = setup({
      ...defaultProps,
      riskIndicator: MtoRiskIndicator.AT_RISK
    });

    const cancelBtn = getByRole('button', {
      name: 'Don’t remove indicator'
    });
    fireEvent.click(cancelBtn);

    expect(defaultProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it('matches the snapshot for On Track state', () => {
    const { baseElement } = setup();
    expect(baseElement).toMatchSnapshot();
  });
});
