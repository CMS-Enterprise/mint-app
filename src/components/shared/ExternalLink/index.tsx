import React from 'react';
import { Link } from '@trussworks/react-uswds';

interface ExternalLinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

const ExternalLink = ({ children, className, href }: ExternalLinkProps) => {
  return (
    <Link
      href={href}
      aria-label="Open in a new tab"
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
