import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { modelID, modelTimelineMocks as mocks } from 'tests/mock/readonly';

import ReadOnlyModelTimeline from './index';

const mockStore = configureMockStore();
const store = mockStore({ auth: { euaId: 'MINT' } });

describe('Read Only Model Plan Summary -- Model timeline', () => {
  it('renders without errors', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/model-timeline',
          element: <ReadOnlyModelTimeline modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/model-timeline`]
      }
    );

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Theses are my best guess notes')
      ).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/read-view/model-timeline',
          element: <ReadOnlyModelTimeline modelID={modelID} />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/read-view/model-timeline`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Theses are my best guess notes')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
