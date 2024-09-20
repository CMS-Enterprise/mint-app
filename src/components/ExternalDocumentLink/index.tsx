import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import ExternalLink from '../ExternalLink';

type ExternalLinkModalTypes = {
  url: string;
  buttonText: string;
};

const ExternalDocumentLink = ({ url, buttonText }: ExternalLinkModalTypes) => {
  const { t: externalT } = useTranslation('externalLinkModal');
  const [showFullUrl, setShowFullUrl] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hostname = url !== '' && new URL(url).hostname;

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        className="external-link-modal maxw-mobile-lg"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-2"
        >
          {externalT('document.heading')}
        </PageHeading>

        <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-1">
          {externalT('document.redirectingCopy')}
        </p>
        <p className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-1 text-base-dark">
          “{hostname}”
        </p>

        <p className="font-body-md margin-top-0 margin-bottom-1 line-height-sans-4">
          {externalT('document.notConfident')}
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
              {externalT('document.viewFullURL')}
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

        <ExternalLink
          className="usa-button text-white"
          href={url}
          variant="unstyled"
        >
          {externalT('document.continueButton')}
        </ExternalLink>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => {
            setShowFullUrl(false);
            setIsModalOpen(false);
          }}
        >
          {externalT('document.returnButton')}
        </Button>
      </Modal>
      <Button
        type="button"
        unstyled
        className="margin-right-2"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <span className="display-flex flex-align-center">
          {buttonText}
          <Icon.Launch />
        </span>
      </Button>
    </>
  );
};

export default ExternalDocumentLink;
