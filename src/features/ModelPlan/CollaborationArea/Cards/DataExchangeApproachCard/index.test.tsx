import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { DataExchangeApproachStatus } from 'gql/generated/graphql';
import i18next from 'i18next';
import configureMockStore from 'redux-mock-store';

import { ASSESSMENT } from 'constants/jobCodes';

import DataExchangeApproachCard, { DataExchangeApproachType } from './index';

const mockAuthReducer = {
  isUserSet: true,
  groups: [ASSESSMENT],
  euaId: 'ABCD'
};

const mockStore = configureMockStore();
const store = mockStore({ auth: mockAuthReducer });

const dataExchangeApproachMock: DataExchangeApproachType = {
  __typename: 'PlanDataExchangeApproach',
  id: '123',
  status: DataExchangeApproachStatus.IN_PROGRESS,
  modifiedDts: null,
  modifiedByUserAccount: null
};

describe('DataExchangeApproachCard', () => {
  it('renders without errors', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <DataExchangeApproachCard
            modelID="123"
            dataExhangeApproachData={dataExchangeApproachMock}
          />
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        i18next.t('collaborationArea:dataExchangeApproachCard.body')
      )
    ).toBeInTheDocument();
  });

  it('displays the correct text based on the modifiedDts prop', () => {
    const modifiedMock = { ...dataExchangeApproachMock };
    modifiedMock.modifiedDts = '2023-10-01T00:00:00Z';
    modifiedMock.modifiedByUserAccount = {
      __typename: 'UserAccount',
      id: '123',
      commonName: 'John Doe'
    };

    render(
      <MemoryRouter>
        <Provider store={store}>
          <DataExchangeApproachCard
            modelID="123"
            dataExhangeApproachData={modifiedMock}
          />{' '}
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        i18next.t('collaborationArea:dataExchangeApproachCard.editApproach')
      )
    ).toBeInTheDocument();
  });

  it('displays the last modified date and user avatar when modifiedDts and modifiedByUserAccount are provided', () => {
    const modifiedMock = { ...dataExchangeApproachMock };
    modifiedMock.modifiedDts = '2023-10-01T00:00:00Z';
    modifiedMock.modifiedByUserAccount = {
      __typename: 'UserAccount',
      id: '123',
      commonName: 'John Doe'
    };

    render(
      <MemoryRouter>
        <Provider store={store}>
          <DataExchangeApproachCard
            modelID="123"
            dataExhangeApproachData={modifiedMock}
          />{' '}
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText('Most recent edit on 10/01/2023 by')
    ).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders the correct links', () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <DataExchangeApproachCard
            modelID="123"
            dataExhangeApproachData={dataExchangeApproachMock}
          />{' '}
        </Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByTestId('view-data-exchange-help-article')
    ).toHaveAttribute(
      'href',
      '/help-and-knowledge/evaluating-data-exchange-approach'
    );
  });
});
