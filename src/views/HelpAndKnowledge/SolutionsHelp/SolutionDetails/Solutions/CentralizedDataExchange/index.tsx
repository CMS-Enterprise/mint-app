import React from 'react';
import { useTranslation } from 'react-i18next';

import { SolutionDetailProps } from '..';

export const CentralizedDataExhange = ({ type }: SolutionDetailProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <div>
      <p className="margin-top-0 text-pre-wrap ">
        {t(`solutions.centralizedDataExhange.${type}.description`)}
      </p>
    </div>
  );
};

export default CentralizedDataExhange;
