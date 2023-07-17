import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import {
  Button,
  ButtonGroup,
  ComboBox,
  ComboBoxRef,
  Form,
  GridContainer,
  IconClose,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import CheckboxField from 'components/shared/CheckboxField';
import { fetchCSVData as handleCSV } from 'utils/export/CsvExportLink';
import { ReadOnlyComponents } from 'views/ModelPlan/ReadOnly';
import BodyContent from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent';
import { filterGroups } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';
import { groupOptions } from 'views/ModelPlan/ReadOnly/_components/FilterView/util';

import PDFSummary from './pdfSummary';

import './index.scss';

const navElement = ['share', 'export'] as const;

type FitlerGroup = typeof filterGroups[number] | 'all';

const FileTypes = ['csv', 'pdf'] as const;

type ShareExportModalProps = {
  modelID: string;
  closeModal: () => void;
  filteredView?: typeof filterGroups[number] | 'all';
} & JSX.IntrinsicElements['button'];

/**
 * Modal for sharing/exporting a model plan
 */
const ShareExportModal = ({
  modelID,
  closeModal,
  filteredView
}: ShareExportModalProps) => {
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const [filteredGroup, setFilteredGroup] = useState<FitlerGroup>(
    filteredView as typeof filterGroups[number]
  );

  const [exportCSV, setExportCSV] = useState<boolean>(false);
  const [exportPDF, setExportPDF] = useState<boolean>(false);

  // State for modal navigation elements
  const [isActive, setIsActive] = useState<typeof navElement[number]>('share');

  const modalElementId = 'share-export-modal';

  // Used for react-to-pdf to render pdf from component ref
  const componentRef = useRef<HTMLDivElement>(null);

  const comboboxRef = useRef<ComboBoxRef>(null);

  // Sets the default combobox option to a filter view if already on a filter view readonly page
  useEffect(() => {
    if (filteredView) setFilteredGroup(filteredView);
  }, [filteredView]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: generalReadOnlyT('modal.documentTitle'),
    onAfterPrint: () => {
      closeModal();
    }
  });

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
    <div className="display-none mint-only-print" ref={componentRef}>
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

  const ExportForm = (
    <div data-testid={`${modalElementId}-form`}>
      <Form
        className={`${modalElementId}__form`}
        onSubmit={e => {
          e.preventDefault();
          if (exportPDF) {
            handlePrint();
          }
          if (exportCSV) {
            handleCSV(modelID);
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

          <ComboBox
            ref={comboboxRef}
            id={`${modalElementId}-filter-group`}
            name="filterGroup"
            onChange={value => {
              if (value !== 'all') {
                setExportCSV(false);
              }
              setFilteredGroup(value as FitlerGroup);
            }}
            defaultValue={filteredGroup || 'all'}
            options={[
              {
                value: 'all',
                label: generalReadOnlyT('modal.allModels')
              },
              ...groupOptions
            ]}
          />

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
              name={file}
              label={generalReadOnlyT(`modal.exportFormats.${file}`)}
              value={file}
              checked={file === 'csv' ? exportCSV : exportPDF}
              onBlur={() => null}
              disabled={
                file === 'csv' && filteredGroup && filteredGroup !== 'all'
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

      {/* Export from */}
      {/* TODO: toggle Share component once created */}
      <div>{ExportForm}</div>
    </div>
  );
};

export default ShareExportModal;
