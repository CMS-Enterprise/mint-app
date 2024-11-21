import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetMtoCategoriesQuery } from 'gql/generated/graphql';

import useMessage from 'hooks/useMessage';

import { selectOptions } from '../CategoryForm';

const ModelMilestoneForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();
  const { message, showMessage, clearMessage } = useMessage();

  const { data, loading } = useGetMtoCategoriesQuery({
    variables: { id: modelID }
  });
  // Get categories from the data
  const categories = data?.modelPlan?.mtoMatrix?.categories || [];

  // Map categories to sort options
  const mappedCategories: SelectProps[] = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  // Combine sort options and mapped categories
  const selectOptionsAndMappedCategories: SelectProps[] = [
    ...selectOptions,
    ...mappedCategories
  ];

  // Variables for the form
  const methods = useForm<FormValues>({
    defaultValues: {
      primaryCategory: 'default',
      name: ''
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid }
  } = methods;

  return <div>ModelMilestoneForm</div>;
};

export default ModelMilestoneForm;
