import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

type ExternalLinkModalTypes = {
  children?: React.ReactNode;
  className?: string;
  href: string;
  variant?: 'external' | 'unstyled' | 'nav';
};

const ExternalLink = ({
  children,
  href,
  variant,
  className
}: ExternalLinkModalTypes) => {
  const { t: externalT } = useTranslation('externalLinkModal');

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick
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
          {externalT('description')}
        </p>

        <Link
          href={href}
          aria-label={externalT('continueButton')}
          target="_blank"
          rel="noopener noreferrer"
          className="usa-button text-white text-no-underline"
          onClick={() => setIsModalOpen(false)}
          variant={variant}
        >
          {externalT('leave')}
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

      <Button
        type="button"
        unstyled
        className={classNames(className, 'margin-right-05')}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <span>
          {children}
          <Icon.MailOutline className="margin-left-05 top-05" />
        </span>
      </Button>
    </>
  );
};

export default ExternalLink;
