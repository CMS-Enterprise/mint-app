import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
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
  Icon,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { ReadOnlyComponents } from 'features/ModelPlan/ReadOnly';
import BodyContent from 'features/ModelPlan/ReadOnly/_components/FilterView/BodyContent';
import { FilterGroup } from 'features/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';
import {
  filterGroupParams,
  groupOptions
} from 'features/ModelPlan/ReadOnly/_components/FilterView/util';
import { StatusMessageType } from 'features/ModelPlan/TaskList';
import { ModelShareSection, ModelViewFilter } from 'gql/generated/graphql';
import CreateShareModelPlan from 'gql/operations/ShareExport/CreateShareModelPlan';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import FieldGroup from 'components/FieldGroup';
import OktaMultiSelect from 'components/OktaUserSelect/multiSelect';
import RequiredAsterisk from 'components/RequiredAsterisk';
import TextAreaField from 'components/TextAreaField';
import { ModelInfoContext } from 'contexts/ModelInfoContext';
import { PrintPDFContext } from 'contexts/PrintPDFContext';
import useFetchCSVData from 'hooks/useFetchCSVData';

import PDFSummary from './pdfSummary';
import exportSectionOptions, {
  modelPlanSectionMappings,
  ModelSubSectionRouteKey
} from './util';

import './index.scss';

const navElement = ['share', 'export'] as const;

export type NavModelElemet = (typeof navElement)[number];

export type FitlerGroup = FilterGroup | ModelShareSection;

const FileTypes = ['csv', 'pdf'] as const;

type ShareExportModalProps = {
  modelID: string;
  closeModal: () => void;
  defaultTab?: NavModelElemet;
  filteredView?: FilterGroup | ModelShareSection | null;
  setStatusMessage: (message: StatusMessageType) => void;
} & JSX.IntrinsicElements['button'];

/**
 * Modal for sharing/exporting a model plan
 */
