import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import useMessage from 'hooks/useMessage';

const ModelMilestoneForm = ({ closeModal }: { closeModal: () => void }) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();
  const { message, showMessage, clearMessage } = useMessage();

  return <div>ModelMilestoneForm</div>;
};

export default ModelMilestoneForm;
