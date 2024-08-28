import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { render } from '@testing-library/react';

import routes from 'i18n/en-US/routes';

import useRouteTitle from './useRouteTitle';

// Mock useLocation hook
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn()
}));

// Mock useTranslation hook
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn()
}));

describe('useRouteTitle', () => {
  const mockUseLocation = useLocation as any;
  const mockUseTranslation = useTranslation as any;

  beforeEach(() => {
    mockUseLocation.mockReturnValue({
      pathname: '',
      search: ''
    });

    mockUseTranslation.mockReturnValue({
      t: (key: string) => routes.titles
    });
  });

  const TestComponent = ({ sendGA }: { sendGA: boolean }) => {
    const title = useRouteTitle({ sendGA });
    return <div>{title}</div>;
  };

  const renderComponent = () => {
    const { getByText, rerender } = render(<TestComponent sendGA={false} />);

    // Rerender to update ref, as hook does not use state
    rerender(<TestComponent sendGA={false} />);

    return getByText;
  };

  it('should return the correct title for a solution route', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/solution-implementation-details',
      search: '?solution=solution'
    });

    const getByText = renderComponent();

    expect(
      getByText(
        'Operational solutions and implementation tracker - Solution implementation details'
      )
    ).toBeInTheDocument();
  });

  it('should return the correct title for a category route', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/category',
      search: '?category=data'
    });

    const getByText = renderComponent();

    expect(
      getByText('Help and knowledge center category - Data')
    ).toBeInTheDocument();
  });

  it('should return the correct title for a UUID route', () => {
    mockUseLocation.mockReturnValue({
      pathname:
        '/solution-implementation-details/123e4567-e89b-12d3-a456-426614174000'
    });

    const getByText = renderComponent();

    expect(
      getByText(
        'Operational solutions and implementation tracker - Solution implementation details'
      )
    ).toBeInTheDocument();
  });

  it('should return the correct title for a normal route', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/task-list/basics'
    });

    const getByText = renderComponent();

    expect(getByText('Model basics')).toBeInTheDocument();
  });

  it('should return the pathname if no matching title is found', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/unknown-route'
    });

    const getByText = renderComponent();

    expect(getByText('/unknown-route')).toBeInTheDocument();
  });
});
