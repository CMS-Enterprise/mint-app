import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { helpSolutions } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import { SolutionCard } from '.';

describe('MTO SolutionCard Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment, getByText } = render(
      <MockedProvider mocks={[...possibleSolutionsMock]} addTypename={false}>
        <MemoryRouter>
          <MessageProvider>
            <SolutionCard solution={helpSolutions[0]} />
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    // Check if the component renders prop data
    expect(getByText('IT System')).toBeInTheDocument();
    expect(getByText('4innovation')).toBeInTheDocument();
    expect(getByText('4i')).toBeInTheDocument();

    // Match the snapshot
    expect(asFragment()).toMatchSnapshot();
  });
});
