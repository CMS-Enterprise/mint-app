import React from 'react';
import { render } from '@testing-library/react';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Header from './index';

describe('Operation Solution Detail Header', () => {
  it('renders solution name and category', () => {
    const { getByText } = render(<Header solution={helpSolutionsArray[0]} />);

    expect(getByText('4innovation')).toBeInTheDocument();
    expect(
      getByText(
        'Applications and participant interaction (ACO and kidney models)'
      )
    ).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Header solution={helpSolutionsArray[0]} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
