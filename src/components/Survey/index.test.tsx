import React from 'react';
import { render, screen } from '@testing-library/react';

import { AnythingWrongSurvey, ImproveMINTSurvey } from './index';

describe('The Survey component', () => {
  it('renders AnythingWrongSurvey without crashing', () => {
    render(<AnythingWrongSurvey />);
    expect(screen.getByTestId('anything-wrong-survey')).toBeInTheDocument();
  });

  it('renders ImproveMINTSurvey without crashing', () => {
    render(<ImproveMINTSurvey />);
    expect(screen.getByTestId('improve-mint-survey')).toBeInTheDocument();
  });
});
