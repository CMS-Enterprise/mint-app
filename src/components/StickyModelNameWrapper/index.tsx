import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

const StickyModelNameWrapper = ({
  children,
  stickyHeaderRef,
  isStickyHeaderVisible,
  className
}: {
  children: React.ReactNode;
  stickyHeaderRef: React.RefObject<HTMLDivElement>;
  isStickyHeaderVisible: boolean;
  className?: string;
}) => {
  const { t: h } = useTranslation('generalReadOnly');
  return (
    <div
      ref={stickyHeaderRef}
      className={classNames('sticky-header-wrapper', className, {
        'sticky-header-wrapper--visible': isStickyHeaderVisible
      })}
      aria-hidden="true"
    >
      <GridContainer>
        <div className="display-flex flex-justify show-when-sticky">
          {children}

          <button
            type="button"
            className="usa-button usa-button--unstyled font-sans-sm display-flex flex-align-center show-when-sticky"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Icon.ArrowUpward size={3} aria-label="arrow up" />
            {h('backToTop')}
          </button>
        </div>
      </GridContainer>
    </div>
  );
};

export default StickyModelNameWrapper;
