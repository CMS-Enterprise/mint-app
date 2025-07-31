import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { modelID, modelTimelineMocks as mocks } from 'tests/mock/readonly';

import ReadOnlyModelTimeline from './index';

const mockStore = configureMockStore();
const store = mockStore({ auth: { euaId: 'MINT' } });

describe('Read Only Model Plan Summary -- Model timeline', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-view/model-timeline`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-view/model-timeline">
              <ReadOnlyModelTimeline modelID={modelID} />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Theses are my best guess notes')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-view/model-timeline`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-view/model-timeline">
              <ReadOnlyModelTimeline modelID={modelID} />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Theses are my best guess notes')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
