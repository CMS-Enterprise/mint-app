import React from 'react';
import { render } from '@testing-library/react';

import TruncatedText from './index';

const textString =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus sit minima dolor asperiores pariatur deleniti blanditiis sint dolorem, laboriosam corporis labore culpa tenetur est quaerat.<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>';

describe('The TruncatedText component', () => {
  it('truncates text according to character count', () => {
    const { getByText } = render(
      <TruncatedText id="test" text={textString} charLimit={50} />
    );

    expect(getByText('Read more')).toBeInTheDocument();
    expect(getByText(`${textString.substring(0, 50)} ...`)).toBeInTheDocument();
  });

  it('truncates text according to line clamp value', async () => {
    const { getByTestId } = render(
      <TruncatedText id="test" text={textString} lineClamp={2} />
    );

    expect(getByTestId('truncated-text')).toHaveStyle('--line-clamp: 2');
  });

  it('matches charLimit snapshot', () => {
    const { getByText, asFragment } = render(
      <TruncatedText id="test" text={textString} charLimit={50} />
    );
    expect(getByText('Read more')).toBeInTheDocument();
    expect(getByText(`${textString.substring(0, 50)} ...`)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches lineClamp snapshot', async () => {
    const { getByTestId, asFragment } = render(
      <TruncatedText id="test" text={textString} lineClamp={2} />
    );

    expect(getByTestId('truncated-text')).toHaveStyle('--line-clamp: 2');

    expect(asFragment()).toMatchSnapshot();
  });
});
