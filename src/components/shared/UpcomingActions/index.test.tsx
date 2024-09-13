import React from 'react';
import { render, screen } from '@testing-library/react';

import UpcomingActions from './index';

describe('The Action Banner component', () => {
  it('renders without crashing', () => {
    render(
      <UpcomingActions timestamp="12/31/19 at 02:45am">
        <div />
      </UpcomingActions>
    );
    expect(screen.getByText('Upcoming Actions')).toBeInTheDocument();
  });

  it('renders header', () => {
    render(
      <UpcomingActions timestamp="12/31/19 at 02:45am">
        <div />
      </UpcomingActions>
    );
    expect(screen.getByText('Upcoming Actions')).toBeInTheDocument();
    expect(screen.getByText('as of 12/31/19 at 02:45am')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <UpcomingActions timestamp="12/31/19 at 02:45am">
        <button type="button">Thing</button>
        <div className="Test">blah</div>
        <div className="Test">foobar</div>
      </UpcomingActions>
    );
    expect(screen.getByRole('button', { name: 'Thing' })).toBeInTheDocument();
    expect(screen.getByText('blah')).toBeInTheDocument();
    expect(screen.getByText('foobar')).toBeInTheDocument();
  });
});
