import React from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar } from 'components/Avatar';
import { formatDateLocal } from 'utils/date';

export type LastModifiedSectionData = {
  modifiedDts: string;
  modifiedByUserAccount: { commonName: string };
};

type LastModifiedSectionProps = {
  section: LastModifiedSectionData;
  /** Translation key for the label (namespace: collaborationArea). Supports `{{ date }}` placeholder. */
  translationKey?: string;
};

const DEFAULT_TRANSLATION_KEY = 'modelPlanCard.mostRecentEdit';

/**
 * Displays the most recent edit date and user avatar for a model plan section.
 * Reused by ModelPlanCard and Tasks.
 */
const LastModifiedSection = ({
  section,
  translationKey = DEFAULT_TRANSLATION_KEY
}: LastModifiedSectionProps) => {
  const { t } = useTranslation('collaborationArea');
  const dateStr = formatDateLocal(section.modifiedDts, 'MM/dd/yyyy');
  const label = t(translationKey, { date: dateStr });

  return (
    <div className="display-inline tablet:display-flex  flex-align-center">
      <span className="text-base margin-right-1">{label}</span>
      <Avatar
        className="text-base-darkest"
        user={section.modifiedByUserAccount.commonName}
      />
    </div>
  );
};

export default LastModifiedSection;
