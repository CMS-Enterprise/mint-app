import React from 'react';
import { render } from '@testing-library/react';
import { OpSolutionStatus } from 'gql/gen/graphql';

import OperationalNeedsStatusTag from '.';

describe('Operational Solutions HelpBox', () => {
  it('rendered status tag text', async () => {
    const { getByTestId } = render(
      <OperationalNeedsStatusTag status={OpSolutionStatus.COMPLETED} />
    );
    expect(getByTestId('tag')).toHaveTextContent('Completed');
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <OperationalNeedsStatusTag status={OpSolutionStatus.COMPLETED} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
