import React from 'react';
import { shallow } from 'enzyme';

import TaskListButton from './index';

describe('The Header component', () => {
  it('renders without crashing', () => {
    shallow(<TaskListButton path="path" status="READY" />);
  });

  describe('displays the correct text', () => {
    it('for READY status', () => {
      const status = 'READY';
      const component = shallow(<TaskListButton path="path" status={status} />);

      expect(component.props().children).toEqual('Start');
    });
    it('for IN_PROGRESS status', () => {
      const status = 'IN_PROGRESS';
      const component = shallow(<TaskListButton path="path" status={status} />);

      expect(component.props().children).toEqual('Continue');
    });
    it('for CANNOT_START status', () => {
      const status = 'CANNOT_START';
      const component = shallow(<TaskListButton path="path" status={status} />);

      expect(component.exists('.usa-button')).toEqual(false);
    });
  });
});
