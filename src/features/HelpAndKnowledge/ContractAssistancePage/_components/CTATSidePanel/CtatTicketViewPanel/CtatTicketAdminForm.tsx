import React, { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Fieldset,
  Form,
  FormGroup,
  Label,
  Select
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  CtatAdminUpdateInput,
  CtatStatus,
  GetCtatRequestQuery,
  useAdminUpdateCtatRequestMutation
} from 'gql/generated/graphql';
import GetCtatRequest from 'gql/operations/CTAT/GetCtatRequest';
import GetCtatRequestsAdmin from 'gql/operations/CTAT/GetCtatRequestsAdmin';

import CollapsableLink from 'components/CollapsableLink';
import HelpText from 'components/HelpText';
import OktaUserSelect from 'components/OktaUserSelect';
import PageHeading from 'components/PageHeading';
import TextAreaField from 'components/TextAreaField';
import toastSuccess from 'components/ToastSuccess';
import { getStatusAlertBody } from 'contexts/ErrorContext';
import { setCurrentErrorMeta } from 'contexts/ErrorContext/errorMetaStore';
import { OktaUserType } from 'hooks/useOktaUserLookup';
import { statuses } from 'i18n/en-US/helpAndKnowledge/contractAssistance';
import dirtyInput from 'utils/formUtil';
import { tObject } from 'utils/translation';

const STATUS_OPTIONS = [
  CtatStatus.NEW,
  CtatStatus.ASSIGNED,
  CtatStatus.IN_PROGRESS,
  CtatStatus.CLOSED
] as const;

type CtatTicketAdminFormValues = {
  status: CtatStatus;
  assignedAdmin: string;
  notes: string;
  resolution: string;
};

type CtatTicketAdminFormProps = {
  ticket: GetCtatRequestQuery['ctatRequest'];
  closeModal: () => void;
  setDisableButton: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDirty: (isDirty: boolean) => void;
  onSubmitted: () => void;
};

const buildSelectedAdmin = (
  ticket: GetCtatRequestQuery['ctatRequest']
): OktaUserType | null => {
  const account = ticket.assignedAdminUserAccount;
  if (!account?.username) {
    return null;
  }

  return {
    username: account.username,
    displayName: account.commonName || '',
    email: account.email || ''
  };
};

const buildInitialValues = (
  ticket: GetCtatRequestQuery['ctatRequest']
): CtatTicketAdminFormValues => ({
  status: ticket.status ?? CtatStatus.NEW,
  assignedAdmin: ticket.assignedAdminUserAccount?.username ?? '',
  notes: ticket.notes ?? '',
  resolution: ticket.resolution ?? ''
});

