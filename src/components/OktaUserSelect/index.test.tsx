import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { SearchOktaUsersDocument } from 'gql/generated/graphql';
import setup from 'tests/setup';

import OktaUserSelect from './index';

describe('OktaUserSelect', () => {
  // Cedar contacts query mock
  const oktaUsersQuery = {
    request: {
      query: SearchOktaUsersDocument,
      variables: {
        searchTerm: 'Adeline'
      }
    },
    result: {
      data: {
        searchOktaUsers: [
          {
            displayName: 'Adeline Aarons',
            username: 'ABCD',
            email: 'adeline.aarons@local.fake'
          }
        ]
      }
    }
  };

  it('selects contact from dropdown', async () => {
    const { user, asFragment, getByTestId, findByText } = setup(
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
    await user.type(input, 'Adeline');

    // Get mocked Okta result
    const userOption = await findByText('Adeline Aarons, ABCD');
    expect(userOption).toBeInTheDocument();

    // Check that component matches snapshot with expanded dropdown
    expect(asFragment()).toMatchSnapshot();

    // Select option
    await user.click(userOption);

    // Check that select field displays correct value
    expect(input).toHaveValue('Adeline Aarons, ABCD');
  });
});
