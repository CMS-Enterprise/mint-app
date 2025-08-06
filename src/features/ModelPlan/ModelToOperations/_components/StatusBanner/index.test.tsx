import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { MtoStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import MTOStatusBanner from './index';

describe('MTOStatusBanner Component', () => {
  it('renders correctly and matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MTOStatusBanner
              status={MtoStatus.IN_PROGRESS}
              lastUpdated="2022-01-01"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
        ]
      }
    );

    const { asFragment } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with status READY', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MTOStatusBanner
              status={MtoStatus.READY}
              lastUpdated="2022-01-01"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
        ]
      }
    );

    const { queryByText } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(
      queryByText(i18next.t('modelToOperationsMisc:isMTOReady'))
    ).not.toBeInTheDocument();
  });

  it('renders correctly with status IN_PROGRESS', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MTOStatusBanner
              status={MtoStatus.IN_PROGRESS}
              lastUpdated="2022-01-01"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
        ]
      }
    );

    const { getByText } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(
      getByText(i18next.t('modelToOperationsMisc:isMTOReady'))
    ).toBeInTheDocument();
  });

  it('renders correctly with status other than READY or IN_PROGRESS', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/collaboration-area/model-to-operations/matrix',
          element: (
            <MTOStatusBanner
              status={MtoStatus.READY_FOR_REVIEW}
              lastUpdated="2022-01-01"
            />
          )
        }
      ],
      {
        initialEntries: [
          '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
        ]
      }
    );

    const { getByText } = render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(
      getByText(i18next.t('modelToOperationsMisc:isMTOInProgress'))
    ).toBeInTheDocument();
  });
});
