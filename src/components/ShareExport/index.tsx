import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { useMutation } from '@apollo/client';
import {
  Button,
  ButtonGroup,
  ComboBox,
  ComboBoxRef,
  Form,
  GridContainer,
  IconClose,
  IconLink,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import CreateShareModelPlan from 'gql/apolloGQL/ShareExport/CreateShareModelPlan';
import { ModelViewFilter } from 'gql/gen/graphql';

import OktaMultiSelect from 'components/OktaUserSelect/multiSelect';
import Alert from 'components/shared/Alert';
import CheckboxField from 'components/shared/CheckboxField';
import FieldGroup from 'components/shared/FieldGroup';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import useFetchCSVData from 'hooks/useFetchCSVData';
import { ReadOnlyComponents } from 'views/ModelPlan/ReadOnly';
import BodyContent from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent';
import { filterGroups } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';
import { groupOptions } from 'views/ModelPlan/ReadOnly/_components/FilterView/util';
import { StatusMessageType } from 'views/ModelPlan/TaskList';

import PDFSummary from './pdfSummary';

import './index.scss';

const navElement = ['share', 'export'] as const;

type FitlerGroup = typeof filterGroups[number] | 'all';

const FileTypes = ['csv', 'pdf'] as const;

type ShareExportModalProps = {
  modelID: string;
  closeModal: () => void;
  filteredView?: typeof filterGroups[number] | 'all';
  setStatusMessage: (message: StatusMessageType) => void;
} & JSX.IntrinsicElements['button'];

/**
 * Modal for sharing/exporting a model plan
 */
const ShareExportModal = ({
  modelID,
  closeModal,
  filteredView,
  setStatusMessage
}: ShareExportModalProps) => {
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const [filteredGroup, setFilteredGroup] = useState<FitlerGroup>(
    (filteredView as typeof filterGroups[number]) || 'all'
  );

  const [exportCSV, setExportCSV] = useState<boolean>(false);
  const [exportPDF, setExportPDF] = useState<boolean>(false);

  const [receiverEmails, setReceiverEmails] = useState<string>('');
  const [optionalMessage, setOptionalMessage] = useState<string>('');

  // State for modal navigation elements
  const [isActive, setIsActive] = useState<typeof navElement[number]>('share');

  const { fetchSingleData } = useFetchCSVData();

  const modalElementId: string = 'share-export-modal';

  // Used for react-to-pdf to render pdf from component ref
  const componentRef = useRef<HTMLDivElement>(null);

  // Filter group form ref
  const comboboxRef = useRef<ComboBoxRef>(null);

  // Sets the default combobox option to a filter view if already on a filter view readonly page
  useEffect(() => {
    if (filteredView) setFilteredGroup(filteredView);
  }, [filteredView]);

  // Submit handler for exporting PDF
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: generalReadOnlyT('modal.documentTitle'),
    onAfterPrint: () => {
      closeModal();
    }
  });

  const [shareModelPlan, { loading }] = useMutation(CreateShareModelPlan);

  // Return an object containing the contents of all readonly task list sections
  const AllReadonlyComponents = ReadOnlyComponents(modelID, false);

  // Readonly section that do not need to be rendered in PDF
  const excludedComponents: string[] = [
    'team',
    'discussions',
    'documents',
    'crs-and-tdl',
    'it-solutions'
  ];

  // Composes components to render to PDF
  // Can either be all readonly sections, or individual filter group component views
  const ComponentToPrint: JSX.Element = (
    <div className="mint-only-print" ref={componentRef}>
      <PDFSummary
        filteredView={filteredGroup === 'all' ? undefined : filteredGroup}
      />
      <GridContainer className="padding-x-8 margin-top-4">
        {filteredGroup && filteredGroup !== 'all' ? (
          // Filter view component
          <BodyContent modelID={modelID} filteredView={filteredGroup} />
        ) : (
          // All model plan sections
          <>
            {Object.keys(AllReadonlyComponents)
              .filter(
                component => !excludedComponents.includes(component as string)
              )
              .map((component, index) => (
                <div
                  key={component}
                  className={classNames('page-break', {
                    'margin-top-6': index !== 0
                  })}
                >
                  {AllReadonlyComponents[component].component}
                </div>
              ))}
          </>
        )}
      </GridContainer>
    </div>
  );

  // Custom modal navigation for Share/Export
  const primaryLinks = navElement.map(route => (
    <div className="mint-nav margin-left-neg-2" key={route}>
      <Button
        type="button"
        className="mint-nav__link padding-bottom-0 padding-top-2 margin-x-1 padding-x-1 share-export-modal__nav usa-button--unstyled position-relative width-auto"
        onClick={() => setIsActive(route)}
        data-testid={`${route}-button`}
      >
        <em
          className={classNames(
            'usa-logo__text mint-nav__label padding-bottom-2',
            {
              'share-export-modal__active': isActive === route
            }
          )}
          aria-label={generalReadOnlyT(`modal.${route}`)}
        >
          {generalReadOnlyT(`modal.${route}`)}
        </em>
      </Button>
    </div>
  ));

  const FilterGroupSelect = ({ id }: { id: string }) => {
    return (
      <ComboBox
        ref={comboboxRef}
        id={id}
        name="filterGroup"
        onChange={value => {
          if (value !== 'all') {
            setExportCSV(false);
          }
          setFilteredGroup(value as FitlerGroup);
        }}
        defaultValue={filteredGroup}
        options={[
          {
            value: 'all',
            label: generalReadOnlyT('modal.allModels')
          },
          ...groupOptions
        ]}
      />
    );
  };

  const ShareForm = (
    <div data-testid={`${modalElementId}-share-form`}>
      <Form
        className={`${modalElementId}__form`}
        onSubmit={e => {
          e.preventDefault();
          const viewFilter =
            filteredGroup && filteredGroup !== 'all'
              ? (filteredGroup.toUpperCase() as ModelViewFilter)
              : undefined;

          // Converts comma-separated string into an array of trimmed email strings
          const receiverEmailsArray: string[] = receiverEmails
            .split(',')
            .map(email => email.trim());

          shareModelPlan({
            variables: {
              modelPlanID: modelID,
              viewFilter,
              receiverEmails: receiverEmailsArray,
              optionalMessage
            }
          })
            .then(response => {
              if (!response?.errors) {
                setStatusMessage({
                  message: generalReadOnlyT('modal.shareSuccess'),
                  status: 'success'
                });
                closeModal();
              } else {
                setStatusMessage({
                  message: generalReadOnlyT('modal.shareError'),
                  status: 'error'
                });
              }
            })
            .catch(() => {
              setStatusMessage({
                message: generalReadOnlyT('modal.shareError'),
                status: 'error'
              });
            });
        }}
      >
        <div className="filter-view__body display-block padding-3 padding-x-4">
          <h3 className="margin-bottom-05 margin-top-0">
            {generalReadOnlyT('modal.sharePlan')}
          </h3>

          <p className="margin-top-0 margin-bottom-3 text-base line-height-sans-2">
            {generalReadOnlyT('modal.shareDescription')}
          </p>

          <Alert
            type="info"
            className="margin-top-0 margin-bottom-3 text-base line-height-sans-2"
          >
            {generalReadOnlyT('modal.shareInfo')}
          </Alert>

          {/* Filter group select */}
          <Label
            htmlFor={`${modalElementId}-filter-group`}
            className="margin-y-0 text-normal"
          >
            {generalReadOnlyT('modal.shareSelectInfo')}
          </Label>

          <FilterGroupSelect id={`${modalElementId}-share-filter-group`} />

          {/* Email address recipient textarea */}
          <FieldGroup className="margin-top-4">
            <Label htmlFor="share-model-recipients" className="text-normal">
              {generalReadOnlyT('modal.shareEmail')} <RequiredAsterisk />
            </Label>

            <p className="text-base margin-y-1">
              {generalReadOnlyT('modal.shareEmailInfo')}
            </p>

            <OktaMultiSelect
              id="share-model-recipients"
              ariaLabel={generalReadOnlyT('modal.shareEmail')}
              name="receiverEmails"
              options={[]}
              selectedLabel={generalReadOnlyT('modal.shareLabel')}
              onChange={(users: any) => {
                setReceiverEmails(users);
              }}
            />
          </FieldGroup>

          {/* Optional message textarea */}
          <FieldGroup className="margin-top-4">
            <Label
              htmlFor="share-model-optional-message"
              className="text-normal"
            >
              {generalReadOnlyT('modal.shareOptional')}
            </Label>

            <TextAreaField
              className="share-export-modal__optional-message-textarea"
              id="share-model--optional-message"
              name="receiverEmails"
              onBlur={() => null}
              onChange={e => setOptionalMessage(e.currentTarget.value)}
              value={optionalMessage}
            />
          </FieldGroup>
        </div>

        {/* Cancel/Export */}
        <ButtonGroup className="display-flex flex-justify border-top-2px border-base-lighter padding-x-4 padding-y-105 margin-top-4 margin-x-0">
          <Button
            type="button"
            className="usa-button--unstyled margin-top-0 display-flex flex-justify-center"
            onClick={() => {
              const filterParam: string =
                filteredGroup && filteredGroup !== 'all'
                  ? `?filter-view=${filteredGroup}`
                  : '';

              navigator.clipboard.writeText(
                `${window.location.origin}/models/${modelID}/read-only${filterParam}`
              );
            }}
          >
            <IconLink className="margin-right-1" />
            {filteredGroup && filteredGroup !== 'all'
              ? generalReadOnlyT('modal.copyLinkFilteredReadView')
              : generalReadOnlyT('modal.copyLinkReadView')}
          </Button>

          <div className="display-flex">
            <Button
              type="button"
              className="usa-button--unstyled padding-2 margin-top-0 display-flex flex-justify-center"
              onClick={() => closeModal()}
            >
              {generalReadOnlyT('modal.cancel')}
            </Button>
            <Button
              type="submit"
              data-testid="export-model-plan"
              disabled={!filteredGroup || !receiverEmails || loading}
              className="margin-top-0"
            >
              {generalReadOnlyT('modal.share')}
            </Button>
          </div>
        </ButtonGroup>
      </Form>
    </div>
  );

  const ExportForm = (
    <div data-testid={`${modalElementId}-export-form`}>
      <Form
        className={`${modalElementId}__form`}
        onSubmit={e => {
          e.preventDefault();
          if (exportPDF) {
            handlePrint();
          }
          if (exportCSV) {
            fetchSingleData(modelID);
          }
        }}
      >
        <div className="filter-view__body display-block padding-3 padding-x-4">
          <h3 className="margin-bottom-05 margin-top-0">
            {generalReadOnlyT('modal.exportPlan')}
          </h3>

          <p className="margin-top-0 margin-bottom-3 text-base line-height-sans-2">
            {generalReadOnlyT('modal.exportInfo')}
          </p>

          {/* Filter group select */}
          <Label
            htmlFor={`${modalElementId}-filter-group`}
            className="margin-y-0 text-normal"
          >
            {generalReadOnlyT('modal.exportSelectInfo')}
          </Label>

          <FilterGroupSelect id={`${modalElementId}-export-filter-group`} />

          {/* Checkbox File type select */}
          <Label
            htmlFor={`${modalElementId}-file-type`}
            className="margin-bottom-0 margin-top-3 text-normal"
          >
            {generalReadOnlyT('modal.exportSelectFormat')}
          </Label>

          {FileTypes.map((file: typeof FileTypes[number]) => (
            <CheckboxField
              key={file}
              id={`${modalElementId}-file-type-${file}`}
              testid={`${modalElementId}-file-type-${file}`}
              name={file}
              label={generalReadOnlyT(`modal.exportFormats.${file}`)}
              value={file}
              checked={file === 'csv' ? exportCSV : exportPDF}
              onBlur={() => null}
              disabled={
                file === 'csv' && !!filteredGroup && filteredGroup !== 'all'
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (file === 'csv') {
                  setExportCSV(!exportCSV);
                } else {
                  setExportPDF(!exportPDF);
                }
              }}
            />
          ))}
        </div>

        {/* Cancel/Export */}
        <ButtonGroup className="display-flex flex-justify border-top-2px border-base-lighter padding-x-4 padding-y-105 margin-top-4 margin-x-0">
          <Button
            type="button"
            className="usa-button--unstyled margin-top-0 display-flex flex-justify-center"
            onClick={() => closeModal()}
          >
            {generalReadOnlyT('modal.cancel')}
          </Button>

          <Button
            type="submit"
            data-testid="export-model-plan"
            disabled={!filteredGroup || (!exportCSV && !exportPDF)}
            className="margin-top-0"
          >
            {generalReadOnlyT('modal.export')}
          </Button>
        </ButtonGroup>
      </Form>
    </div>
  );

  return (
    <div
      id={modalElementId}
      className="share-export-modal radius-md"
      aria-labelledby={`${modalElementId}-heading`}
      aria-describedby={`${modalElementId}-description`}
    >
      {ComponentToPrint}

      {/* Modal Navigation */}
      <nav
        aria-label={generalReadOnlyT('label')}
        data-testid="share-export-navigation-bar"
        className="border-base-lighter display-flex width-full padding-x-4 border-bottom-2px"
      >
        {primaryLinks}

        <button
          type="button"
          className="mint-modal__x-button text-base margin-right-0 margin-y-1 right-neg-1 position-relative"
          aria-label="Close Modal"
          onClick={closeModal}
        >
          <IconClose size={4} />
        </button>
      </nav>

      {/* Render share or export form */}
      <div>{isActive === 'share' ? ShareForm : ExportForm}</div>
    </div>
  );
};

export default ShareExportModal;
