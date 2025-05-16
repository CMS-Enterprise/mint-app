import i18n from 'config/i18n';
import { useGetMtoCategoriesQuery } from 'gql/generated/graphql';

type SelectProps = {
  value: string;
  label: string;
};

const selectOptions: SelectProps[] = [
  {
    value: 'default',
    label: i18n.t('modelToOperationsMisc:modal.category.selectOptions.default')
  },
  {
    value: 'none',
    label: i18n.t('modelToOperationsMisc:modal.category.selectOptions.none')
  }
];

const useFormatMTOCategories = ({
  modelID,
  primaryCategory,
  hideUncategorized = true,
  customCategory = false
}: {
  modelID: string;
  primaryCategory: string;
  hideUncategorized?: boolean;
  customCategory?: boolean;
}) => {
  const { data, loading } = useGetMtoCategoriesQuery({
    variables: { id: modelID }
  });
  // Get categories from the data
  const categories = data?.modelPlan?.mtoMatrix?.categories || [];

  const noUncategorized = hideUncategorized
    ? categories.filter(category => category.name !== 'Uncategorized')
    : categories;

  // Map categories to select options
  const mappedCategories: SelectProps[] = noUncategorized.map(category => ({
    value: category.id,
    label: category.name
  }));

  // Combine select options and mapped categories
  const selectOptionsAndMappedCategories: SelectProps[] = [
    // only get the default option of selectOptions
    selectOptions[0],
    ...(customCategory ? [selectOptions[1]] : []),
    ...mappedCategories
  ];

  const getSubcategoryByPrimaryCategoryName = (id: string) => {
    const result = categories.find(item => item.id === id);
    return result ? result.subCategories : [];
  };

  const mappedSubcategories: SelectProps[] =
    getSubcategoryByPrimaryCategoryName(primaryCategory).map(subcategory => ({
      value: subcategory.id,
      label: subcategory.name
    }));

  return {
    selectOptions,
    selectOptionsAndMappedCategories,
    mappedSubcategories,
    loading
  };
};

export default useFormatMTOCategories;
