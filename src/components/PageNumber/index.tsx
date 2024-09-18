import React from 'react';
import classnames from 'classnames';

import './index.scss';

type PageNumberProps = {
  className?: string;
  currentPage: number;
  totalPages: number;
};

const PageNumber = ({
  className,
  currentPage,
  totalPages
}: PageNumberProps) => {
  const classNames = classnames('mint-page-number', className);
  return (
    <div className={classNames} data-testid="page-num">
      <span className="mint-page-number__page-num">
        {`Page ${currentPage} of ${totalPages}`}
      </span>
    </div>
  );
};

export default PageNumber;
