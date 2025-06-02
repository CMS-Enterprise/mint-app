import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ModelStatus } from 'gql/generated/graphql';

import ReadViewStatusBanner from './index';

describe('ReadViewStatusBanner', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Route>
          <ReadViewStatusBanner
            modelID="123"
            status={ModelStatus.PLAN_DRAFT}
            hasEditAccess
            modifiedDts="2024-05-01T12:00:00Z"
            createdDts="2024-04-01T12:00:00Z"
            changeHistoryLink
            className="test-class"
          />
        </Route>
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders without edit access and without change history link', () => {
    render(
      <MemoryRouter>
        <Route>
          {' '}
          <ReadViewStatusBanner
            modelID="123"
            status={ModelStatus.PLAN_DRAFT}
            hasEditAccess={false}
            modifiedDts={null}
            createdDts="2024-04-01T12:00:00Z"
            changeHistoryLink={false}
          />
        </Route>
      </MemoryRouter>
    );

    expect(
      screen.queryByRole('link', { name: /Edit model information/i })
    ).not.toBeInTheDocument();
  });
});
