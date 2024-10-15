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
    <div className="display-flex flex-align-center margin-bottom-2">
      <h2 className="margin-0 margin-right-2">{header}</h2>
      <div className="mint-body-large text-base">
        {miscellaneousT('pageOf', {
          currentPage,
          totalPages
        })}
      </div>
    </div>
  );
};

export default FormPageHeader;
