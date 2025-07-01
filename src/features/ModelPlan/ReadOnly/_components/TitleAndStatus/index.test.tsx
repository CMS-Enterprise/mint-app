import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { TaskStatus } from 'gql/generated/graphql';
import i18next from 'i18next';

import TitleAndStatus from './index';

describe('Title and Status component for Read Only Pages', () => {
  it('renders without crashing', async () => {
    render(
      <MemoryRouter>
        <TitleAndStatus
          clearance={false}
          clearanceTitle="Clearance"
          heading="Regular Heading"
          isViewingFilteredView={false}
          status={TaskStatus.IN_PROGRESS}
          modelID="123"
          modifiedOrCreatedDts="2021-09-01T00:00:00Z"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Regular Heading')).toBeInTheDocument();
      expect(screen.getByText('In progress')).toBeInTheDocument();
    });
  });

  it('renders Clearance heading', async () => {
    render(
      <MemoryRouter>
        <TitleAndStatus
          clearance
          clearanceTitle="Clearance"
          heading="Regular Heading"
          isViewingFilteredView={false}
          status={TaskStatus.IN_PROGRESS}
          modelID="123"
          modifiedOrCreatedDts="2021-09-01T00:00:00Z"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Clearance')).toBeInTheDocument();
      expect(screen.getByText('In progress')).toBeInTheDocument();
    });
  });

  it('renders the correct status', async () => {
    render(
      <MemoryRouter>
        <TitleAndStatus
          clearance
          clearanceTitle="Clearance"
          heading="Regular Heading"
          isViewingFilteredView={false}
          status={TaskStatus.READY_FOR_CLEARANCE}
          modelID="123"
          modifiedOrCreatedDts="2021-09-01T00:00:00Z"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Clearance')).toBeInTheDocument();
      expect(screen.getByText('Ready for clearance')).toBeInTheDocument();
    });
  });

  it('does not render status for Filtered View groups', () => {
    render(
      <MemoryRouter>
        <TitleAndStatus
          clearance
          clearanceTitle="Clearance"
          heading="Regular Heading"
          isViewingFilteredView
          status={TaskStatus.READY_FOR_CLEARANCE}
          modelID="123"
          modifiedOrCreatedDts="2021-09-01T00:00:00Z"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Clearance')).toBeInTheDocument();
    expect(screen.queryByTestId('tasklist-tag')).not.toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TitleAndStatus
          clearance={false}
          clearanceTitle="Clearance"
          heading="Regular Heading"
          isViewingFilteredView={false}
          status={TaskStatus.IN_PROGRESS}
          modelID="123"
          modifiedOrCreatedDts="2021-09-01T00:00:00Z"
        />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Regular Heading')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders editDates UI when editDates is true', () => {
    render(
      <MemoryRouter>
        <TitleAndStatus
          clearance={false}
          clearanceTitle="Clearance"
          heading="Regular Heading"
          isViewingFilteredView={false}
          status={TaskStatus.IN_PROGRESS}
          modelID="123"
          modifiedOrCreatedDts="2021-09-01T00:00:00Z"
          editDates
        />
      </MemoryRouter>
    );
    // Should render the edit icon
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    // Should render the edit dates link
    expect(screen.getByTestId('edit-dates-link')).toBeInTheDocument();
    // Should render the correct link href
    expect(screen.getByTestId('edit-dates-link')).toHaveAttribute(
      'href',
      '/models/123/collaboration-area/model-timeline'
    );
    // Should render the correct link text
    expect(screen.getByTestId('edit-dates-link')).toHaveTextContent(
      i18next.t('timelineMisc:editDates')
    );
  });

  it('does not render editDates UI when editDates is false', () => {
    render(
      <MemoryRouter>
        <TitleAndStatus
          clearance={false}
          clearanceTitle="Clearance"
          heading="Regular Heading"
          isViewingFilteredView={false}
          status={TaskStatus.IN_PROGRESS}
          modelID="123"
          modifiedOrCreatedDts="2021-09-01T00:00:00Z"
        />
      </MemoryRouter>
    );
    expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-dates-link')).not.toBeInTheDocument();
  });
});
