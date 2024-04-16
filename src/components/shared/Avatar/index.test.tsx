import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  // Avatar,
  AvatarCircle
} from './index';

describe('The Avatar Circle component', () => {
  it('renders Basic variant', () => {
    const { getByTestId } = render(<AvatarCircle user="Steve Rogers" />);

    expect(screen.getByText('SR')).toBeInTheDocument();
    expect(getByTestId('avatar--basic')).toBeInTheDocument();
  });

  it('renders Assessment Team variant', () => {
    const { getByTestId } = render(
      <AvatarCircle user="Steve Rogers" isAssessment />
    );

    expect(getByTestId('avatar--assessment')).toBeInTheDocument();
  });

  it('renders Mint System Admin variant', () => {
    const { getByTestId } = render(<AvatarCircle user="MINT" />);

    expect(getByTestId('avatar--mint-admin')).toBeInTheDocument();
  });
});

describe('The Avatar component', () => {
  // TODO:
});
