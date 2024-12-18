import React from 'react';
import { useTranslation } from 'react-i18next';

const RemoveCategoryForm = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  return (
    <>
      <p>{t('modal.remove.category.copy')}</p>
      <button type="button">cancel baby</button>
    </>
  );
};

export default RemoveCategoryForm;
