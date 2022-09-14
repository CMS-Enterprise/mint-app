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

  // If component is not a list, render a basics component
  if (!list) {
    return (
      <div
        className={`read-only-section read-only-section--${sectionName} margin-bottom-3 ${
          className ?? ''
        }`}
      >
        <p className="text-bold margin-y-0 font-body-sm line-height-sans-4">
          {heading}
        </p>
        <p className="margin-y-0 font-body-md line-height-sans-4">
          {copy ?? t('na')}
        </p>
      </div>
    );
  }

  // If component is a list, render a more complicated list component
  return (
    <div
      className={`read-only-section read-only-section--${sectionName} margin-bottom-3 ${
        className ?? ''
      }`}
    >
      <p className="text-bold margin-y-0 font-sans-md line-height-sans-4">
        {heading}
      </p>
      <ul className="margin-y-0 padding-left-3">
        {listItems ? (
          listItems?.map(item => (
            <>
              <li className="font-sans-md line-height-sans-4">{item}</li>
              {item === 'Other' && (
                <ul>
                  <li className="font-sans-md line-height-sans-4">{copy}</li>
                </ul>
              )}
            </>
          ))
        ) : (
          <li className="font-sans-md line-height-sans-4">{t('na')}</li>
        )}
      </ul>
    </div>

    // TODO: Ask Natasha how does Other show on page
  );
};

export default ReadOnlySection;
