import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  ModelPhase,
  ModelStatus,
  PhaseSuggestion,
  UpdateModelPlanDocument
} from 'gql/generated/graphql';
import { describe, it, vi } from 'vitest';

import UpdateStatusModal from '.';

const statusMock = [
  {
    request: {
      query: UpdateModelPlanDocument,
      variables: {
        id: '123',
        changes: {
          status: ModelStatus.INTERNAL_CMMI_CLEARANCE
        }
      }
    },
    result: {
      data: {
        __typename: 'ModelPlan',
        modelPlan: {
          id: '123',
          status: ModelStatus.INTERNAL_CMMI_CLEARANCE
        }
      }
    }
  }
];

describe('UpdateStatusModal', () => {
  const mockCloseModal = vi.fn();

  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
    console.error = vi.fn();

  const mockSuggestedPhase: PhaseSuggestion = {
    __typename: 'PhaseSuggestion',
    phase: ModelPhase.IN_CLEARANCE,
    suggestedStatuses: [
      ModelStatus.INTERNAL_CMMI_CLEARANCE,
      ModelStatus.CMS_CLEARANCE,
      ModelStatus.HHS_CLEARANCE,
      ModelStatus.OMB_ASRF_CLEARANCE
    ]
  };

  beforeEach(() => {
    render(
      <MockedProvider mocks={statusMock} addTypename={false}>
        <UpdateStatusModal
          modelID="123"
          isOpen
          closeModal={mockCloseModal}
          currentStatus={ModelStatus.PLAN_DRAFT}
          suggestedPhase={mockSuggestedPhase}
          setStatusMessage={() => null}
          refetch={() => null}
        />
      </MockedProvider>
    );
  });

  it('renders the component', () => {
    expect(screen.getByText('Update model status?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your model’s anticipated timeline suggests that it is now in clearance. Would you like to update the status of your model to reflect that? If your model is not yet in clearance, please adjust your model’s anticipated timeline.'
      )
    ).toBeInTheDocument();
  });

  it('changes the status using the dropdown', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, {
      target: { value: ModelStatus.CMS_CLEARANCE }
    });
    expect(select.value).toBe(ModelStatus.CMS_CLEARANCE);
  });

  it('matches snapshot', async () => {
    const modalComponent = screen.getByTestId('update-status-modal');
    expect(modalComponent).toMatchSnapshot();
  });
});
