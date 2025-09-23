import React from 'react';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { vi } from 'vitest';

import { MilestoneNoteType } from '../EditMilestoneForm';

import MilestoneNotes from '.';

const mockStore = configureMockStore([]);

const renderWithProviders = (ui: React.ReactElement) => {
  const store = mockStore({
    auth: {
      euaId: 'TEST'
    }
  });

  return render(
    <Provider store={store}>
      <MockedProvider mocks={[]} addTypename={false}>
        {ui}
      </MockedProvider>
    </Provider>
  );
};

const sampleNotes: MilestoneNoteType[] = [
  {
    __typename: 'MTOMilestoneNote',
    id: '1',
    content: 'First note',
    createdDts: '2024-01-01T12:00:00Z',
    createdByUserAccount: {
      __typename: 'UserAccount',
      id: 'u1',
      username: 'TEST',
      commonName: 'Test User'
    }
  }
];

// ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
// eslint-disable-next-line
console.error = vi.fn();

describe('MilestoneNotes', () => {
  it('renders heading and note count, opens sidepanel to add note and matches snapshot', () => {
    const setNotes = vi.fn();
    const setSelected = vi.fn();

    const { asFragment } = renderWithProviders(
      <MilestoneNotes
        mtoMilestoneID="123"
        milestoneNotes={sampleNotes}
        setMilestoneNotes={setNotes}
        selectedMilestoneNote={null}
        setSelectedMilestoneNote={setSelected}
        readView={false}
      />
    );

    expect(screen.getByText('Milestone notes')).toBeInTheDocument();
    expect(
      screen.getByText('1 note added to this milestone')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add a note forward' }));
    expect(screen.getByTestId('edit-notes-sidepanel')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('shows notes and allows edit/remove buttons for owner notes', () => {
    const setNotes = vi.fn();
    const setSelected = vi.fn();

    renderWithProviders(
      <MilestoneNotes
        mtoMilestoneID="123"
        milestoneNotes={sampleNotes}
        setMilestoneNotes={setNotes}
        selectedMilestoneNote={null}
        setSelectedMilestoneNote={setSelected}
        readView={false}
      />
    );

    expect(screen.getByText('First note')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Edit this note' }));
    expect(screen.getByTestId('edit-notes-sidepanel')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Remove this note' }));
    expect(setNotes).toHaveBeenCalled();
  });

  it('does not show edit/remove buttons for non-owner notes', () => {
    const setNotes = vi.fn();
    const setSelected = vi.fn();

    const notes = [...sampleNotes];

    notes[0].createdByUserAccount = {
      __typename: 'UserAccount',
      id: 'u2',
      username: 'MINT',
      commonName: 'MINT User'
    };

    renderWithProviders(
      <MilestoneNotes
        mtoMilestoneID="123"
        milestoneNotes={notes}
        setMilestoneNotes={setNotes}
        selectedMilestoneNote={null}
        setSelectedMilestoneNote={setSelected}
        readView={false}
      />
    );

    expect(
      screen.queryByRole('button', { name: 'Edit this note' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove this note' })
    ).not.toBeInTheDocument();
  });
});
