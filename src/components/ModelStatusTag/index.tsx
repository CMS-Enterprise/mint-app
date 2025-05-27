import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { ModelStatus } from 'gql/generated/graphql';

export const ModelStatusTag = ({
  status,
  classname
}: {
  status: ModelStatus;

  classname?: string;
}) => {
  const { t } = useTranslation('modelPlan');

  return (
    <Tag
      className={classNames(
        'mint-tag bg-base text-white margin-right-1 padding-x-1',
        classname
      )}
    >
      {t(`status.options.${status}`)}
    </Tag>
  );
};

export default ModelStatusTag;
