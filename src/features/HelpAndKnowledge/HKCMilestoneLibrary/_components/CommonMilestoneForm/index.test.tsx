import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { allCommonSolutionsMock } from 'tests/mock/general';

import MessageProvider from 'contexts/MessageContext';

import CommonMilestoneForm from './index';

const mocks = [...allCommonSolutionsMock];

describe('Manage Common Milestone form', () => {
  it('should render add common milestone mode accordingly', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <CommonMilestoneForm
                mode="addCommonMilestone"
                closeModal={() => {}}
                setDisableButton={() => {}}
                setIsDirty={() => {}}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );

    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Add a common milestone')).toBeInTheDocument();
      expect(document.querySelector('[name="description"]')).toHaveValue('');
      expect(
        document.querySelector('[id*="facilitated-by-role"]')
      ).toHaveTextContent(/0 selected/i);
      expect(
        document.querySelector('[id*="common-solutions"]')
      ).toHaveTextContent(/0 selected/i);
    });
  });

  it('should matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge/milestone-library',
          element: (
            <MessageProvider>
              <CommonMilestoneForm
                mode="addCommonMilestone"
                closeModal={() => {}}
                setDisableButton={() => {}}
                setIsDirty={() => {}}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge/milestone-library']
      }
    );

    const { queryByText, asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
