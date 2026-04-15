import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { MtoCommonMilestone } from 'gql/generated/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Sidepanel from 'components/Sidepanel';

import CommonMilestoneForm from '../CommonMilestoneForm';

export type CommonMilestoneModalModeType =
  | 'addCommonMilestone'
  | 'editCommonMilestone';

export type CommonMilestoneType = Pick<
  MtoCommonMilestone,
  | 'name'
  | 'description'
  | 'categoryName'
  | 'subCategoryName'
  | 'facilitatedByRole'
  | 'facilitatedByOther'
  | 'commonSolutions'
>;

const CommonMilestoneSidePanel = ({
  isPanelOpen,
  closeModal,
  mode,
  commonMilestone
}: {
  isPanelOpen: boolean;
  closeModal: () => void;
  mode: CommonMilestoneModalModeType;
  commonMilestone?: CommonMilestoneType;
}) => {
  const { t: mtoCommonMilestoneMiscT } = useTranslation(
    'mtoCommonMilestoneMisc'
  );
  const { t: modelToOperationsMiscT } = useTranslation('modelToOperationsMisc');

  const submitted = useRef<boolean>(false);

  const [disabledSubmitBtn, setDisableSubmitBtn] = useState(true);

  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [leavePage, setLeavePage] = useState<boolean>(false);

  const closePanel = useCallback(() => {
    if (isDirty && !submitted.current) {
      setLeavePage(true);
    } else {
      closeModal();
    }
  }, [closeModal, isDirty]);

  const footer = (
    <div className="border-top-1px border-base-lighter padding-y-4 panel-footer">
      <Button
        form="common-milestone-form"
        type="submit"
        disabled={disabledSubmitBtn}
        className="margin-right-3 margin-top-0"
      >
        {mtoCommonMilestoneMiscT(`${mode}.cta`)}
      </Button>
      <Button
        type="button"
        className="margin-top-0"
        unstyled
        onClick={closePanel}
      >
        {mtoCommonMilestoneMiscT('cancel')}
      </Button>
    </div>
  );

  return (
    <>
      <Sidepanel
        testid="common-milestone-side-panel"
        isOpen={isPanelOpen}
        closeModal={closePanel}
        ariaLabel={mtoCommonMilestoneMiscT(`${mode}.heading`)}
        modalHeading={mtoCommonMilestoneMiscT(`${mode}.heading`)}
        footer={footer}
        fixed
        noScrollable
      >
        {mode === 'addCommonMilestone' && (
          <CommonMilestoneForm
            mode={mode}
            closeModal={closeModal}
            setDisableButton={setDisableSubmitBtn}
            setIsDirty={setIsDirty}
          />
        )}
      </Sidepanel>

      <Modal
        isOpen={leavePage && !submitted.current}
        closeModal={() => setLeavePage(false)}
        className="confirmation-modal"
        zTop
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {modelToOperationsMiscT('modal.editMilestone.leaveConfim.heading')}
        </PageHeading>

        <p className="margin-top-2 margin-bottom-3">
          {modelToOperationsMiscT(
            'modal.editMilestone.leaveConfim.description'
          )}
        </p>

        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => {
            setIsDirty(false);
            setLeavePage(false);
            closeModal();
          }}
        >
          {modelToOperationsMiscT('modal.editMilestone.leaveConfim.confirm')}
        </Button>

        <Button
          type="button"
          unstyled
          onClick={() => {
            setLeavePage(false);
          }}
        >
          {modelToOperationsMiscT('modal.editMilestone.leaveConfim.dontLeave')}
        </Button>
      </Modal>
    </>
  );
};

export default CommonMilestoneSidePanel;
