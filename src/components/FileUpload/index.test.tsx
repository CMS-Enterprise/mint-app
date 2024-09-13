import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import FileUpload from './index';

describe('File Upload component', () => {
  it('renders without errors', () => {
    render(
      <FileUpload
        id="test-file-upload"
        name="test-file-upload"
        accept=".pdf"
        onChange={() => {}}
        onBlur={() => {}}
        ariaDescribedBy=""
        inputProps={<input />}
      />
    );

    expect(screen.getByTestId('file-upload-wrapper')).toBeInTheDocument();
  });

  it('is disabled', () => {
    render(
      <FileUpload
        id="test-file-upload"
        name="test-file-upload"
        accept=".pdf"
        onChange={() => {}}
        onBlur={() => {}}
        ariaDescribedBy=""
        disabled
        inputProps={<input />}
      />
    );

    const wrapper = screen.getByTestId('file-upload-wrapper');
    const input = screen.getByTestId('file-upload-input');

    expect(wrapper).toHaveClass('usa-file-input--disabled');
    expect(wrapper).toHaveAttribute('aria-disabled', 'true');
    expect(input).toBeDisabled();
  });

  describe('successfully upload file', () => {
    it('calls onChange when a file is uploaded', async () => {
      const handleChange = vi.fn();

      render(
        <FileUpload
          id="test-file-upload"
          name="test-file-upload"
          accept=".pdf"
          onChange={handleChange}
          onBlur={() => {}}
          ariaDescribedBy=""
          inputProps={{}}
        />
      );

      const input = screen.getByTestId('file-upload-input');

      const file = new File(['dummy content'], 'example.pdf', {
        type: 'application/pdf'
      });

      fireEvent.change(input, { target: { files: [file] } });

      expect(handleChange).toHaveBeenCalled();
    });
  });
});
