import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { FilterType } from '../FilterForm';
import { TypeOfChange } from '../FilterForm/filterUtil';

import FilterTags from './index';

// Mock utils/date
vi.mock('utils/date', () => ({
  formatDateLocal: vi.fn((date: string) => {
    // Simple mock that returns formatted date
    return new Date(date).toLocaleDateString('en-US');
  })
}));

describe('FilterTags', () => {
  const mockSetFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultFilters: FilterType = {
    users: [],
    typeOfChange: [],
    startDate: '',
    endDate: ''
  };

  it('renders without crashing', () => {
    render(<FilterTags filters={defaultFilters} setFilters={mockSetFilters} />);
    expect(screen.getByText('Filters (0)')).toBeInTheDocument();
  });

  it('displays filter count correctly', () => {
    const filters: FilterType = {
      users: ['John Doe', 'Jane Smith'],
      typeOfChange: [TypeOfChange.BASICS, TypeOfChange.MODEL_TIMELINE],
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);
    expect(screen.getByText('Filters (6)')).toBeInTheDocument();
  });

  it('renders user tags correctly', () => {
    const filters: FilterType = {
      users: ['John Doe', 'Jane Smith'],
      typeOfChange: [],
      startDate: '',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders type of change tags correctly', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [TypeOfChange.BASICS, TypeOfChange.MODEL_TIMELINE],
      startDate: '',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    expect(screen.getByText('Model basics')).toBeInTheDocument();
    expect(screen.getByText('Model timeline')).toBeInTheDocument();
  });

  it('renders start date tag correctly', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    expect(screen.getByText('Start date:')).toBeInTheDocument();
  });

  it('renders end date tag correctly', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '',
      endDate: '2024-01-31T23:59:59.999Z'
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    expect(screen.getByText('End date:')).toBeInTheDocument();
  });

  it('does not render start date tag when startDate is empty', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '',
      endDate: '2024-01-31T23:59:59.999Z'
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    expect(screen.queryByText('Start date:')).not.toBeInTheDocument();
  });

  it('does not render end date tag when endDate is empty', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    expect(screen.queryByText('End date:')).not.toBeInTheDocument();
  });

  it('filters out ALL_MODEL_PLAN_SECTIONS from type of change tags', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [TypeOfChange.ALL_MODEL_PLAN_SECTIONS, TypeOfChange.BASICS],
      startDate: '',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    // Should only show the BASICS tag, not ALL_MODEL_PLAN_SECTIONS
    const typeTags = screen.getAllByText('Type:');
    expect(typeTags).toHaveLength(1);
  });

  it('handles user tag removal correctly', () => {
    const filters: FilterType = {
      users: ['John Doe', 'Jane Smith'],
      typeOfChange: [],
      startDate: '',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const closeIcons = screen.getAllByTestId('close-icon-John Doe');
    fireEvent.click(closeIcons[0]); // Click first close icon (John Doe)

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      users: ['Jane Smith']
    });
  });

  it('handles type of change tag removal correctly', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [TypeOfChange.BASICS, TypeOfChange.MODEL_TIMELINE],
      startDate: '',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const closeIcons = screen.getAllByTestId('close-icon-plan_basics');
    fireEvent.click(closeIcons[0]); // Click first close icon (BASICS)

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      typeOfChange: [TypeOfChange.MODEL_TIMELINE]
    });
  });

  it('removes ALL_MODEL_PLAN_SECTIONS when removing other type of change', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [TypeOfChange.ALL_MODEL_PLAN_SECTIONS, TypeOfChange.BASICS],
      startDate: '',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const closeIcons = screen.getAllByTestId('close-icon-plan_basics');
    fireEvent.click(closeIcons[0]); // Click close icon for BASICS

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      typeOfChange: [] // Both ALL_MODEL_PLAN_SECTIONS and BASICS should be removed
    });
  });

  it('handles start date tag removal correctly', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const closeIcons = screen.getAllByTestId(
      'close-icon-2024-01-01T00:00:00.000Z'
    );
    fireEvent.click(closeIcons[0]); // Click close icon for start date

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      startDate: ''
    });
  });

  it('handles end date tag removal correctly', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '',
      endDate: '2024-01-31T23:59:59.999Z'
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const closeIcons = screen.getAllByTestId(
      'close-icon-2024-01-31T23:59:59.999Z'
    );
    fireEvent.click(closeIcons[0]); // Click close icon for end date

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      endDate: ''
    });
  });

  it('handles start date tag removal via keyboard Enter key', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const startDateTag = screen
      .getByText('Start date:')
      .closest('[data-testid="tag"]');
    fireEvent.keyDown(startDateTag!, { key: 'Enter' });

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      startDate: ''
    });
  });

  it('handles end date tag removal via keyboard Enter key', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '',
      endDate: '2024-01-31T23:59:59.999Z'
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const endDateTag = screen
      .getByText('End date:')
      .closest('[data-testid="tag"]');
    fireEvent.keyDown(endDateTag!, { key: 'Enter' });

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      endDate: ''
    });
  });

  it('does not handle other keyboard keys for date tags', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const startDateTag = screen
      .getByText('Start date:')
      .closest('[data-testid="tag"]');
    fireEvent.keyDown(startDateTag!, { key: 'Space' });

    expect(mockSetFilters).not.toHaveBeenCalled();
  });

  it('handles clear all button click correctly', () => {
    const filters: FilterType = {
      users: ['John Doe'],
      typeOfChange: [TypeOfChange.BASICS],
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-31T23:59:59.999Z'
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const clearAllButton = screen.getByText('Clear all');
    fireEvent.click(clearAllButton);

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      users: [],
      typeOfChange: [],
      startDate: '',
      endDate: ''
    });
  });

  it('renders all tag types together correctly', () => {
    const filters: FilterType = {
      users: ['John Doe'],
      typeOfChange: [TypeOfChange.BASICS],
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-01-31T23:59:59.999Z'
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    expect(screen.getByText('User:')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Start date:')).toBeInTheDocument();
    expect(screen.getByText('End date:')).toBeInTheDocument();
    expect(screen.getByText('Filters (4)')).toBeInTheDocument();
  });

  it('handles type of change tag click removal', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [TypeOfChange.BASICS],
      startDate: '',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const typeTag = screen.getByText('Type:').closest('[data-testid="tag"]');
    fireEvent.click(typeTag!);

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      typeOfChange: []
    });
  });

  it('handles start date tag click removal', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: ''
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const startDateTag = screen
      .getByText('Start date:')
      .closest('[data-testid="tag"]');
    fireEvent.click(startDateTag!);

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      startDate: ''
    });
  });

  it('handles end date tag click removal', () => {
    const filters: FilterType = {
      users: [],
      typeOfChange: [],
      startDate: '',
      endDate: '2024-01-31T23:59:59.999Z'
    };

    render(<FilterTags filters={filters} setFilters={mockSetFilters} />);

    const endDateTag = screen
      .getByText('End date:')
      .closest('[data-testid="tag"]');
    fireEvent.click(endDateTag!);

    expect(mockSetFilters).toHaveBeenCalledWith({
      ...filters,
      endDate: ''
    });
  });
});
