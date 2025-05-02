import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { allMTOSolutionsMock, milestoneMock, modelID } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import SelectSolutionForm from './index';

describe('Select a Solution form', () => {
  it('matches snapshot', async () => {
    const { getByText, asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider
            mocks={[...milestoneMock(''), ...allMTOSolutionsMock]}
            addTypename={false}
          >
            <Route path="/models/:modelID/">
              <SelectSolutionForm />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        getByText(
          'Any added solutions will be associated with this milestone and will also appear in the solution view of your MTO.'
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
