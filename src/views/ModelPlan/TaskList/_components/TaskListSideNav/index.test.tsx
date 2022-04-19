import React from 'react';
import { Button } from '@trussworks/react-uswds';
import { shallow } from 'enzyme';

import Modal from 'components/Modal';

import TaskListSideNav from './index';

const renderComponent = () => {
  return shallow(<TaskListSideNav />);
};

describe('The TaskListSideNavActions', () => {
  it('renders without crashing', () => {
    expect(renderComponent).not.toThrow();
  });

  describe('save and exit', () => {
    it('displays text', () => {
      const component = renderComponent();
      expect(
        component.find('UswdsReactLink').at(0).dive().prop('children')
      ).toEqual('Save & Exit');
    });

    it('goes to home', () => {
      const component = renderComponent();
      expect(component.find('UswdsReactLink').at(0).prop('to')).toEqual('/');
    });
  });

  describe('remove your Model Plan', () => {
    it('displays text', () => {
      const component = renderComponent();
      expect(component.find('.test-withdraw-request').dive().text()).toEqual(
        'Remove your Model Plan'
      );
    });
    it('has a closed modal by default', () => {
      const component = renderComponent();
      expect(component.find(Modal).prop('isOpen')).toEqual(false);
    });
    it('opens a modal', () => {
      const component = renderComponent();
      component.find('.test-withdraw-request').simulate('click');
      expect(component.find(Modal).prop('isOpen')).toEqual(true);
    });
    it('has 2 buttons in the modal', () => {
      const component = renderComponent();
      component.find('.test-withdraw-request').simulate('click');
      expect(component.find(Modal).find(Button).length).toEqual(2);
    });
  });

  describe('Related Content', () => {
    it('displays h4', () => {
      const component = renderComponent();
      expect(component.find('h4').text()).toEqual('Related Content');
    });

    describe('overview for adding a system', () => {
      it('displays translation prop key', () => {
        const component = renderComponent();
        expect(component.find('Trans').prop('i18nKey')).toContain(
          'modelPlanTaskList:sideNav.overview'
        );
      });

      it('goes to home for now', () => {
        const component = renderComponent();
        expect(component.find('UswdsReactLink').at(1).prop('to')).toEqual('/');
      });

      it('opens in a new tab', () => {
        const component = renderComponent();
        expect(component.find('UswdsReactLink').at(1).prop('target')).toEqual(
          '_blank'
        );
      });
    });
  });
});
