import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  CtatcmmiDivisionOption,
  CtatcmmiGroupOption,
  CtatContractActivityType,
  CtatContractType,
  CtatStatus,
  GetCtatRequestQuery
} from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateLocal } from 'utils/date';
import downloadFile from 'utils/downloadFile';

import { formatHelpTypes, formatUserDisplay } from '../../../utils';

import CtatTicketAdminForm from './CtatTicketAdminForm';

type CtatTicketViewContentProps = {
  ticket: GetCtatRequestQuery['ctatRequest'];
  isAdmin?: boolean;
  closeModal?: () => void;
  setDisableButton?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDirty?: (isDirty: boolean) => void;
  onSubmitted?: () => void;
};

type DetailFieldProps = {
  label: string;
  definition: ReactNode;
  className?: string;
};

const DetailField = ({ label, definition, className }: DetailFieldProps) => (
  <div className={classNames('margin-bottom-3', className)}>
    <DescriptionTerm className="margin-bottom-0" term={label} />
    <DescriptionDefinition
      className="font-body-md text-base-darkest"
      definition={definition}
    />
  </div>
);

const EmptyValue = ({ children }: { children: ReactNode }) => (
  <p className="margin-0 text-base-dark text-italic">{children}</p>
);

type SupportingDocument =
  GetCtatRequestQuery['ctatRequest']['supportingDocuments'][number];

const SupportingDocumentItem = ({
  document
}: {
  document: SupportingDocument;
}) => {
  const { t } = useTranslation('documentsMisc');

  if (!document.virusScanned) {
    return (
      <span className="text-base-light">
        {document.fileName} ({t('documentTable.scanInProgress')})
      </span>
    );
  }

  if (!document.virusClean) {
    return (
      <span className="text-red">
        {document.fileName} ({t('documentTable.virusFound')})
      </span>
    );
  }

  if (document.url) {
    return (
      <a
        href={document.url}
        className="usa-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {document.fileName}
      </a>
    );
  }

  const handleDownload = () => {
    if (!document.fileName || !document.fileType || !document.downloadUrl) {
      return;
    }

    downloadFile({
      fileType: document.fileType,
      fileName: document.fileName,
      downloadURL: document.downloadUrl
    });
  };

  return (
    <Button
      type="button"
      unstyled
      className="usa-link padding-0"
      onClick={handleDownload}
    >
      {document.fileName}
    </Button>
  );
};

