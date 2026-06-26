import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { screen, waitFor } from '@testing-library/react';
import { SearchOktaUsersDocument } from 'gql/generated/graphql';
import setup from 'tests/util';

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
    const { user, asFragment, getByRole, findByText } = setup(
      <MockedProvider mocks={[oktaUsersQuery]} addTypename={false}>
        <OktaUserSelect
          id="cedarContactSelect"
          name="cedarContactSelect"
          onChange={() => null}
        />
      </MockedProvider>
    );

    // Type first name into select field input
    const input = getByRole('combobox');
    await user.type(input, 'Adeline');

    // Get mocked Okta result
    const userOption = await findByText(
      'Adeline Aarons (adeline.aarons@local.fake)'
    );
    expect(userOption).toBeInTheDocument();

    // Check that component matches snapshot with expanded dropdown
    expect(asFragment()).toMatchSnapshot();

    // Select option
    await user.click(userOption);

    // Check that select field displays correct value
    expect(input).toHaveValue('Adeline Aarons (adeline.aarons@local.fake)');
  });

  it('does not show no results when a user is pre-selected', async () => {
    setup(
      <MockedProvider mocks={[]}>
        <OktaUserSelect
          id="cedarContactSelect"
          name="cedarContactSelect"
          value={{
            username: 'MWIN',
            displayName: 'Mace Windu',
            email: 'mace.windu@cms.hhs.gov'
          }}
          onChange={() => null}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveValue(
        'Mace Windu (mace.windu@cms.hhs.gov)'
      );
    });

    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });
});
