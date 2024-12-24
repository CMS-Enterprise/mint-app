import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import { categoryMock } from 'tests/mock/mto';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import RemoveCategoryForm from './index';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/`]}>
        <MessageProvider>
          <VerboseMockedProvider
            mocks={[...[...categoryMock]]}
            addTypename={false}
          >
            <Route path="/models/:modelID/">
              <RemoveCategoryForm closeModal={() => {}} />
            </Route>
          </VerboseMockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          `${i18next.t('modelToOperationsMisc:modal.remove.category.copy')}`
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: `${i18next.t('modelToOperationsMisc:modal.remove.category.button')}`
        })
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
