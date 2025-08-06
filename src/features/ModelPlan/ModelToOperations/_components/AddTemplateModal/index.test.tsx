import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { categoryMock, modelID } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import AddTemplateModal from '.';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider
            mocks={[...[...categoryMock]]}
            addTypename={false}
          >
            <Routes>
          <Route
            path="/models/:modelID/"
            element={<AddTemplateModal  />}
          />
        </Routes>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
