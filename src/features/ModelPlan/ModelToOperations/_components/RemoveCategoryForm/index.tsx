// import React, { useContext } from 'react';
// import { useTranslation } from 'react-i18next';

// import { MTOModalContext } from 'contexts/MTOModalContext';
// import useCheckResponsiveScreen from 'hooks/useCheckMobile';
// import useMessage from 'hooks/useMessage';

// const RemoveCategoryForm = () => {
//   const { t } = useTranslation('modelToOperationsMisc');
//   const {
//     categoryID,
//     subCategoryID,
//     categoryName,
//     resetCategoryAndSubCategoryID
//   } = useContext(MTOModalContext);
//   const { showMessage, showErrorMessageInModal, clearMessage } = useMessage();
//   const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

//   const [deleteMtoCategoryMutation, { data, loading, error }] =
//     useDeleteMtoCategoryMutation({});

//   return (
//     <>
//       <p>{t('modal.remove.category.copy')}</p>
//       <button type="button">cancel baby</button>
//     </>
//   );
// };

// export default RemoveCategoryForm;
