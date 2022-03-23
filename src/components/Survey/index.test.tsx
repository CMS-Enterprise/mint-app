import React from 'react';
import { shallow } from 'enzyme';

import { AnythingWrongSurvey, ImproveMINTSurvey } from './index';

describe('The Survey component', () => {
  it('renders without crashing', () => {
    shallow(<AnythingWrongSurvey />);
    shallow(<ImproveMINTSurvey />);
  });
});
