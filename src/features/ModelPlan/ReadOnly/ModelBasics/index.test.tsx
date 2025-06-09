import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { ModelCategory } from 'gql/generated/graphql';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';
import { modelBasicsMocks as mocks, modelID } from 'tests/mock/readonly';

import ReadOnlyModelBasics from './index';

const mockStore = configureMockStore();
const store = mockStore({ auth: { euaId: 'MINT' } });

describe('Read Only Model Plan Summary -- Model Basics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/model-basics">
              <ReadOnlyModelBasics modelID={modelID} />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('43532323')).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t(`basics:modelCategory.options.${ModelCategory.STATE_BASED}`)
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t(
            `basics:modelCategory.options.${ModelCategory.ACCOUNTABLE_CARE}`
          )
        )
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/model-basics">
              <ReadOnlyModelBasics modelID={modelID} />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('43532323')).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t(`basics:modelCategory.options.${ModelCategory.STATE_BASED}`)
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          i18next.t(
            `basics:modelCategory.options.${ModelCategory.ACCOUNTABLE_CARE}`
          )
        )
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
