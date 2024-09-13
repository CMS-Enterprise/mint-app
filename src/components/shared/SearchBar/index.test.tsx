import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import SearchBar from './index';

describe('The Search Bar component', () => {
  it('renders without crashing', () => {
    render(<SearchBar name="test-name" onSearch={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('accepts a name attribute', () => {
    const fixture = 'test-name-attr';
    render(<SearchBar name={fixture} onSearch={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', fixture);
  });

  it('prevents the default action of submitting a form', () => {
    const spy = vi.fn();
    render(<SearchBar name="test-name-attr" onSearch={() => {}} />);
    const searchBtn = screen.getByTestId('search-bar-search-btn');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
    fireEvent.submit(searchBtn, {
      preventDefault: spy
    });
    expect(spy).toHaveBeenCalled();
  });

  describe('The default Search Bar w/o autocomplete', () => {
    it('triggers on onChange action', () => {
      const fixture = vi.fn();
      const event = {
        target: {
          value: 'MINT'
        }
      };

      render(<SearchBar name="test-name-attr" onSearch={fixture} />);
      fireEvent.change(screen.getByRole('textbox'), event);
      expect(fixture).toHaveBeenCalled();
    });
  });

  describe('The Search Bar with autocomplete', () => {
    const onSearch = vi.fn();
    const getSuggestionValue = (obj: any): string => obj.name;
    const renderSuggestion = (obj: any): string => obj.name;

    it('renders react-autocomplete', () => {
      render(
        <SearchBar
          name="test-name-attr"
          onSearch={onSearch}
          results={[]}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
        />
      );
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });
});
