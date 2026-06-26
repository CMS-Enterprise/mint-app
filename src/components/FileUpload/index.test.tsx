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
        inputProps={{}}
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
        inputProps={{}}
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

  describe('controlled multiple files', () => {
    it('renders the multi-file preview from the files prop', () => {
      const fileOne = new File(['one'], 'Draft_DUA.pdf', {
        type: 'application/pdf'
      });
      const fileTwo = new File(['two'], 'SupplementalNotes.pdf', {
        type: 'application/pdf'
      });

      render(
        <FileUpload
          id="test-multi-file-upload"
          name="test-multi-file-upload"
          multiple
          files={[fileOne, fileTwo]}
          showFileTypeIcons={false}
          onChange={() => {}}
          onBlur={() => {}}
          ariaDescribedBy=""
          inputProps={{}}
        />
      );

      expect(screen.getByTestId('file-upload-wrapper')).toHaveTextContent(
        '2 files selected'
      );
      expect(screen.getByText('Change files')).toBeInTheDocument();
      expect(screen.getByText('Draft_DUA.pdf')).toBeInTheDocument();
      expect(screen.getByText('SupplementalNotes.pdf')).toBeInTheDocument();
    });

    it('calls onChange when additional files are selected', () => {
      const handleChange = vi.fn();
      const existingFile = new File(['one'], 'first.pdf', {
        type: 'application/pdf'
      });

      render(
        <FileUpload
          id="test-multi-file-upload"
          name="test-multi-file-upload"
          multiple
          files={[existingFile]}
          showFileTypeIcons={false}
          onChange={handleChange}
          onBlur={() => {}}
          ariaDescribedBy=""
          inputProps={{}}
        />
      );

      const newFile = new File(['two'], 'second.pdf', {
        type: 'application/pdf'
      });

      fireEvent.change(screen.getByTestId('file-upload-input'), {
        target: { files: [newFile] }
      });

      expect(handleChange).toHaveBeenCalled();
    });
  });
});
