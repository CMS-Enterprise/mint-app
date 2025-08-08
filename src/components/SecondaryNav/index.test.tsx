import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { NavLink, SecondaryNav } from './index';

describe('The Secondary Nav component', () => {
  it('renders without crashing', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <SecondaryNav>
              <NavLink to="/">Test</NavLink>
            </SecondaryNav>
          )
        }
      ],
      {
        initialEntries: ['/']
      }
    );

    render(<RouterProvider router={router} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
