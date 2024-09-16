import React from 'react';
import { render, screen } from '@testing-library/react';

import MainContent from './index';

describe('MainContent component', () => {
  it('renders without crashing', () => {
    render(
      <MainContent>
        <div />
      </MainContent>
    );
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders custom class names', () => {
    render(
      <MainContent className="test-class">
        <div />
      </MainContent>
    );
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('mint-main-content test-class');
  });

  it('renders children', () => {
    render(
      <MainContent>
        <div data-testid="test-child" />
      </MainContent>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('applies data-testid attribute', () => {
    render(
      <MainContent data-testid="main-content">
        <div />
      </MainContent>
    );
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });
});
