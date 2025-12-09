import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { GetIndividualKeyContactQuery } from 'gql/generated/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import SmeForm from '../SmeForm';

export type smeModeType = 'addWithCategory' | 'addWithoutCategory' | 'edit';

export type KeyContactType = GetIndividualKeyContactQuery['keyContact'];

const SmeModal = ({
  isOpen,
  closeModal,
  mode,
  contact,
  categoryId
}: {
  isOpen: boolean;
  closeModal: () => void;
  mode: smeModeType;
  contact?: KeyContactType;
  categoryId?: string;
}) => {
  const { t: keyContactMiscT } = useTranslation('keyContactMisc');

  const [disabledSubmitBtn, setDisableSubmitBtn] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {keyContactMiscT(mode === 'edit' ? 'edit.heading' : 'add.heading')}
        </PageHeading>
        <p className="text-base margin-y-1">
          <Trans
            i18nKey={keyContactMiscT('allFieldsRequired')}
            components={{
              s: <span className="text-error" />
            }}
          />
        </p>
      </div>

      <SmeForm
        mode={mode}
        closeModal={closeModal}
        sme={contact}
        categoryId={categoryId}
        setDisableButton={setDisableSubmitBtn}
      />

      <div className="margin-top-2 display-flex mint-modal__footer">
        <Button
          form="sme-form"
          type="submit"
          disabled={disabledSubmitBtn}
          className="margin-right-3 margin-top-0"
        >
          {keyContactMiscT(`${mode === 'edit' ? 'edit' : 'add'}.cta`)}
        </Button>
        <Button
          type="button"
          className="margin-top-0 deep-underline"
          unstyled
          onClick={closeModal}
        >
          {keyContactMiscT('cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default SmeModal;
