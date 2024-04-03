import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type MutationErrorModalType = {
  isOpen: boolean;
  closeModal: () => void;
  // unblock: any;
  url: string;
};

const MutationErrorModal = ({
  isOpen,
  closeModal,
  // unblock,
  url
}: MutationErrorModalType) => {
  const { t: generalT } = useTranslation('general');

  const history = useHistory();

  //   console.log(unblock);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      className="external-link-modal maxw-mobile-lg"
    >
      {/* <PageHeading
        headingLevel="h3"
        className="margin-top-neg-2 margin-bottom-2"
      >
        {externalT('heading')}
      </PageHeading>

      <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-1">
        {externalT('redirectingCopy')}
      </p>
      <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-1 text-base-dark">
        “{hostname}”
      </p>

      <p className="font-body-md margin-top-0 margin-bottom-1 line-height-sans-4">
        {externalT('notConfident')}
      </p>

      <div className="margin-bottom-3">
        <Button
          type="button"
          className="margin-bottom-1"
          unstyled
          onClick={() => setShowFullUrl(!showFullUrl)}
        >
          <span
            className={`display-flex flex-align-center ${
              showFullUrl ? 'text-bold' : ''
            }`}
          >
            {showFullUrl ? <Icon.ExpandMore /> : <Icon.NavigateNext />}
            {externalT('viewFullURL')}
          </span>
        </Button>

        {showFullUrl && (
          <div className="margin-left-05 border-left-05 border-base-dark">
            <p
              className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-1 margin-left-1"
              style={{ overflowWrap: 'break-word' }}
            >
              {url}
            </p>
          </div>
        )}
      </div> */}

      <Button
        type="button"
        className="margin-left-2"
        unstyled
        onClick={() => {
          closeModal();
        }}
      >
        Stay on page
      </Button>

      <Button
        type="button"
        className="margin-left-2"
        unstyled
        onClick={() => {
          // if (unblock) unblock();
          closeModal();
          history.push(url);
        }}
      >
        Leave this page
      </Button>
    </Modal>
  );
};

export default MutationErrorModal;
