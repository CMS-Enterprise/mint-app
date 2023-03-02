import React from 'react';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

export interface BreadcrumbsProps {
  className?: string;
  items: {
    text: string;
    url?: string;
  }[];
}

/**
 * Generate a `BreadcrumbBar` from links.
 */

const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  return (
    <BreadcrumbBar variant="wrap" className={classNames(className)}>
      {items.map((link, idx) => {
        if (idx === items.length - 1) {
          return (
            <Breadcrumb key={link.text} current>
              <span>{link.text}</span>
            </Breadcrumb>
          );
        }
        return (
          <Breadcrumb key={link.text}>
            <BreadcrumbLink asCustom={UswdsReactLink} to={link.url!}>
              <span>{link.text}</span>
            </BreadcrumbLink>
          </Breadcrumb>
        );
      })}
    </BreadcrumbBar>
  );
};

export default Breadcrumbs;
