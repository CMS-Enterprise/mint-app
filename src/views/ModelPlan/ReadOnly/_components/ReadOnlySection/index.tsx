import React from 'react';
import { useTranslation } from 'react-i18next';

type ReadOnlySectionProps = {
  className?: string;
  copy?: string | null | undefined;
  heading: string;
  list?: boolean;
  listItems?: string[] | undefined;
};

const ReadOnlySection = ({
  className,
  copy,
  heading,
  list,
  listItems
}: ReadOnlySectionProps) => {
  const { t } = useTranslation('basics');
  const sectionName = heading.toLowerCase().replaceAll(' ', '-');

  return (
    <div
      className={`read-only-section read-only-section--${sectionName} margin-bottom-3 ${
        className ?? ''
      }`}
    >
      <p className="text-bold margin-y-0 font-sans-md line-height-sans-4">
        {heading}
      </p>
      {!list ? (
        <p className="margin-y-0 font-sans-md line-height-sans-4">
          {copy ?? t('na')}
        </p>
      ) : (
        <ul className="margin-y-0 padding-left-3">
          {!listItems
            ? t('na')
            : listItems?.map(item => (
                <li className="font-sans-md line-height-sans-4">{item}</li>
              ))}
        </ul>
      )}
    </div>

    // TODO: Ask Natasha how does Other show on page
  );
};

export default ReadOnlySection;
