import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { mount, shallow } from 'enzyme';

import { Header } from './index';

vi.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getUser: async () => ({
          name: 'John Doe'
        }),
        logout: async () => {}
      }
    };
  }
}));

describe('The Header component', () => {
  it('renders without crashing', () => {
    shallow(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );
  });

  describe('When logged in', () => {
    it('displays a login button', async () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/pre-decisional-notice']}>
          <Header />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(getByTestId('signout-link')).toHaveTextContent('Sign Out');
      });
    });

    xit('displays the users name', async done => {
      let component: any;
      await act(async () => {
        component = mount(
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
      });
      setImmediate(() => {
        component.update();
        expect(component.text().includes('John Doe')).toBe(true);
        done();
      });
    });
  });

  xit('displays children', () => {
    const component = shallow(
      <Header>
        <div className="test-class-name" />
      </Header>
    );
    expect(component.find('.test-class-name').exists()).toBe(true);
  });
});
