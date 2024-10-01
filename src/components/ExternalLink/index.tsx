import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type ExternalLinkModalTypes = {
  children: React.ReactNode;
  href: string;
  variant?: 'external' | 'unstyled' | 'nav';
  asButton?: boolean;
  className?: string;
  toEchimp?: boolean;
  inlineText?: boolean;
};

const ExternalLink = ({
  children,
  href,
  variant,
  asButton,
  className,
  toEchimp,
  inlineText = false
}: ExternalLinkModalTypes) => {
  const { t: externalT } = useTranslation('externalLinkModal');

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        className="external-link-modal maxw-mobile-lg height-auto"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-3 margin-bottom-2"
        >
          {externalT('heading')}
        </PageHeading>

        <p
          className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-4"
          style={{ whiteSpace: 'break-spaces' }}
        >
          {toEchimp ? externalT('descriptionEchimp') : externalT('description')}
        </p>

        <Link
          href={href}
          aria-label={
            toEchimp ? externalT('continueEchimp') : externalT('continueButton')
          }
          target="_blank"
          rel="noopener noreferrer"
          className="usa-button text-white text-no-underline"
          onClick={() => setIsModalOpen(false)}
          variant={variant}
        >
          {toEchimp ? externalT('continueEchimp') : externalT('leave')}
        </Link>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          {externalT('return')}
        </Button>
      </Modal>

      {inlineText ? (
        <span
          className={classNames(className, 'usa-link pointer margin-right-2')}
          role="button"
          tabIndex={0}
          onClick={() => {
            setIsModalOpen(true);
          }}
          onKeyPress={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsModalOpen(true);
            }
          }}
        >
          <span>
            {children}
            <Icon.Launch className="margin-left-05 top-05" />
          </span>
        </span>
      ) : (
        <Button
          type="button"
          unstyled={!asButton}
          className={classNames(className, 'margin-right-2')}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <span>
            {children}
            <Icon.Launch className="margin-left-05 top-05" />
          </span>
        </Button>
      )}
    </>
  );
};

export default ExternalLink;
