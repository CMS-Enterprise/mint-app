import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { keyContactsMock } from 'tests/mock/general';

import MessageProvider from 'contexts/MessageContext';

import { KeyContactType } from '../SmeModal';

import RemoveModal from '.';

const sme: KeyContactType = {
  __typename: 'KeyContact',
  id: '123',
  name: 'Aliza Kim',
  email: 'aliza.kim@cms.hhs.gov',
  mailboxTitle: '',
  mailboxAddress: '',
  subjectArea: 'Healthcare',
  subjectCategoryID: '',
  userAccount: {
    __typename: 'UserAccount',
    id: '123',
    commonName: 'Aliza Kim',
    email: 'aliza.kim@cms.hhs.gov',
    username: 'AWER'
  }
};

const mocks = [...keyContactsMock];

describe('RemoveModal Component', () => {
  it('should render sme context when given key contact', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <MessageProvider>
              <RemoveModal
                isModalOpen
                closeModal={() => {}}
                removedObject={sme}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(
      getByText('Are you sure you want to remove this SME?')
    ).toBeInTheDocument();
    expect(getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(getByText('SME to be removed:')).toBeInTheDocument();
    expect(getByText('Aliza Kim')).toBeInTheDocument();
    expect(
      queryByText('Are you sure you want to remove this subject category?')
    ).not.toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/help-and-knowledge',
          element: (
            <MessageProvider>
              <RemoveModal
                isModalOpen
                closeModal={() => {}}
                removedObject={sme}
              />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: ['/help-and-knowledge']
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
