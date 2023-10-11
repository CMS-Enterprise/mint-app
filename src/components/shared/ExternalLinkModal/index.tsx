import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  IconExpandMore,
  IconNavigateNext
} from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type ExternalLinkModalTypes = {
  isOpen: boolean;
  closeModal: () => void;
  url: string;
};

const ExternalLinkModal = ({
  isOpen,
  closeModal,
  url
}: ExternalLinkModalTypes) => {
  const { t: externalT } = useTranslation('externalLinkModal');
  const [showFullUrl, setShowFullUrl] = useState(false);

  const hostname = url !== '' && new URL(url).hostname;

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      className="external-link-modal maxw-mobile-lg"
    >
      <PageHeading
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
            {showFullUrl ? <IconExpandMore /> : <IconNavigateNext />}
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
      </div>

      <Button type="button" onClick={() => {}}>
        {externalT('continueButton')}
      </Button>

      <Button
        type="button"
        className="margin-left-2"
        unstyled
        onClick={closeModal}
      >
        {externalT('returnButton')}
      </Button>
    </Modal>
  );
};

export default ExternalLinkModal;
