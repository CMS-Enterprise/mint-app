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
  Label,
  ModalRef,
  ModalToggleButton,
  PrimaryNav
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import { ReadOnlyComponents } from 'views/ModelPlan/ReadOnly';
import BodyContent from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent';
import { filterGroups } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';
import { groupOptions } from 'views/ModelPlan/ReadOnly/_components/FilterView/util';

import ShareExportHeader from '.';

import './index.scss';

const navElement = ['share', 'export'] as const;

type FitlerGroup = typeof filterGroups[number] | '';

type ShareExportModalProps = {
  modelID: string;
  closeModal: () => void;
  filteredView?: typeof filterGroups[number];
} & JSX.IntrinsicElements['button'];

/**
 * Modal for sharing/exporting a model plan
 */
function ShareExportModal({
  modelID,
  closeModal,
  filteredView
}: ShareExportModalProps) {
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const [filteredGroup, setFilteredGroup] = useState<FitlerGroup>(
    filteredView as FitlerGroup
  );

  const [isActive, setIsActive] = useState<typeof navElement[number]>('share');

  const modalElementId = 'share-export-modal';

  const componentRef = useRef<HTMLDivElement>(null);

  const comboboxRef = useRef<ComboBoxRef>(null);

  useEffect(() => {
    setFilteredGroup(filteredView as FitlerGroup);
  }, [filteredView]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Model Plan'
    // onAfterPrint: () => {
    //   comboboxRef.current?.clearSelection();
    //   setFilteredGroup('');
    // }
  });

  const AllReadonlyComponents = ReadOnlyComponents(modelID, false);

  const excludedComponents: string[] = [
    'team',
    'discussions',
    'documents',
    'crs-and-tdl',
    'it-solutions'
  ];

  const ComponentToPrint: JSX.Element = (
    <div className="display-none mint-only-print" ref={componentRef}>
      <ShareExportHeader
        filteredView={filteredGroup === '' ? undefined : filteredGroup}
      />
      <GridContainer className="padding-x-8 margin-top-4">
        {filteredView ? (
          <BodyContent modelID={modelID} filteredView={filteredView} />
        ) : (
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

  const primaryLinks = navElement.map(route => (
    <div className="mint-nav" key={route}>
      <Button
        type="button"
        className="mint-nav__link padding-bottom-0 padding-top-2 share-export-modal__nav"
        onClick={() => setIsActive(route)}
      >
        <em
          className={classNames(
            'usa-logo__text mint-nav__label padding-bottom-2 share-export-modal__nav',
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
    <div>
      <div data-testid="filter-view-modal">
        <div className="filter-view__body">
          <h3 className="margin-bottom-05 margin-top-0">
            {generalReadOnlyT('modal.exportPlan')}
          </h3>
          <p className="margin-top-0 font-body-md text-base line-height-sans-2">
            {generalReadOnlyT('modal.exportInfo')}
          </p>

          <Form
            className="maxw-none margin-top-3"
            onSubmit={e => {
              e.preventDefault();
              handlePrint();
            }}
          >
            <Label
              htmlFor="export-filter-group"
              className="margin-y-0 text-normal"
            >
              {generalReadOnlyT('modal.exportSelectInfo')}
            </Label>

            <ComboBox
              ref={comboboxRef}
              id="export-filter-group"
              name="filterGroup"
              onChange={value => {
                setFilteredGroup(value as FitlerGroup);
              }}
              defaultValue={filteredGroup || ''}
              options={groupOptions}
            />

            <ButtonGroup className="display-flex flex-justify">
              <Button
                type="button"
                className="usa-button--unstyled"
                onClick={() => closeModal()}
              >
                {generalReadOnlyT('modal.cancel')}
              </Button>

              <Button type="submit" disabled={false}>
                {generalReadOnlyT('modal.export')}
              </Button>
            </ButtonGroup>
          </Form>
        </div>
      </div>
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

      <nav
        aria-label={generalReadOnlyT('label')}
        data-testid="share-export-navigation-bar"
        className="border-base-lighter display-flex width-full padding-x-4 border-bottom-2px"
      >
        <PrimaryNav
          aria-label={generalReadOnlyT('label')}
          items={primaryLinks}
        />

        <button
          type="button"
          className="mint-modal__x-button text-base margin-right-0 margin-y-1"
          aria-label="Close Modal"
          onClick={closeModal}
        >
          <IconClose size={3} />
        </button>
      </nav>

      <div className="display-block padding-3 padding-x-4">{ExportForm}</div>
    </div>
  );
}

export default ShareExportModal;
