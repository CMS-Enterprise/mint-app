import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchOktaUsers from 'queries/SearchOktaUsers';

import OktaUserSelect from './index';

describe('OktaUserSelect', () => {
  // Cedar contacts query mock
  const oktaUsersQuery = {
    request: {
      query: SearchOktaUsers,
      variables: {
        searchTerm: 'Adeline'
      }
    },
    result: {
      data: {
        searchOktaUsers: [
          {
            displayName: 'Adeline Aarons',
            username: 'ABCD'
          }
        ]
      }
    }
  };

  it('selects contact from dropdown', async () => {
    const { asFragment, getByTestId, findByText } = render(
      <MockedProvider mocks={[oktaUsersQuery]} addTypename={false}>
        <OktaUserSelect
          id="cedarContactSelect"
          name="cedarContactSelect"
          onChange={() => null}
        />
      </MockedProvider>
    );

    // Type first name into select field input
    const input = getByTestId('cedar-contact-select');
    userEvent.type(input, 'Adeline');

    // Get mocked Okta result
    const userOption = await findByText('Adeline Aarons, ABCD');
    expect(userOption).toBeInTheDocument();

    // Check that component matches snapshot with expanded dropdown
    expect(asFragment()).toMatchSnapshot();

    // Select option
    userEvent.click(userOption);

    // Check that select field displays correct value
    expect(input).toHaveValue('Adeline Aarons, ABCD');
  });
});
