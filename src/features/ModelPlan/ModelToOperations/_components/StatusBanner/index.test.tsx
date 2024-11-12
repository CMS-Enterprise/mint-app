import React from 'react';
import { render } from '@testing-library/react';
import { MtoStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import MTOStatusBanner from './index';

describe('MTOStatusBanner Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <MTOStatusBanner
        status={MtoStatus.IN_PROGRESS}
        lastUpdated="2022-01-01"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with status READY', () => {
    const { queryByText } = render(
      <MTOStatusBanner status={MtoStatus.READY} lastUpdated="2022-01-01" />
    );
    expect(
      queryByText(i18next.t('modelToOperationsMisc:isMTOReady'))
    ).not.toBeInTheDocument();
  });

  it('renders correctly with status IN_PROGRESS', () => {
    const { getByText } = render(
      <MTOStatusBanner
        status={MtoStatus.IN_PROGRESS}
        lastUpdated="2022-01-01"
      />
    );
    expect(
      getByText(i18next.t('modelToOperationsMisc:isMTOReady'))
    ).toBeInTheDocument();
  });

  it('renders correctly with status other than READY or IN_PROGRESS', () => {
    const { getByText } = render(
      <MTOStatusBanner
        status={MtoStatus.READY_FOR_REVIEW}
        lastUpdated="2022-01-01"
      />
    );
    expect(
      getByText(i18next.t('modelToOperationsMisc:isMTOInProgress'))
    ).toBeInTheDocument();
  });
});