const CtatTicketAdminForm = ({
  ticket,
  closeModal,
  setDisableButton,
  setIsDirty,
  onSubmitted
}: CtatTicketAdminFormProps) => {
  const { t: contractAssistanceT } = useTranslation('contractAssistance');
  const { t: contractAssistanceMiscT } = useTranslation(
    'contractAssistanceMisc'
  );

  const statusInfoConfig = tObject<string, string[]>(
    'contractAssistanceMisc:ctatSidePanel.statusInfo'
  );

  const initialValues = useMemo(() => buildInitialValues(ticket), [ticket]);
  const [selectedAdmin, setSelectedAdmin] = useState<OktaUserType | null>(() =>
    buildSelectedAdmin(ticket)
  );

  const [adminUpdateCtatRequest] = useAdminUpdateCtatRequestMutation({
    refetchQueries: [
      { query: GetCtatRequest, variables: { id: ticket.id } },
      { query: GetCtatRequestsAdmin }
    ]
  });

  const methods = useForm<CtatTicketAdminFormValues>({
    defaultValues: initialValues,
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty }
  } = methods;

  const selectedStatus = watch('status');
  const isClosed = selectedStatus === CtatStatus.CLOSED;

  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  useEffect(() => {
    setDisableButton(!isDirty || isSubmitting);
  }, [isDirty, isSubmitting, setDisableButton]);

  const onSubmit = (formData: CtatTicketAdminFormValues) => {
    const changes = dirtyInput(initialValues, formData) as CtatAdminUpdateInput;

    setCurrentErrorMeta({
      overrideMessage: getStatusAlertBody({
        type: 'error',
        message: contractAssistanceMiscT('ctatAdminPanel.error')
      })
    });

    adminUpdateCtatRequest({
      variables: {
        id: ticket.id,
        changes
      }
    }).then(response => {
      if (!response.errors) {
        toastSuccess(
          <Trans
            i18nKey="contractAssistanceMisc:ctatAdminPanel.success"
            values={{
              ticketId: response.data?.adminUpdateCTATRequest.humanReadableID
            }}
            components={{
              bold: <span className="text-bold" />
            }}
          />
        );
        onSubmitted();
        closeModal();
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <Form
        id="ctat-admin-form"
        className="maxw-none"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          className={classNames('radius-md padding-3 margin-bottom-4', {
            'bg-base-lighter': isClosed,
            'bg-primary-lighter': !isClosed
          })}
        >
          <PageHeading
            headingLevel="h3"
            className="margin-top-0 margin-bottom-3"
          >
            {contractAssistanceMiscT('ctatViewPanel.progressHeading')}
          </PageHeading>

          <Fieldset className="usa-fieldset margin-top-0 margin-bottom-0">
            <Controller
              name="status"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor="ctat-admin-status"
                    className="maxw-none text-bold"
                  >
                    {contractAssistanceT('status.label')}
                  </Label>
                  <Select
                    {...field}
                    id="ctat-admin-status"
                    data-testid="ctat-admin-status"
                    value={field.value}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      field.onChange(e.target.value as CtatStatus);
                    }}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>
                        {statuses[status]}
                      </option>
                    ))}
                  </Select>

                  <CollapsableLink
                    id="statuses-info"
                    className="width-full line-height-body-4"
                    label={contractAssistanceMiscT(
                      'ctatSidePanel.statusInfo.label'
                    )}
                    horizontalCaret
                  >
                    <ul className="margin-y-0 padding-left-3">
                      {statusInfoConfig.statuses.map(
                        (status: string, index: number) => (
                          <li className="margin-bottom-1" key={status}>
                            <Trans
                              i18nKey={`contractAssistanceMisc:ctatSidePanel.statusInfo.statuses.${index}`}
                              components={{
                                bold: <strong />
                              }}
                            />
                          </li>
                        )
                      )}
                    </ul>
                  </CollapsableLink>
                </FormGroup>
              )}
            />

            <Controller
              name="assignedAdmin"
              control={control}
              render={() => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor="ctat-admin-assigned-member"
                    id="label-ctat-admin-assigned-member"
                    className="maxw-none text-bold"
                  >
                    {contractAssistanceT('assignedAdmin.label')}
                  </Label>
                  <HelpText
                    id="hint-ctat-admin-assigned-member"
                    className="margin-top-05"
                  >
                    {contractAssistanceT('assignedAdmin.sublabel')}
                  </HelpText>
                  <OktaUserSelect
                    id="ctat-admin-assigned-member"
                    name="ctat-admin-assigned-member"
                    ariaLabelledBy="label-ctat-admin-assigned-member"
                    ariaDescribedBy="hint-ctat-admin-assigned-member"
                    value={selectedAdmin}
                    onChange={oktaUser => {
                      setSelectedAdmin(oktaUser);
                      setValue('assignedAdmin', oktaUser?.username ?? '', {
                        shouldDirty: true
                      });
                    }}
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="notes"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-3">
                  <Label
                    htmlFor="ctat-admin-progress-notes"
                    className="maxw-none text-bold"
                  >
                    {contractAssistanceT('notes.label')}
                  </Label>
                  <HelpText className="margin-top-05">
                    {contractAssistanceT('notes.sublabel')}
                  </HelpText>
                  <TextAreaField
                    {...field}
                    inputRef={ref}
                    id="ctat-admin-progress-notes"
                    value={field.value || ''}
                    className="height-card"
                  />
                </FormGroup>
              )}
            />

            <Controller
              name="resolution"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormGroup className="margin-top-0 margin-bottom-0">
                  <Label
                    htmlFor="ctat-admin-resolution"
                    className="maxw-none text-bold"
                  >
                    {contractAssistanceT('resolution.label')}
                  </Label>
                  <HelpText className="margin-top-05">
                    {contractAssistanceT('resolution.sublabel')}
                  </HelpText>
                  <TextAreaField
                    {...field}
                    inputRef={ref}
                    id="ctat-admin-resolution"
                    value={field.value || ''}
                    className="height-card"
                  />
                </FormGroup>
              )}
            />
          </Fieldset>
        </div>
      </Form>
    </FormProvider>
  );
};

export default CtatTicketAdminForm;
