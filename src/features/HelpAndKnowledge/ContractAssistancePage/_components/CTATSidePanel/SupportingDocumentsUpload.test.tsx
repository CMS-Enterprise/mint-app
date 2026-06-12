import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { fireEvent, screen } from '@testing-library/react';
import setup from 'tests/util';

import { CtatTicketFormValues } from './CtatTicketForm';
import SupportingDocumentsUpload from './SupportingDocumentsUpload';

const TestForm = () => {
  const methods = useForm<CtatTicketFormValues>({
    defaultValues: {
      supportingDocuments: []
    }
  });

  return (
    <FormProvider {...methods}>
      <SupportingDocumentsUpload control={methods.control} />
    </FormProvider>
  );
};

describe('SupportingDocumentsUpload', () => {
  it('shows the empty upload prompt before files are selected', () => {
    setup(<TestForm />);

    expect(screen.getByText('Drag file here or')).toBeInTheDocument();
    expect(screen.getByText('choose from folder')).toBeInTheDocument();
  });

  it('shows selected files in the multi-file preview', () => {
    setup(<TestForm />);

    const fileOne = new File(['one'], 'Draft_DUA.pdf', {
      type: 'application/pdf'
    });
    const fileTwo = new File(['two'], 'SupplementalNotes.pdf', {
      type: 'application/pdf'
    });

    fireEvent.change(screen.getByTestId('file-upload-input'), {
      target: { files: [fileOne, fileTwo] }
    });

    expect(screen.getByTestId('file-upload-wrapper')).toHaveTextContent(
      '2 files selected'
    );
    expect(screen.getByText('Change files')).toBeInTheDocument();
    expect(screen.getByText('Draft_DUA.pdf')).toBeInTheDocument();
    expect(screen.getByText('SupplementalNotes.pdf')).toBeInTheDocument();
  });

  it('adds files from separate selections', () => {
    setup(<TestForm />);

    const fileOne = new File(['one'], 'first.pdf', {
      type: 'application/pdf'
    });
    const fileTwo = new File(['two'], 'second.pdf', {
      type: 'application/pdf'
    });

    fireEvent.change(screen.getByTestId('file-upload-input'), {
      target: { files: [fileOne] }
    });
    fireEvent.change(screen.getByTestId('file-upload-input'), {
      target: { files: [fileTwo] }
    });

    expect(screen.getByTestId('file-upload-wrapper')).toHaveTextContent(
      '2 files selected'
    );
    expect(screen.getByText('first.pdf')).toBeInTheDocument();
    expect(screen.getByText('second.pdf')).toBeInTheDocument();
  });
});
