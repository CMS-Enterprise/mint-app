import React from 'react';
import classNames from 'classnames';

import { getKeys, TranslationPlanSection } from 'types/translation';

import { filterGroups } from '../FilterView/BodyContent/_filterGroupMapping';
import ReadOnlySectionNew, {
  isHiddenByParentCondition
} from '../ReadOnlySection/new';
import SideBySideReadOnlySectionNew from '../SideBySideReadOnlySection/new';

const ReadOnlyBody = ({
  data,
  config,
  isViewingFilteredView,
  filteredView
}: {
  data: any;
  config: TranslationPlanSection;
  isViewingFilteredView?: boolean;
  filteredView?: typeof filterGroups[number];
}) => {
  return (
    <>
      {/* Map through all the translation config questions */}
      {getKeys(config)
        .filter(field => field !== 'status') // Don't render status(in progress/ready for review, etc) field
        .map((field, index) => (
          <div
            key={field}
            className={classNames({
              'margin-top-4 padding-top-4 border-top-1px border-base-light':
                !isViewingFilteredView && config[field]?.pageStart // Add border if translation config contains property 'pageStart'
            })}
          >
            {/* Checks if questions have config to be displayed side by side */}
            {config[field]?.adjacentPosition === 'left' ||
            config[field]?.adjacentPosition === 'right' ? (
              <>
                {config[field]?.adjacentPosition === 'left' && (
                  <SideBySideReadOnlySectionNew>
                    <ReadOnlySectionNew
                      config={config[field]}
                      values={data}
                      namespace="participantsAndProviders"
                      filteredView={filteredView}
                    />

                    {/* Checks if second question is condtional on the previous question before rendering */}
                    {!isHiddenByParentCondition(
                      config[getKeys(config)[index + 1]],
                      data
                    ) && (
                      <ReadOnlySectionNew
                        config={config[getKeys(config)[index + 1]]}
                        values={data}
                        namespace="participantsAndProviders"
                        filteredView={filteredView}
                      />
                    )}
                  </SideBySideReadOnlySectionNew>
                )}
              </>
            ) : (
              <>
                {/* Don't render questions of type 'otherType' as they are rendered within ReadOnlySectionNew */}
                {!config[field]?.otherType && (
                  <ReadOnlySectionNew
                    config={config[field]}
                    values={data}
                    namespace="participantsAndProviders"
                    filteredView={filteredView}
                  />
                )}
              </>
            )}
          </div>
        ))}
    </>
  );
};

export default ReadOnlyBody;
