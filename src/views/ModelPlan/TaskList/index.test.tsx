import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import GetModelPlanQuery from 'queries/GetModelPlanQuery';

import TaskList from './index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

describe('The Model Plan Task List', () => {
  const MODEL_ID = '6e224030-09d5-46f7-ad04-4bb851b36eab';
  const intakeQuery = (intakeData: any) => {
    return {
      request: {
        query: GetModelPlanQuery,
        variables: {
          id: MODEL_ID
        }
      },
      result: {
        data: {
          modelPlan: {
            id: MODEL_ID,
            modelName: '',
            basics: null,
            ...intakeData
          }
        }
      }
    };
  };

  it('renders without crashing', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${MODEL_ID}/task-list`]}>
        <MockedProvider mocks={[intakeQuery({})]} addTypename={false}>
          <Route path="/models/:modelId/task-list" component={TaskList} />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByTestId('model-plan-task-list')
    ).toBeInTheDocument();
  });

  it('displays the model plan task list steps', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${MODEL_ID}/task-list`]}>
        <MockedProvider mocks={[intakeQuery({})]} addTypename={false}>
          <Route path="/models/:modelId/task-list" component={TaskList} />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByTestId('task-list')).toBeInTheDocument();
  });

  it('displays the model plan name', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${MODEL_ID}/task-list`]}>
        <MockedProvider
          mocks={[
            intakeQuery({
              modelName: "PM Butler's great plan"
            })
          ]}
          addTypename={false}
        >
          <Route path="/models/:modelId/task-list" component={TaskList} />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-name').textContent).toContain(
        "for PM Butler's great plan"
      );
    });
  });

  describe('Statuses', () => {
    it('renders proper buttons for Model Basics', async () => {
      render(
        <MemoryRouter initialEntries={[`/models/${MODEL_ID}/task-list`]}>
          <MockedProvider
            mocks={[
              intakeQuery({
                basics: null
              })
            ]}
            addTypename={false}
          >
            <Route path="/models/:modelId/task-list" component={TaskList} />
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('tag')[0]).toHaveClass('bg-accent-cool');
        expect(screen.getAllByTestId('tag')[0]).toHaveTextContent(
          'Ready to start'
        );
      });
    });
  });
});
