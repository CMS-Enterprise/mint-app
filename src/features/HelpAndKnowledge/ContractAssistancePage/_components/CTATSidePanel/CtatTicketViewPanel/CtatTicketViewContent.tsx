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
import {
  cmmiDivisions,
  cmmiGroups,
  contractActivityTypes,
  contractTypes,
  requestUrgencies,
  statuses
} from 'i18n/en-US/ctatRequest';
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
  const { t } = useTranslation('contractAssistance');
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
        {t('ctatViewPanel.submittedOn', {
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
            {t('ctatViewPanel.progressHeading')}
          </PageHeading>

          <DetailField
            label={t('table.status')}
            definition={ticket.status ? statuses[ticket.status] : ''}
          />

          <DetailField
            label={t('ctatViewPanel.assignedMember')}
            definition={
              assignedMemberDisplay || (
                <EmptyValue>{t('ctatViewPanel.empty.notAssigned')}</EmptyValue>
              )
            }
          />

          <DetailField
            label={t('ctatViewPanel.progressNotes')}
            definition={
              ticket.notes?.trim() ? (
                ticket.notes
              ) : (
                <EmptyValue>{t('ctatViewPanel.empty.noNotes')}</EmptyValue>
              )
            }
          />

          <DetailField
            label={t('ctatViewPanel.resolution')}
            className="margin-bottom-0"
            definition={
              ticket.resolution?.trim() ? (
                ticket.resolution
              ) : (
                <EmptyValue>{t('ctatViewPanel.empty.noResolution')}</EmptyValue>
              )
            }
          />
        </div>
      )}

      <PageHeading headingLevel="h3" className="margin-top-0 margin-bottom-3">
        {t('ctatViewPanel.ticketDetailsHeading')}
      </PageHeading>

      <DetailField
        label={t('ctatSidePanel.fields.requester.label')}
        definition={requesterDisplay}
      />

      <DetailField
        label={t('ctatSidePanel.fields.cmmiGroup.label')}
        definition={ticket.cmmiGroup ? cmmiGroups[ticket.cmmiGroup] : ''}
      />

      {ticket.cmmiGroup === CtatcmmiGroupOption.OTHER && (
        <DetailField
          label={t('ctatSidePanel.fields.cmmiGroup.otherLabel')}
          definition={
            ticket.cmmiGroupOther?.trim() || (
              <EmptyValue>{t('ctatViewPanel.empty.noContractName')}</EmptyValue>
            )
          }
        />
      )}

      <DetailField
        label={t('ctatSidePanel.fields.cmmiDivision.label')}
        definition={
          ticket.cmmiDivision ? cmmiDivisions[ticket.cmmiDivision] : ''
        }
      />

      {ticket.cmmiDivision === CtatcmmiDivisionOption.OTHER && (
        <DetailField
          label={t('ctatSidePanel.fields.cmmiDivision.otherLabel')}
          definition={
            ticket.cmmiDivisionOther?.trim() || (
              <EmptyValue>{t('ctatViewPanel.empty.noContractName')}</EmptyValue>
            )
          }
        />
      )}

      <DetailField
        label={t('ctatSidePanel.fields.modelOrDemonstration.label')}
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
                    >
                      {t('ctatViewPanel.viewModelInMint')}
                    </UswdsReactLink>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyValue>{t('ctatViewPanel.empty.noModel')}</EmptyValue>
          )
        }
      />

      <DetailField
        label={t('ctatSidePanel.fields.contractActivityType.label')}
        definition={
          ticket.contractActivityType ? (
            contractActivityTypes[ticket.contractActivityType]
          ) : (
            <EmptyValue>
              {t('ctatViewPanel.empty.noContractActivityType')}
            </EmptyValue>
          )
        }
      />

      {ticket.contractActivityType === CtatContractActivityType.OTHER && (
        <DetailField
          label={t('ctatSidePanel.fields.contractActivityType.otherLabel')}
          definition={
            ticket.contractActivityTypeOther?.trim() || (
              <EmptyValue>
                {t('ctatViewPanel.empty.noContractActivityType')}
              </EmptyValue>
            )
          }
        />
      )}

      <DetailField
        label={t('ctatSidePanel.fields.contractName.label')}
        definition={
          ticket.contractName?.trim() ? (
            ticket.contractName
          ) : (
            <EmptyValue>{t('ctatViewPanel.empty.noContractName')}</EmptyValue>
          )
        }
      />

      <DetailField
        label={t('ctatSidePanel.fields.contractNumber.label')}
        definition={
          ticket.contractNumber?.trim() ? (
            ticket.contractNumber
          ) : (
            <EmptyValue>{t('ctatViewPanel.empty.noContractNumber')}</EmptyValue>
          )
        }
      />

      <DetailField
        label={t('ctatSidePanel.fields.contractType.label')}
        definition={
          ticket.contractType ? (
            contractTypes[ticket.contractType]
          ) : (
            <EmptyValue>{t('ctatViewPanel.empty.noContractType')}</EmptyValue>
          )
        }
      />

      {ticket.contractType === CtatContractType.OTHER && (
        <DetailField
          label={t('ctatSidePanel.fields.contractType.otherLabel')}
          definition={
            ticket.contractTypeOther?.trim() || (
              <EmptyValue>{t('ctatViewPanel.empty.noContractType')}</EmptyValue>
            )
          }
        />
      )}

      <DetailField
        label={t('ctatSidePanel.fields.helpNeededType.label')}
        definition={helpTypesDisplay}
      />

      <DetailField
        label={t('ctatSidePanel.fields.assistanceDescription.label')}
        definition={
          ticket.describeHelpNeeded?.trim() ? (
            ticket.describeHelpNeeded
          ) : (
            <EmptyValue>{t('ctatViewPanel.empty.noNotes')}</EmptyValue>
          )
        }
      />

      <DetailField
        label={t('ctatSidePanel.fields.requestUrgency.label')}
        definition={
          ticket.requestUrgency ? requestUrgencies[ticket.requestUrgency] : ''
        }
      />

      <DetailField
        label={t('ctatSidePanel.fields.assistanceNeededBy.label')}
        definition={
          ticket.dateAssistanceNeededBy
            ? formatDateLocal(ticket.dateAssistanceNeededBy, 'MM/dd/yyyy')
            : ''
        }
      />

      <DetailField
        label={t('ctatViewPanel.uploadedDocuments')}
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
            <EmptyValue>{t('ctatViewPanel.empty.noDocuments')}</EmptyValue>
          )
        }
      />

      {!isClosed && (
        <SummaryBox>
          <SummaryBoxHeading headingLevel="h3" className="margin-bottom-1">
            {t('ctatSidePanel.whatHappensNext.heading')}
          </SummaryBoxHeading>
          <SummaryBoxContent>
            <p className="margin-top-0 margin-bottom-1">
              {t('ctatSidePanel.whatHappensNext.intro')}
            </p>
            <ul className="margin-top-0 margin-bottom-0">
              <li>{t('ctatSidePanel.whatHappensNext.bullet1')}</li>
              <li>{t('ctatSidePanel.whatHappensNext.bullet2')}</li>
              <li>{t('ctatSidePanel.whatHappensNext.bullet3')}</li>
              <li>{t('ctatSidePanel.whatHappensNext.bullet4')}</li>
            </ul>
          </SummaryBoxContent>
        </SummaryBox>
      )}
    </div>
  );
};

export default CtatTicketViewContent;