const CtatTicketViewContent = ({
  ticket,
  isAdmin = false,
  closeModal,
  setDisableButton,
  setIsDirty,
  onSubmitted
}: CtatTicketViewContentProps) => {
  const { t: contractAssistanceT } = useTranslation('contractAssistance');
  const { t: contractAssistanceMiscT } = useTranslation(
    'contractAssistanceMisc'
  );

  const {
    status: statusConfig,
    cmmiGroup: cmmiGroupConfig,
    cmmiDivision: cmmiDivisionConfig,
    contractActivityType: contractActivityTypeConfig,
    contractType: contractTypeConfig,
    requestUrgency: requestUrgencyConfig
  } = usePlanTranslation('contractAssistance');

  const isClosed = ticket.status === CtatStatus.CLOSED;

  const assignedMemberDisplay = formatUserDisplay(
    ticket.assignedAdminUserAccount
  );
  const requesterDisplay = formatUserDisplay(ticket.requesterUserAccount);

  const helpTypesDisplay = ticket.typeOfHelpNeeded.length
    ? formatHelpTypes(ticket.typeOfHelpNeeded, ticket.typeOfHelpNeededOther)
    : null;

  return (
    <div
      className={classNames('margin-top-8 padding-8 maxw-tablet', {
        'padding-bottom-15': isAdmin
      })}
    >
      <PageHeading className="margin-top-0 margin-bottom-1" headingLevel="h2">
        {ticket.humanReadableID}
      </PageHeading>
      <p className="margin-top-0 margin-bottom-4">
        {contractAssistanceMiscT('ctatViewPanel.submittedOn', {
          date: formatDateLocal(ticket.createdDts, 'MM/dd/yyyy')
        })}
      </p>

      {isAdmin &&
      closeModal &&
      setDisableButton &&
      setIsDirty &&
      onSubmitted ? (
        <CtatTicketAdminForm
          ticket={ticket}
          closeModal={closeModal}
          setDisableButton={setDisableButton}
          setIsDirty={setIsDirty}
          onSubmitted={onSubmitted}
        />
      ) : (
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

          <DetailField
            label={contractAssistanceT('status.label')}
            definition={
              ticket.status ? statusConfig.options[ticket.status] : ''
            }
          />

          <DetailField
            label={contractAssistanceMiscT('ctatViewPanel.assignedMember')}
            definition={
              assignedMemberDisplay || (
                <EmptyValue>
                  {contractAssistanceMiscT('ctatViewPanel.empty.notAssigned')}
                </EmptyValue>
              )
            }
          />

          <DetailField
            label={contractAssistanceT('notes.label')}
            definition={
              ticket.notes?.trim() ? (
                ticket.notes
              ) : (
                <EmptyValue>
                  {contractAssistanceMiscT('ctatViewPanel.empty.noNotes')}
                </EmptyValue>
              )
            }
          />

          <DetailField
            label={contractAssistanceT('resolution.label')}
            className="margin-bottom-0"
            definition={
              ticket.resolution?.trim() ? (
                ticket.resolution
              ) : (
                <EmptyValue>
                  {contractAssistanceMiscT('ctatViewPanel.empty.noResolution')}
                </EmptyValue>
              )
            }
          />
        </div>
      )}

      <PageHeading headingLevel="h3" className="margin-top-0 margin-bottom-3">
        {contractAssistanceMiscT('ctatViewPanel.ticketDetailsHeading')}
      </PageHeading>

      <DetailField
        label={contractAssistanceT('requester.label')}
        definition={requesterDisplay}
      />

      <DetailField
        label={contractAssistanceT('cmmiGroup.label')}
        definition={
          ticket.cmmiGroup ? cmmiGroupConfig.options[ticket.cmmiGroup] : ''
        }
      />

      {ticket.cmmiGroup === CtatcmmiGroupOption.OTHER && (
        <DetailField
          label={contractAssistanceT('cmmiGroupOther.label')}
          definition={
            ticket.cmmiGroupOther?.trim() || (
              <EmptyValue>
                {contractAssistanceMiscT('ctatViewPanel.empty.noContractName')}
              </EmptyValue>
            )
          }
        />
      )}

      <DetailField
        label={contractAssistanceT('cmmiDivision.label')}
        definition={
          ticket.cmmiDivision
            ? cmmiDivisionConfig.options[ticket.cmmiDivision]
            : ''
        }
      />

      {ticket.cmmiDivision === CtatcmmiDivisionOption.OTHER && (
        <DetailField
          label={contractAssistanceT('cmmiDivisionOther.label')}
          definition={
            ticket.cmmiDivisionOther?.trim() || (
              <EmptyValue>
                {contractAssistanceMiscT('ctatViewPanel.empty.noContractName')}
              </EmptyValue>
            )
          }
        />
      )}

      <DetailField
        label={contractAssistanceT('relatedMINTModels.label')}
        definition={
          ticket.relatedMINTModels?.length ? (
            <ul className="margin-top-0 margin-bottom-0 padding-left-3">
              {ticket.relatedMINTModels.map(model => (
                <li key={model.id} className="margin-bottom-1">
                  {model.modelName}
                  <div>
                    <UswdsReactLink
                      to={`/models/${model.id}/collaboration-area`}
                      className="usa-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contractAssistanceMiscT('ctatViewPanel.viewModelInMint')}
                    </UswdsReactLink>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyValue>
              {contractAssistanceMiscT('ctatViewPanel.empty.noModel')}
            </EmptyValue>
          )
        }
      />

      <DetailField
        label={contractAssistanceT('contractActivityType.label')}
        definition={
          ticket.contractActivityType ? (
            contractActivityTypeConfig.options[ticket.contractActivityType]
          ) : (
            <EmptyValue>
              {contractAssistanceMiscT(
                'ctatViewPanel.empty.noContractActivityType'
              )}
            </EmptyValue>
          )
        }
      />

      {ticket.contractActivityType === CtatContractActivityType.OTHER && (
        <DetailField
          label={contractAssistanceT('contractActivityTypeOther.label')}
          definition={
            ticket.contractActivityTypeOther?.trim() || (
              <EmptyValue>
                {contractAssistanceMiscT(
                  'ctatViewPanel.empty.noContractActivityType'
                )}
              </EmptyValue>
            )
          }
        />
      )}

      <DetailField
        label={contractAssistanceT('contractName.label')}
        definition={
          ticket.contractName?.trim() ? (
            ticket.contractName
          ) : (
            <EmptyValue>
              {contractAssistanceMiscT('ctatViewPanel.empty.noContractName')}
            </EmptyValue>
          )
        }
      />

      <DetailField
        label={contractAssistanceT('contractNumber.label')}
        definition={
          ticket.contractNumber?.trim() ? (
            ticket.contractNumber
          ) : (
            <EmptyValue>
              {contractAssistanceMiscT('ctatViewPanel.empty.noContractNumber')}
            </EmptyValue>
          )
        }
      />

      <DetailField
        label={contractAssistanceT('contractType.label')}
        definition={
          ticket.contractType ? (
            contractTypeConfig.options[ticket.contractType]
          ) : (
            <EmptyValue>
              {contractAssistanceMiscT('ctatViewPanel.empty.noContractType')}
            </EmptyValue>
          )
        }
      />

      {ticket.contractType === CtatContractType.OTHER && (
        <DetailField
          label={contractAssistanceT('contractTypeOther.label')}
          definition={
            ticket.contractTypeOther?.trim() || (
              <EmptyValue>
                {contractAssistanceMiscT('ctatViewPanel.empty.noContractType')}
              </EmptyValue>
            )
          }
        />
      )}

      <DetailField
        label={contractAssistanceT('typeOfHelpNeeded.label')}
        definition={helpTypesDisplay}
      />

      <DetailField
        label={contractAssistanceT('describeHelpNeeded.label')}
        definition={
          ticket.describeHelpNeeded?.trim() ? (
            ticket.describeHelpNeeded
          ) : (
            <EmptyValue>
              {contractAssistanceMiscT('ctatViewPanel.empty.noNotes')}
            </EmptyValue>
          )
        }
      />

      <DetailField
        label={contractAssistanceT('requestUrgency.label')}
        definition={
          ticket.requestUrgency
            ? requestUrgencyConfig.options[ticket.requestUrgency]
            : ''
        }
      />

      <DetailField
        label={contractAssistanceT('dateAssistanceNeededBy.label')}
        definition={
          ticket.dateAssistanceNeededBy
            ? formatDateLocal(ticket.dateAssistanceNeededBy, 'MM/dd/yyyy')
            : ''
        }
      />

      <DetailField
        label={contractAssistanceMiscT('ctatViewPanel.uploadedDocuments')}
        definition={
          ticket.supportingDocuments?.length ? (
            <ul className="margin-top-0 margin-bottom-0 padding-left-0 usa-list usa-list--unstyled">
              {ticket.supportingDocuments.map(document => (
                <li key={document.id} className="margin-bottom-05">
                  <SupportingDocumentItem document={document} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyValue>
              {contractAssistanceMiscT('ctatViewPanel.empty.noDocuments')}
            </EmptyValue>
          )
        }
      />

      {!isClosed && !isAdmin && (
        <SummaryBox>
          <SummaryBoxHeading headingLevel="h3" className="margin-bottom-1">
            {contractAssistanceMiscT('ctatSidePanel.whatHappensNext.heading')}
          </SummaryBoxHeading>
          <SummaryBoxContent>
            <p className="margin-top-0 margin-bottom-1">
              {contractAssistanceMiscT('ctatSidePanel.whatHappensNext.intro')}
            </p>
            <ul className="margin-top-0 margin-bottom-0">
              <li>
                {contractAssistanceMiscT(
                  'ctatSidePanel.whatHappensNext.bullet1'
                )}
              </li>
              <li>
                {contractAssistanceMiscT(
                  'ctatSidePanel.whatHappensNext.bullet2'
                )}
              </li>
              <li>
                {contractAssistanceMiscT(
                  'ctatSidePanel.whatHappensNext.bullet3'
                )}
              </li>
              <li>
                {contractAssistanceMiscT(
                  'ctatSidePanel.whatHappensNext.bullet4'
                )}
              </li>
            </ul>
          </SummaryBoxContent>
        </SummaryBox>
      )}
    </div>
  );
};

export default CtatTicketViewContent;
