import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  Button,
  ButtonGroup,
  GridContainer,
  Modal,
  ModalFooter,
  ModalHeading,
  ModalRef,
  ModalToggleButton,
  PrimaryNav
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import { ReadOnlyComponents } from 'views/ModelPlan/ReadOnly';
import BodyContent from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent';
import { filterGroups } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';

import ShareExportHeader from '.';

import './index.scss';

type ShareExportModalButtonProps = {
  modalRef: React.RefObject<ModalRef>;
  link?: boolean;
} & JSX.IntrinsicElements['button'];

export const ShareExportModalOpener = ({
  modalRef,
  link,
  className,
  children,
  ...buttonProps
}: ShareExportModalButtonProps) => {
  return (
    <Button
      {...buttonProps}
      type="button"
      className={classNames(
        {
          'usa-button--outline text-white shadow-none border-white border-2px': !link
        },
        { 'usa-button--unstyled': link },
        className
      )}
      onClick={e => {
        modalRef.current?.toggleModal(e, true);
      }}
    >
      {children}
    </Button>
  );
};

const navElement = ['share', 'export'] as const;

type ShareExportModalProps = {
  modalRef: React.RefObject<ModalRef>;
  modelID: string;
  filteredView?: typeof filterGroups[number];
} & JSX.IntrinsicElements['button'];

/**
 * Modal for sharing/exporting a model plan
 * Used in conjuction with `<ShareExportModalOpener />`.
 */
function ShareExportModal({
  modalRef,
  modelID,
  filteredView
}: ShareExportModalProps) {
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const [isActive, setIsActive] = useState<typeof navElement[number]>('share');

  const modalElementId = 'share-export-modal';

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Model Plan'
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
      <ShareExportHeader filteredView={filteredView} />
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
      <ModalHeading
        id={`${modalElementId}-heading`}
        className={`margin-bottom-2 ${modalElementId}__heading`}
      >
        {generalReadOnlyT('modal.exportPlan')}
      </ModalHeading>

      <p className="margin-top-0 text-base">
        {generalReadOnlyT('modal.exportInfo')}
      </p>
    </div>
  );

  return (
    <Modal
      ref={modalRef}
      id={modalElementId}
      className="share-export-modal radius-md maxw-tablet"
      aria-labelledby={`${modalElementId}-heading`}
      aria-describedby={`${modalElementId}-description`}
    >
      {ComponentToPrint}

      <nav
        aria-label={generalReadOnlyT('label')}
        data-testid="share-export-navigation-bar"
        className="border-base-lighter display-flex width-full padding-x-3 border-bottom-2px"
      >
        <PrimaryNav
          aria-label={generalReadOnlyT('label')}
          items={primaryLinks}
        />
      </nav>

      <div className="display-block padding-3">
        {ExportForm}

        <ModalFooter>
          <ButtonGroup className="display-flex flex-justify">
            <ModalToggleButton
              modalRef={modalRef}
              closer
              unstyled
              className="padding-105 text-center padding-x-0"
            >
              {generalReadOnlyT('modal.cancel')}
            </ModalToggleButton>

            <Button
              type="button"
              data-close-modal="true"
              disabled={false}
              onClick={handlePrint}
            >
              {generalReadOnlyT('modal.export')}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </div>
    </Modal>
  );
}

export default ShareExportModal;
