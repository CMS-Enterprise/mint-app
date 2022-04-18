import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import configureMockStore from 'redux-mock-store';

// import { initialSystemIntakeForm } from 'data/systemIntake';
import GetModelPlanQuery from 'queries/GetModelPlanQuery';

// import GetGRTFeedbackQuery from 'queries/GetGRTFeedbackQuery';
// import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
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

const intialModelPlan = {
  id: '',
  modelName: '',
  basics: null
};

const waitForPageLoad = async () => {
  await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));
};

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
            basics: null
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
    const mockStore = configureMockStore();
    const store = mockStore({
      ...intialModelPlan,
      modelName: "PM Butler's great plan"
    });

    render(
      <MemoryRouter initialEntries={[`/models/${MODEL_ID}/task-list`]}>
        <MockedProvider
          mocks={[intakeQuery({ modelName: "PM Butler's great plan" })]}
          addTypename={false}
        >
          {/* console.log(store) */}
          <Provider store={store}>
            <Route path="/models/:modelId/task-list" component={TaskList} />
          </Provider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitForPageLoad();

    expect(screen.getByTestId('model-plan-name').textContent).toContain(
      "for PM Butler's great plan"
    );
  });
});
