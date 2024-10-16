import React from 'react';
import { useTranslation } from 'react-i18next';

const FormPageHeader = ({
  header,
  currentPage,
  totalPages
}: {
  header: string;
  currentPage: number;
  totalPages: number;
}) => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  return (
    <div className="margin-bottom-2 line-height-normal">
      <h2 className="margin-0 margin-right-2 display-inline">{header}</h2>
      <div className="mint-body-large text-base display-inline">
        {miscellaneousT('pageOf', {
          currentPage,
          totalPages
        })}
      </div>
    </div>
  );
};

export default FormPageHeader;