const ShareExportModal = ({
  modelID,
  closeModal,
  defaultTab = 'share',
  filteredView,
  setStatusMessage
}: ShareExportModalProps) => {
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const { setPrintPDF } = useContext(PrintPDFContext);

  const [exportSection, setExportSection] = useState<FitlerGroup>(
    (filteredView as FilterGroup) || ModelShareSection.ALL
  );

  const [exportCSV, setExportCSV] = useState<boolean>(false);
  const [exportPDF, setExportPDF] = useState<boolean>(false);

  const [usernames, setUsernames] = useState<string[]>([]);
  const [optionalMessage, setOptionalMessage] = useState<string>('');

  // State for modal navigation elements
  const [isActive, setIsActive] = useState<NavModelElemet>(defaultTab);

  const { fetchSingleData, setExportSection: setExportSectionForExport } =
    useFetchCSVData();

  const modalElementId: string = 'share-export-modal';

  // Used for react-to-pdf to render pdf from component ref
  const componentRef = useRef<HTMLDivElement>(null);

  // Filter group form ref
  const comboboxRef = useRef<ComboBoxRef>(null);

  // Sets the default combobox option to a filter view if already on a filter view readonly page
  useEffect(() => {
    if (filteredView) setExportSection(filteredView);
  }, [filteredView]);

  const { modelName } = useContext(ModelInfoContext);

  const modelNameFormatted = modelName.replace(/ /g, '_');

  const exportSectionFormatted = `-${exportSection.toUpperCase()}`;

  const exportFileName = `MINT-${modelNameFormatted}${exportSectionFormatted}.pdf`;

  // Submit handler for exporting PDF
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: exportFileName,
    onAfterPrint: () => {
      setPrintPDF(false);
      closeModal();
    }
  });

  const [shareModelPlan, { loading }] = useMutation(CreateShareModelPlan);

  // Return an object containing the contents of all readonly task list sections
  const AllReadonlyComponents = ReadOnlyComponents(modelID);

  // Readonly section that do not need to be rendered in PDF
  const excludedComponents: string[] = ['discussions'];

  // Composes components to render to PDF
  // Can either be all readonly sections, or individual filter group component views
  const ComponentToPrint: JSX.Element = (
    <div className="mint-only-print" ref={componentRef}>
      <PDFSummary
        filteredView={
          filterGroupParams.includes(exportSection) ? exportSection : undefined
        }
      />
      <GridContainer className="padding-x-8 margin-top-4">
        {exportSection && filterGroupParams.includes(exportSection) ? (
          // Filter view component
          <BodyContent modelID={modelID} filteredView={exportSection} />
        ) : (
          // All model plan sections
          <>
            {Object.keys(AllReadonlyComponents)
              .filter(
                component => !excludedComponents.includes(component as string)
              )
              // Filter out components that are not in the selected export section
              .filter(component =>
                modelPlanSectionMappings[
                  exportSection as ModelShareSection
                ].includes(component as ModelSubSectionRouteKey)
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
    <Button
      type="button"
      key={route}
      className="mint-nav__link share-export-modal__nav usa-button--unstyled position-relative width-fit-content margin-x-neg-2 padding-x-2 margin-bottom-neg-05 padding-bottom-05 display-flex flex-align-stretch"
      onClick={() => setIsActive(route)}
      data-testid={`${route}-button`}
    >
      <div
        className={classNames('display-flex', {
          'share-export-modal__active': isActive === route
        })}
      >
        <p
          className={classNames(
            'usa-logo__text mint-nav__label flex-align-self-center',
            {
              'text-base-dark': isActive !== route
            }
          )}
          aria-label={generalReadOnlyT(`modal.${route}`)}
        >
          {generalReadOnlyT(`modal.${route}`)}
        </p>
      </div>
    </Button>
  ));

  const FilterGroupSelect = ({ id }: { id: string }) => {
    return (
      <ComboBox
        ref={comboboxRef}
        id={id}
        name="filterGroup"
        onChange={value => {
          setExportSection(value as FitlerGroup);
        }}
        defaultValue={exportSection}
        options={[
          {
            value: 'section-export-label',
            label: generalReadOnlyT('modal.sections')
          },
          ...exportSectionOptions,
          {
            value: 'filter-export-label',
            label: generalReadOnlyT('modal.filteredViews')
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
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          const viewFilter =
            exportSection && filterGroupParams.includes(exportSection)
              ? (exportSection.toUpperCase() as ModelViewFilter)
              : undefined;

          const modelShareSection = !filterGroupParams.includes(exportSection)
            ? exportSection
            : undefined;

          // Send a share event to GA
          ReactGA.send({
            hitType: 'event',
            eventCategory: `share_model_plan_${exportSection}`,
            eventAction: 'click',
            eventLabel: `Share model plan ${viewFilter || ''}`
          });

          shareModelPlan({
            variables: {
              modelPlanID: modelID,
              viewFilter,
              modelShareSection:
                modelShareSection === ModelShareSection.ALL
                  ? ModelShareSection.MODEL_PLAN
                  : modelShareSection,
              usernames,
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
              name="usernames"
              selectedLabel={generalReadOnlyT('modal.shareLabel')}
              onChange={(users: any) => {
                setUsernames(users);
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
              name="optionalMessage"
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
                exportSection && filterGroupParams.includes(exportSection)
                  ? `?filter-view=${exportSection}`
                  : '';

              navigator.clipboard.writeText(
                `${window.location.origin}/models/${modelID}/read-view${filterParam}`
              );
            }}
          >
            <Icon.Link className="margin-right-1" aria-label="link" />
            {exportSection && filterGroupParams.includes(exportSection)
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
              disabled={!exportSection || !usernames || loading}
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
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (exportPDF) {
            // Send a export pdf event to GA
            ReactGA.send({
              hitType: 'event',
              eventCategory: 'export_model_plan_pdf',
              eventAction: 'click',
              eventLabel: 'Export model plan to PDF'
            });

            setPrintPDF(true);
            // PDF/Print doesn't pick up the useContext state change without setTimeout
            setTimeout(() => {
              handlePrint();
            }, 10);
          }
          if (exportCSV) {
            // Send a export csv event to GA
            ReactGA.send({
              hitType: 'event',
              eventCategory: `export_model_plan_csv_${exportSection}`,
              eventAction: 'click',
              eventLabel: `Export model plan to CSV ${exportSection.toUpperCase()}`
            });

            setExportSectionForExport(exportSection);
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

          {FileTypes.map((file: (typeof FileTypes)[number]) => (
            <CheckboxField
              key={file}
              id={`${modalElementId}-file-type-${file}`}
              testid={`${modalElementId}-file-type-${file}`}
              name={file}
              label={generalReadOnlyT(`modal.exportFormats.${file}`)}
              value={file}
              checked={file === 'csv' ? exportCSV : exportPDF}
              onBlur={() => null}
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
            disabled={!exportSection || (!exportCSV && !exportPDF)}
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
        className="border-base-lighter display-flex width-full padding-x-4 border-bottom-2px padding-top-05"
        style={{ gap: '2rem' }}
      >
        {primaryLinks}

        <button
          type="button"
          className="mint-modal__x-button text-base right-neg-2 position-relative"
          aria-label="Close Modal"
          onClick={closeModal}
        >
          <Icon.Close size={4} aria-label="close" />
        </button>
      </nav>

      {/* Render share or export form */}
      <div>{isActive === 'share' ? ShareForm : ExportForm}</div>
    </div>
  );
};

export default ShareExportModal;
