import React from 'react';
import { useTranslation } from 'react-i18next';

type DocumentsCardType = {
  documents: DocumentType[];
  modelID: string;
};

const DocumentsCard = ({ documents, modelID }: DocumentsCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  return <div>DocumentsCard</div>;
};

export default DocumentsCard;
