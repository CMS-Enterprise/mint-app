import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

interface ExternalLinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

const ExternalLink = ({ children, className, href }: ExternalLinkProps) => {
  const { t } = useTranslation('general');

  return (
    <Link
      href={href}
      aria-label={t('newTab')}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      variant="external"
    >
      {children}
    </Link>
  );
};

export default ExternalLink;
