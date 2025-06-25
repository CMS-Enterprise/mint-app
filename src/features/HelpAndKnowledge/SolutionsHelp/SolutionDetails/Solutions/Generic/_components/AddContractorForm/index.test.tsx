import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import AddContractorForm from './index';

const mocks = [...possibleSolutionsMock];

describe('Add a contractor form', () => {
  it('should matches snapshot', async () => {
    const { getByText, asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <AddContractorForm closeModal={() => {}} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Contract Title')).toBeInTheDocument();
      expect(getByText('Contractor Name')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
