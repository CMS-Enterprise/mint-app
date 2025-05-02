import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { MtoStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import MTOReadyForReview from '.';

describe('MTO Ready for review', () => {
  const mockCloseModal = vi.fn();

  // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
  // eslint-disable-next-line
  console.error = vi.fn();

  it('rendered correct in progress text', () => {
    const { getByText } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <MTOReadyForReview
              isOpen
              closeModal={mockCloseModal}
              status={MtoStatus.IN_PROGRESS}
            />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(
      getByText(
        i18next.t('modelToOperationsMisc:readyForReview.headingInReview')
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        i18next.t('modelToOperationsMisc:readyForReview.descriptionReady')
      )
    ).toBeInTheDocument();
    expect(
      getByText(i18next.t('modelToOperationsMisc:readyForReview.markAsReady'))
    ).toBeInTheDocument();
  });

  it('rendered correct ready for review text', () => {
    const { getByText } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/0272ca43-1ec1-45a6-a06f-8e2def7f6888/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <MTOReadyForReview
              isOpen
              closeModal={mockCloseModal}
              status={MtoStatus.READY_FOR_REVIEW}
            />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(
      getByText(
        i18next.t('modelToOperationsMisc:readyForReview.headingInProgress')
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        i18next.t('modelToOperationsMisc:readyForReview.descriptionInProgress')
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        i18next.t('modelToOperationsMisc:readyForReview.markAsInProgress')
      )
    ).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/00000000-0000-0000-0000-000000000005/collaboration-area/model-to-operations/matrix?view=milestones'
          ]}
        >
          <Route path="/models/:modelID/collaboration-area/model-to-operations/matrix">
            <MTOReadyForReview
              isOpen
              closeModal={mockCloseModal}
              status={MtoStatus.IN_PROGRESS}
            />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
