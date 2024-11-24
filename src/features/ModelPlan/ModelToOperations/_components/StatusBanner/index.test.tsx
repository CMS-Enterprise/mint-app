import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { MtoStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import MTOStatusBanner from './index';

describe('MTOStatusBanner Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <MTOStatusBanner
              status={MtoStatus.IN_PROGRESS}
              lastUpdated="2022-01-01"
            />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with status READY', () => {
    const { queryByText } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <MTOStatusBanner
              status={MtoStatus.READY}
              lastUpdated="2022-01-01"
            />{' '}
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(
      queryByText(i18next.t('modelToOperationsMisc:isMTOReady'))
    ).not.toBeInTheDocument();
  });

  it('renders correctly with status IN_PROGRESS', () => {
    const { getByText } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <MTOStatusBanner
              status={MtoStatus.IN_PROGRESS}
              lastUpdated="2022-01-01"
            />{' '}
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(
      getByText(i18next.t('modelToOperationsMisc:isMTOReady'))
    ).toBeInTheDocument();
  });

  it('renders correctly with status other than READY or IN_PROGRESS', () => {
    const { getByText } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <MTOStatusBanner
              status={MtoStatus.READY_FOR_REVIEW}
              lastUpdated="2022-01-01"
            />{' '}
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(
      getByText(i18next.t('modelToOperationsMisc:isMTOInProgress'))
    ).toBeInTheDocument();
  });
});
