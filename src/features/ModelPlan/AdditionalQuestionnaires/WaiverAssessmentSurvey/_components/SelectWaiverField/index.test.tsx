import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SelectWaiverField from './index';

type WaiverSelectionFields = {
  willUseWaiver: boolean | null;
  notUsingReason: string;
};

const FormWrapper = ({
  defaultValues
}: {
  defaultValues?: Partial<WaiverSelectionFields>;
}) => {
  const methods = useForm<WaiverSelectionFields>({
    defaultValues: {
      willUseWaiver: null,
      notUsingReason: '',
      ...defaultValues
    }
  });

  return (
    <FormProvider {...methods}>
      <SelectWaiverField />
    </FormProvider>
  );
};

describe('SelectWaiverField', () => {
  it('renders the label and yes/no options when no selection has been made', () => {
    render(<FormWrapper />);

    expect(
      screen.getByText('Do you plan to use this waiver with your model?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your answer to this question may reveal additional questions to be answered.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('willUseWaiver-yes')).toBeInTheDocument();
    expect(screen.getByTestId('willUseWaiver-no')).toBeInTheDocument();
  });

  it('shows confirmation when yes is selected', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    await user.click(screen.getByTestId('willUseWaiver-yes'));

    expect(
      screen.getByText('You said your model will use this waiver.')
    ).toBeInTheDocument();
    expect(screen.getByText('Change response')).toBeInTheDocument();
    expect(screen.queryByTestId('notUsingReason')).not.toBeInTheDocument();
  });

  it('shows confirmation and reason field when no is selected', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    await user.click(screen.getByTestId('willUseWaiver-no'));

    expect(
      screen.getByText('You said your model will not use this waiver.')
    ).toBeInTheDocument();
    expect(screen.getByText('Change response')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Please explain why your model is not using this waiver.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('notUsingReason')).toBeInTheDocument();
  });

  it('resets to yes/no options when change response is clicked', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    await user.click(screen.getByTestId('willUseWaiver-yes'));
    await user.click(screen.getByText('Change response'));

    expect(screen.getByTestId('willUseWaiver-yes')).toBeInTheDocument();
    expect(screen.getByTestId('willUseWaiver-no')).toBeInTheDocument();
    expect(
      screen.queryByText('You said your model will use this waiver.')
    ).not.toBeInTheDocument();
  });
});
