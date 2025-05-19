import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MtoStatus } from 'gql/generated/graphql';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';

import MTOCard, { MtoCardProps } from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

const mtoCardMock: MtoCardProps = {
  modelID: '123',
  mtoMatrix: {
    __typename: 'ModelsToOperationMatrix',
    status: MtoStatus.IN_PROGRESS,
    info: {
      __typename: 'MTOInfo',
      id: '123'
    },
    recentEdit: {
      __typename: 'TranslatedAudit',
      id: '1',
      date: '2022-05-12T15:01:39.190679Z',
      actorName: ''
    },
    milestones: [
      {
        __typename: 'MTOMilestone',
        id: '123',
        name: 'milestone 1'
      }
    ]
  }
};

describe('MTO Card', () => {
  it('renders without errors', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <MTOCard {...mtoCardMock} />
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(i18next.t('collaborationArea:mtoCard.body'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        i18next.t('collaborationArea:mtoCard.modelMilestonesAdded', {
          count: 1
        })
      )
    ).toBeInTheDocument();
  });

  it('displays the last modified date and user avatar when modifiedDts and modifiedByUserAccount are provided', () => {
    const modifiedMock = { ...mtoCardMock };
    if (modifiedMock.mtoMatrix.recentEdit) {
      modifiedMock.mtoMatrix.recentEdit.date = '2023-10-01T00:00:00Z';
      modifiedMock.mtoMatrix.recentEdit.actorName = 'John Doe';
    }

    render(
      <MemoryRouter>
        <Provider store={store}>
          <MTOCard {...mtoCardMock} />
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText('Most recent edit on 10/01/2023 by')
    ).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Provider store={store}>
          <MTOCard {...mtoCardMock} />
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(i18next.t('collaborationArea:mtoCard.body'))
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
