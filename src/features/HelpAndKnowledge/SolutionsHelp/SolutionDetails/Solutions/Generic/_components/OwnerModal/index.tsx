import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { SolutionSystemOwnerType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import OwnerForm from '../OwnerForm';

// Matching keys in mtoCommonSolutionSystemOwnerMisc
export type ModeType = 'addSystemOwner' | 'editSystemOwner';

const OwnerModal = ({
  isModalOpen,
  closeModal,
  mode,
  owner
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  mode: ModeType;
  owner?: SolutionSystemOwnerType;
}) => {
  const { t } = useTranslation('mtoCommonSolutionSystemOwnerMisc');
  const { t: miscT } = useTranslation('mtoCommonSolutionSystemOwnerMisc');

  const [disabledSubmitBtn, setDisableSubmitBtn] = useState(true);

  return (
    <Modal
      isOpen={isModalOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {t(`${mode}.title`)}
        </PageHeading>
        <p className="text-base margin-y-1">
          <Trans
            i18nKey={t('allFieldsRequired')}
            components={{
              s: <span className="text-error" />
            }}
          />
        </p>
      </div>

      <OwnerForm
        mode={mode}
        closeModal={closeModal}
        owner={owner}
        setDisableButton={setDisableSubmitBtn}
      />

      <div className="margin-top-2 display-flex mint-modal__footer">
        <Button
          form="owner-form"
          type="submit"
          className="margin-right-3 margin-top-0"
          disabled={disabledSubmitBtn}
        >
          {miscT(`${mode}.cta`)}
        </Button>
        <Button
          type="button"
          className="margin-top-0"
          unstyled
          onClick={closeModal}
        >
          {miscT('cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default OwnerModal;
