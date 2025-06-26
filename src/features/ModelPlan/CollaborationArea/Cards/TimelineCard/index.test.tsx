import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { GetCollaborationAreaQuery, TaskStatus } from 'gql/generated/graphql';

import TimelineCard from './index';

const mockSetStatusMessage = vi.fn();

const baseTimeline: GetCollaborationAreaQuery['modelPlan']['timeline'] = {
  __typename: 'PlanTimeline',
  id: 'timeline-1',
  modifiedDts: '2025-06-24T12:00:00Z',
  modifiedByUserAccount: {
    __typename: 'UserAccount',
    id: '123',
    commonName: 'Jane Doe'
  },
  status: TaskStatus.IN_PROGRESS,
  datesAddedCount: 3,
  upcomingTimelineDate: {
    __typename: 'UpcomingTimelineDate',
    date: '2025-07-01T00:00:00Z',
    dateField: 'announced'
  }
};

describe('TimelineCard', () => {
  it('renders all main elements', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TimelineCard
          modelID="123"
          timeline={baseTimeline}
          setStatusMessage={mockSetStatusMessage}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Model timeline')).toBeInTheDocument();
    expect(screen.getByText('3/9 dates added')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Announce model (07/01/2025)')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render upcoming date if missing', () => {
    const timeline = { ...baseTimeline, upcomingTimelineDate: null };
    render(
      <MemoryRouter>
        <TimelineCard
          modelID="123"
          timeline={timeline}
          setStatusMessage={mockSetStatusMessage}
        />
      </MemoryRouter>
    );
    expect(screen.queryByText(/Upcoming/)).not.toBeInTheDocument();
  });

  it('does not render modified info if missing', () => {
    const timeline = {
      ...baseTimeline,
      modifiedDts: null,
      modifiedByUserAccount: null
    };
    render(
      <MemoryRouter>
        <TimelineCard
          modelID="123"
          timeline={timeline}
          setStatusMessage={mockSetStatusMessage}
        />
      </MemoryRouter>
    );
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });
});
