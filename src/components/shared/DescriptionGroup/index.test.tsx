import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from './index';

describe('The Description List component', () => {
  it('renders without crashing', () => {
    render(
      <DescriptionList title="">
        <dt>Name</dt>
        <dd>MINT</dd>
      </DescriptionList>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('MINT')).toBeInTheDocument();
  });

  it('has the correct title for the list', () => {
    render(
      <DescriptionList title="Test Title">
        <dt>Name</dt>
        <dd>MINT</dd>
      </DescriptionList>
    );
    expect(screen.getByRole('list').getAttribute('title')).toEqual(
      'Test Title'
    );
  });

  it('renders children', () => {
    render(
      <DescriptionList title="Test Title">
        <dt>Name</dt>
        <dd>MINT</dd>
      </DescriptionList>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('MINT')).toBeInTheDocument();
  });
});

describe('The Description Term component', () => {
  it('renders without crashing', () => {
    render(<DescriptionTerm term="" />);
    expect(screen.getByRole('term')).toBeInTheDocument();
  });

  it('renders the term', () => {
    render(<DescriptionTerm term="Test Term" />);
    expect(screen.getByRole('term')).toHaveTextContent('Test Term');
  });
});

describe('The Description Definition component', () => {
  it('renders without crashing', () => {
    render(<DescriptionDefinition definition="" />);
    expect(screen.getByRole('definition')).toBeInTheDocument();
  });

  it('renders the definition', () => {
    render(<DescriptionDefinition definition="Test Definition" />);
    expect(screen.getByRole('definition')).toHaveTextContent('Test Definition');
  });
});
