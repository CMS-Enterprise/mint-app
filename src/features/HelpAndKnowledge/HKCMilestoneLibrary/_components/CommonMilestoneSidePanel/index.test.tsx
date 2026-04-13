import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { allCommonSolutionsMock } from 'tests/mock/general';

import MessageProvider from 'contexts/MessageContext';

import CommonMilestoneSidePanel from '.';

const mocks = [...allCommonSolutionsMock];

describe('CommonMilestoneSidePanel', () => {
  const routerConfig = (isPanelOpen: boolean) =>
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

  it('should render side panel in add mode accordingly', async () => {
    const { getByText, getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={routerConfig(true)} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Add a common milestone')).toBeInTheDocument();

      expect(getByTestId('common-milestone-side-panel')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { getByTestId, getByRole, baseElement } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={routerConfig(true)} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByTestId('common-milestone-side-panel')).toBeInTheDocument();
      expect(getByRole('button', { name: /Add milestone/i })).toBeDisabled();
    });

    expect(baseElement).toMatchSnapshot();
  });
});
