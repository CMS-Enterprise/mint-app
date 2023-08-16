import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';
import { modelID, summaryMock as mocks } from 'data/mock/readonly';
import { ModelStatus } from 'types/graphql-global-types';
import { translateModelPlanStatus } from 'utils/modelPlan';

import ReadOnly from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

describe('Read Only Model Plan Summary', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/read-only/model-basics`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <Route path="/models/:modelID/read-only/:subinfo">
              <ReadOnly />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-read-only')).toBeInTheDocument();
    });

    await waitFor(() => {
      const { getByText } = within(screen.getByTestId('task-list-status'));
      expect(
        getByText(translateModelPlanStatus(ModelStatus.PLAN_DRAFT))
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('read-only-side-nav__wrapper')
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
            <Route path="/models/:modelID/read-only/:subinfo">
              <ReadOnly />
            </Route>
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const { getByText } = within(screen.getByTestId('task-list-status'));
      expect(
        getByText(translateModelPlanStatus(ModelStatus.PLAN_DRAFT))
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('read-only-side-nav__wrapper')
      ).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Status Tag updates', () => {
    it('renders "ICIP complete" tag and alert', async () => {
      mocks[0].result.data.modelPlan.status = ModelStatus.ICIP_COMPLETE;
      render(
        <MemoryRouter
          initialEntries={[`/models/${modelID}/read-only/model-basics`]}
        >
          <MockedProvider mocks={mocks} addTypename={false}>
            <Provider store={store}>
              <Route path="/models/:modelID/read-only/:subinfo">
                <ReadOnly />
              </Route>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('tag')[1].textContent).toContain(
          'ICIP complete'
        );
        expect(screen.getByTestId('alert')).toBeInTheDocument();
      });
    });

    it('renders "Cleared" tag and does not render alert', async () => {
      mocks[0].result.data.modelPlan.status = ModelStatus.CLEARED;
      render(
        <MemoryRouter
          initialEntries={[`/models/${modelID}/read-only/model-basics`]}
        >
          <MockedProvider mocks={mocks} addTypename={false}>
            <Provider store={store}>
              <Route path="/models/:modelID/read-only/:subinfo">
                <ReadOnly />
              </Route>
            </Provider>
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('tag')[1].textContent).toContain(
          'Cleared'
        );
        expect(screen.queryByTestId('alert')).toBeNull();
      });
    });
  });
});
