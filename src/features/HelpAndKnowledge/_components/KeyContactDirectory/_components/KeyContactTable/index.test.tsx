import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { waitFor } from '@testing-library/react';
import { keyContactsMock, keyContactsMockData } from 'tests/mock/general';
import setup from 'tests/util';

import KeyContactTable from './index';

describe('KeyContactTable', () => {
  it('renders certain content for assessment team', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <KeyContactTable
              smes={keyContactsMockData}
              isAssessmentTeam
              isSearching={false}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { getByText, getAllByText } = setup(
      <MockedProvider mocks={keyContactsMock}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Subject area')).toBeInTheDocument();
      expect(getByText('Actions')).toBeInTheDocument();
      expect(getByText('Insurance and Coverage')).toBeInTheDocument();
      expect(getAllByText('Edit')).toHaveLength(2);
    });
  });

  it('renders certain content for none assessment team', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <KeyContactTable
              smes={keyContactsMockData}
              isAssessmentTeam={false}
              isSearching={false}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { getByText, queryByText } = setup(
      <MockedProvider mocks={keyContactsMock}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Subject area')).toBeInTheDocument();
      expect(getByText('Insurance and Coverage')).toBeInTheDocument();
      expect(queryByText('Actions')).not.toBeInTheDocument();
      expect(queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <KeyContactTable
              smes={keyContactsMockData}
              isAssessmentTeam={false}
              isSearching={false}
            />
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { getByText, asFragment } = setup(
      <MockedProvider mocks={keyContactsMock}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText('Subject area')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
