import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WaiverSelectionFields } from 'types/waivers';

import SelectWaiverField from './index';

const TEST_WAIVER_ID = 'test-waiver-id';
const FIELD_PREFIX = `waivers.${TEST_WAIVER_ID}`;

type FormValues = {
  waivers: Record<string, WaiverSelectionFields>;
};

const FormWrapper = ({
  defaultValues
}: {
  defaultValues?: Partial<WaiverSelectionFields>;
}) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      waivers: {
        [TEST_WAIVER_ID]: {
          willUseWaiver: null,
          notUsingReason: '',
          ...defaultValues
        }
      }
    }
  });
  const notUsingReason = methods.watch(
    `${FIELD_PREFIX}.notUsingReason` as `waivers.${string}.notUsingReason`
  );

  return (
    <FormProvider {...methods}>
      <SelectWaiverField fieldPrefix={FIELD_PREFIX} />
      <span data-testid="notUsingReason-value">{notUsingReason}</span>
    </FormProvider>
  );
};

describe('SelectWaiverField', () => {
  const yesTestId = `willUseWaiver-yes-waivers-${TEST_WAIVER_ID}`;
  const noTestId = `willUseWaiver-no-waivers-${TEST_WAIVER_ID}`;
  const notUsingReasonTestId = `notUsingReason-waivers-${TEST_WAIVER_ID}`;

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
    expect(screen.getByTestId(yesTestId)).toBeInTheDocument();
    expect(screen.getByTestId(noTestId)).toBeInTheDocument();
  });

  it('shows confirmation when yes is selected', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    await user.click(screen.getByTestId(yesTestId));

    expect(
      screen.getByText('You said your model will use this waiver.')
    ).toBeInTheDocument();
    expect(screen.getByText('Change response')).toBeInTheDocument();
    expect(screen.queryByTestId(notUsingReasonTestId)).not.toBeInTheDocument();
  });

  it('shows confirmation and reason field when no is selected', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    await user.click(screen.getByTestId(noTestId));

    expect(
      screen.getByText('You said your model will not use this waiver.')
    ).toBeInTheDocument();
    expect(screen.getByText('Change response')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Please explain why your model is not using this waiver.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId(notUsingReasonTestId)).toBeInTheDocument();
  });

  it('resets to yes/no options when change response is clicked', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    await user.click(screen.getByTestId(yesTestId));
    await user.click(screen.getByText('Change response'));

    expect(screen.getByTestId(yesTestId)).toBeInTheDocument();
    expect(screen.getByTestId(noTestId)).toBeInTheDocument();
    expect(
      screen.queryByText('You said your model will use this waiver.')
    ).not.toBeInTheDocument();
  });

  it('clears notUsingReason when change response is clicked', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    await user.click(screen.getByTestId(noTestId));
    await user.type(screen.getByTestId(notUsingReasonTestId), 'Some reason');
    expect(screen.getByTestId('notUsingReason-value')).toHaveTextContent(
      'Some reason'
    );

    await user.click(screen.getByText('Change response'));

    expect(screen.getByTestId('notUsingReason-value')).toHaveTextContent('');
  });
});
