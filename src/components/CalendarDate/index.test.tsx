import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';

import CalendarDate from './index';

describe('CalendarDate', () => {
  it('renders the correct month and day', () => {
    const dateISO = '2023-09-17T12:00:00+01:00';
    const link = '/some-link';
    const linkText = 'Some Link Text';

    render(
      <MemoryRouter>
        <Route path="/">
          <CalendarDate dateISO={dateISO} link={link} linkText={linkText} />
        </Route>
      </MemoryRouter>
    );

    const month = DateTime.fromISO(dateISO).toFormat('MMM');
    const day = DateTime.fromISO(dateISO).toFormat('dd');

    expect(screen.getByText(month)).toBeInTheDocument();
    expect(screen.getByText(day)).toBeInTheDocument();
  });

  it('renders the correct link and link text', () => {
    const dateISO = '2023-09-17T12:00:00+01:00';
    const link = '/some-link';
    const linkText = 'Some Link Text';

    render(
      <MemoryRouter>
        <Route path="/">
          <CalendarDate dateISO={dateISO} link={link} linkText={linkText} />
        </Route>
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', link);
  });

  it('renders correctly with null dateISO', () => {
    const dateISO = null;
    const link = '/some-link';
    const linkText = 'Some Link Text';

    render(
      <MemoryRouter>
        <Route path="/">
          <CalendarDate dateISO={dateISO} link={link} linkText={linkText} />
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByTestId('collection-calendar-date')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument();
  });

  it('renders correctly with undefined dateISO', () => {
    const dateISO = undefined;
    const link = '/some-link';
    const linkText = 'Some Link Text';

    render(
      <MemoryRouter>
        <Route path="/">
          <CalendarDate dateISO={dateISO} link={link} linkText={linkText} />
        </Route>
      </MemoryRouter>
    );

    expect(screen.getByTestId('collection-calendar-date')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument();
  });
});
