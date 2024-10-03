import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { GetEchimpCrandTdlDocument } from 'gql/generated/graphql';

// import MessageProvider from 'contexts/MessageContext';
import CRTDLs from '.';

const modelID = 'f11eb129-2c80-4080-9440-439cbe1a286f';

const mocks = [
  {
    request: {
      query: GetEchimpCrandTdlDocument,
      variables: { id: modelID }
    },
    result: {
      data: {
        modelPlan: {
          echimpCRsAndTDLs: [
            {
              __typename: 'EChimpCR',
              id: '123',
              title: 'Echimp CR',
              emergencyCrFlag: false,
              sensitiveFlag: false,
              crStatus: 'Open',
              implementationDate: '2022-07-30T05:00:00Z'
            },
            {
              __typename: 'EChimpTDL',
              id: '456',
              title: 'Echimp TDL',
              issuedDate: '2022-07-30T05:00:00Z'
            }
          ]
        }
      }
    }
  }
];

describe('Model Plan CR and TDL page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/collaboration-area/cr-and-tdl`]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <CRTDLs />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
