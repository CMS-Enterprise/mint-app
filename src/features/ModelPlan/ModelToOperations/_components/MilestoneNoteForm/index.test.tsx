import React from 'react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { vi } from 'vitest';

import MilestoneNoteForm from '.';

const mockStore = configureMockStore([]);

describe('MilestoneNoteForm', () => {
  const store = mockStore({
    auth: {
      euaId: 'TEST',
      name: 'Test User'
    }
  });

  const baseProps = {
    mtoMilestoneID: '123',
    milestoneNotes: [],
    setMilestoneNotes: vi.fn(),
    closeModal: vi.fn(),
    selectedMilestoneNote: null,
    readView: false
  };

  it('renders add form and disables submit when empty', () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={[]} addTypename={false}>
          <MilestoneNoteForm {...baseProps} />
        </MockedProvider>
      </Provider>
    );

    expect(screen.getByText('Add a milestone note')).toBeInTheDocument();

    const submit = screen.getByRole('button', {
      name: 'Add note'
    });

    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'A note' }
    });

    expect(submit).not.toBeDisabled();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <MockedProvider mocks={[]} addTypename={false}>
          <MilestoneNoteForm {...baseProps} />
        </MockedProvider>
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
