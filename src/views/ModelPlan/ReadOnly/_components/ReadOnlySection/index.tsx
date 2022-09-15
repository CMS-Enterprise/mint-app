import React from 'react';
import { useTranslation } from 'react-i18next';

type ReadOnlySectionProps = {
  copy?: string | null;
  heading: string;
  list?: boolean;
  listItems?: string[];
  notes?: string;
};

const ReadOnlySection = ({
  copy,
  heading,
  list,
  listItems,
  notes
}: ReadOnlySectionProps) => {
  const { t } = useTranslation('basics');
  const sectionName = heading.toLowerCase().replaceAll(' ', '-');

  // If component is not a list, render a basics component
  if (!list) {
    return (
      <div
        className={`read-only-section read-only-section--${sectionName} margin-bottom-3`}
      >
        <p className="text-bold margin-y-0 font-body-sm line-height-sans-4">
          {heading}
        </p>
        <p className="margin-y-0 font-body-md line-height-sans-4">
          {copy || <em className="text-base">{t('na')}</em>}
        </p>
      </div>
    );
  }

  // If component is a list, render a more complicated list component
  return (
    <div
      className={`read-only-section read-only-section--${sectionName} margin-bottom-3`}
    >
      <p className="text-bold margin-y-0 font-sans-md line-height-sans-4">
        {heading}
      </p>
      <ul className="margin-y-0 padding-left-3">
        {listItems ? (
          listItems?.map(item => (
            <React.Fragment key={`${sectionName}--${item}`}>
              <li className="font-sans-md line-height-sans-4">{item}</li>
              {item === 'Other' && (
                <ul data-testid="other-entry">
                  <li className="font-sans-md line-height-sans-4">{copy}</li>
                </ul>
              )}
            </React.Fragment>
          ))
        ) : (
          <li className="font-sans-md line-height-sans-4">{t('na')}</li>
        )}
      </ul>
    </div>
  );
};

export default ReadOnlySection;
