import React from 'react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import MilestoneNoteForm from '.';

const mockStore = configureMockStore([]);

const renderWithProviders = (
  ui: React.ReactElement,
  apolloMocks: any[] = []
) => {
  const store = mockStore({
    auth: {
      euaId: 'TEST',
      name: 'Test User'
    }
  });

  return render(
    <Provider store={store}>
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        {ui}
      </MockedProvider>
    </Provider>
  );
};

describe('MilestoneNoteForm', () => {
  const baseProps = {
    mtoMilestoneID: '123',
    milestoneNotes: [],
    setMilestoneNotes: vi.fn(),
    closeModal: vi.fn(),
    selectedMilestoneNote: null,
    readView: false
  };

  beforeEach(() => {
    (baseProps.setMilestoneNotes as unknown as Mock).mockClear();
    (baseProps.closeModal as unknown as Mock).mockClear();
  });

  it('renders add form and disables submit when empty', () => {
    renderWithProviders(<MilestoneNoteForm {...baseProps} />);

    expect(screen.getByText('Add a milestone note')).toBeInTheDocument();

    const submit = screen.getByRole('button', {
      name: 'Add note'
    });
    // Avoid jsdom requestSubmit by converting the button into a non-submit button
    submit.setAttribute('type', 'button');
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'A note' }
    });

    expect(submit).not.toBeDisabled();
  });

  it('appends note in matrix (not readView)', () => {
    const setNotes = vi.fn();
    renderWithProviders(
      <MilestoneNoteForm
        {...baseProps}
        setMilestoneNotes={setNotes}
        readView={false}
      />
    );

    fireEvent.change(screen.getByLabelText('Note'), {
      target: { value: 'Matrix note' }
    });

    const submit = screen.getByRole('button', { name: 'Add note' });
    submit.setAttribute('type', 'button');
    fireEvent.click(submit);

    expect(setNotes).toHaveBeenCalledTimes(1);
    expect(baseProps.closeModal).toHaveBeenCalledTimes(1);
  });
});
