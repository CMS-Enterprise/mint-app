import React from 'react';
import { render } from '@testing-library/react';
import { TeamRole } from 'gql/gen/graphql';

import { Avatar, AvatarCircle } from './index';

describe('The Avatar Circle component', () => {
  it('renders Basic variant', () => {
    const { getByText, getByTestId } = render(
      <AvatarCircle user="Steve Rogers" />
    );

    expect(getByText('SR')).toBeInTheDocument();
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
  it('renders without errors', () => {
    const { getByText } = render(
      <Avatar user="Steve Rogers" teamRoles={[TeamRole.MODEL_LEAD]} />
    );

    expect(getByText('SR')).toBeInTheDocument();
    expect(getByText('Steve Rogers')).toBeInTheDocument();
    expect(getByText('Model Lead')).toBeInTheDocument();
  });

  it('renders Assessment variant', () => {
    const { getByText, getByTestId } = render(
      <Avatar
        user="Steve Rogers"
        teamRoles={[TeamRole.MODEL_LEAD]}
        isAssessment
      />
    );

    expect(getByTestId('avatar--assessment')).toBeInTheDocument();
    expect(getByText('Mint Team', { exact: false })).toBeInTheDocument();
    expect(getByText('Model Lead')).toBeInTheDocument();
  });
});
