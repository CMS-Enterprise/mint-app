import React from 'react';
import classNames from 'classnames';

import { getKeys, TranslationPlanSection } from 'types/translation';

import { filterGroupKey } from '../FilterView/BodyContent/_filterGroupMapping';
import ReadOnlySection from '../ReadOnlySection';
import { isHiddenByParentCondition } from '../ReadOnlySection/util';
import SideBySideReadOnlySection from '../SideBySideReadOnlySection';

const ReadOnlyBody = ({
  data,
  config,
  filteredView
}: {
  data: any;
  config: Partial<TranslationPlanSection>;
  filteredView?: keyof typeof filterGroupKey;
}) => {
  return (
    <>
      {/* Map through all the translation config questions */}
      {getKeys(config)
        .filter(field => !config[field]?.hideFromReadonly) // Don't render status(in progress/ready for review, etc) field
        .map(field => (
          <div
            key={field}
            className={classNames({
              'margin-top-4 padding-top-4 border-top-1px border-base-light':
                !filteredView &&
                config[field]?.isPageStart &&
                !isHiddenByParentCondition(config[field], data) // Add border if translation config contains property 'isPageStart'
            })}
          >
            {/* Only render the header if it's not a filtered view or hidden by parent */}
            {!filteredView &&
              config[field]?.readonlyHeader &&
              !isHiddenByParentCondition(config[field], data) && (
                <h3 className="margin-top-0">
                  {config[field]?.readonlyHeader}
                </h3>
              )}

            {/* Checks if questions have config to be displayed side by side */}
            {config[field]?.adjacentPositioning ? (
              <>
                {/* Presence of adjacentPositioning will render in a SideBySideReadOnlySection component
                    Config position of 'left' will render and condtionally render the following component where adjacentPositioning.adjacentField is the reference */}
                {config[field]?.adjacentPositioning?.position === 'left' && (
                  <SideBySideReadOnlySection>
                    <ReadOnlySection
                      field={field}
                      translations={config}
                      values={data}
                      filteredView={filteredView}
                    />

                    {/* Checks if second question is condtional on the previous question before rendering
                        References the string/key (ex: 'estimateConfidence') of adjacentPositioning.adjacentField
                    */}
                    {!isHiddenByParentCondition(
                      config[
                        config[field]?.adjacentPositioning
                          ?.adjacentField as keyof TranslationPlanSection
                      ],
                      data
                    ) && (
                      <ReadOnlySection
                        field={
                          config[field]?.adjacentPositioning
                            ?.adjacentField as keyof TranslationPlanSection
                        }
                        translations={config}
                        values={data}
                        filteredView={filteredView}
                      />
                    )}
                  </SideBySideReadOnlySection>
                )}
              </>
            ) : (
              <ReadOnlySection
                field={field}
                translations={config}
                values={data}
                filteredView={filteredView}
              />
            )}
          </div>
        ))}
    </>
  );
};

export default ReadOnlyBody;
