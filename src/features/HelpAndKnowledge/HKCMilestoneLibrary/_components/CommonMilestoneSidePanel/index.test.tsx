import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { commonSolutionsAndCategoriesMock } from 'tests/mock/general';
import { commonMilestonesMockData } from 'tests/mock/mto';

import { ASSESSMENT } from 'constants/jobCodes';
import MessageProvider from 'contexts/MessageContext';

import CommonMilestoneSidePanel from '.';

const mocks = [...commonSolutionsAndCategoriesMock];

const mockAuthAssessment = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthAssessment });

describe('CommonMilestoneSidePanel', () => {
  const addRouterConfig = (isPanelOpen: boolean) =>
    createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <CommonMilestoneSidePanel
                isPanelOpen={isPanelOpen}
                closeModal={() => {}}
                mode="addCommonMilestone"
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );

  const editRouterConfig = (isPanelOpen: boolean) =>
    createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <CommonMilestoneSidePanel
                isPanelOpen={isPanelOpen}
                commonMilestone={commonMilestonesMockData[0]}
                closeModal={() => {}}
                mode="editCommonMilestone"
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [
          '/help-and-knowledge/milestone-library?page=1&milestone=123456&edit=true'
        ]
      }
    );

  it('should render side panel in add mode accordingly', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <RouterProvider router={addRouterConfig(true)} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Add a common milestone')).toBeInTheDocument();

      expect(getByTestId('common-milestone-side-panel')).toBeInTheDocument();
    });
  });

  it('should render side panel in edit mode accordingly', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <RouterProvider router={editRouterConfig(true)} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Edit milestone')).toBeInTheDocument();

      expect(getByTestId('common-milestone-side-panel')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { getByTestId, getByRole, baseElement } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={store}>
          <RouterProvider router={addRouterConfig(true)} />
        </Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByTestId('common-milestone-side-panel')).toBeInTheDocument();
      expect(getByRole('button', { name: /Add milestone/i })).toBeDisabled();
    });

    const overlay = baseElement.querySelector('.ReactModal__Overlay');
    overlay?.classList.remove('ReactModal__Overlay--after-open');

    const content = baseElement.querySelector('.ReactModal__Content');
    content?.classList.remove('ReactModal__Content--after-open');

    expect(baseElement).toMatchSnapshot();
  });
});
