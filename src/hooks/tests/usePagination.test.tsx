import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import usePagination from '../usePagination';

const TestComponent = ({ items, itemsPerPage }: any) => {
  const { currentItems, Pagination } = usePagination({
    items,
    itemsPerPage,
    loading: false
  });

  return (
    <div>
      <ul>
        {currentItems.map((item, index) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {Pagination}
    </div>
  );
};

describe('usePagination', () => {
  const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

  it('initializes with correct state', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <TestComponent items={items} itemsPerPage={3} />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('updates current items when page changes', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <TestComponent items={items} itemsPerPage={3} />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(<RouterProvider router={router} />);

    fireEvent.click(screen.getByText('Next')); // Assuming the Pagination component has a "Next" button

    expect(screen.getByText('Item 4')).toBeInTheDocument();
    expect(screen.getByText('Item 5')).toBeInTheDocument();
    expect(screen.getByText('Item 6')).toBeInTheDocument();
  });

  it('resets to first page when items change', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <TestComponent items={items} itemsPerPage={3} />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    const { rerender } = render(<RouterProvider router={router} />);

    fireEvent.click(screen.getByText('Next')); // Assuming the Pagination component has a "Next" button

    expect(screen.getByText('Item 4')).toBeInTheDocument();
    expect(screen.getByText('Item 5')).toBeInTheDocument();
    expect(screen.getByText('Item 6')).toBeInTheDocument();

    const newItems = Array.from({ length: 5 }, (_, i) => `New Item ${i + 1}`);
    const newRouter = createMemoryRouter(
      [
        {
          path: '/',
          element: <TestComponent items={newItems} itemsPerPage={3} />
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    rerender(<RouterProvider router={newRouter} />);

    expect(screen.getByText('New Item 1')).toBeInTheDocument();
    expect(screen.getByText('New Item 2')).toBeInTheDocument();
    expect(screen.getByText('New Item 3')).toBeInTheDocument();
  });
});
