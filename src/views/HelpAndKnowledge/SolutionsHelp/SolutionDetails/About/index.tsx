import React from 'react';
import { useTranslation } from 'react-i18next';

export const About = () => {
  const { t } = useTranslation('helpAndKnowledge');
  return (
    <div>
      <h2 className="margin-top-0">{t('navigation.about')}</h2>
    </div>
  );
};

export default About;
