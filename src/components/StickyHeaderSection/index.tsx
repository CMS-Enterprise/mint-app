import React from 'react';
import { useTranslation } from 'react-i18next';

import StickyModelNameWrapper from 'components/StickyModelNameWrapper';
import useStickyHeader from 'hooks/useStickyHeader';

interface StickyHeaderSectionProps {
  /**
   * Ref to the PageHeading element that triggers the sticky header
   */
  headerRef: React.RefObject<HTMLElement | null>;
  /**
   * Translation key for the section heading (e.g., 'participantsAndProvidersMisc.heading')
   * This will be passed to miscellaneousT('modelPlanHeading', { heading: sectionHeading })
   */
  sectionHeading: string;
  /**
   * Optional className to pass to StickyModelNameWrapper
   */
  className?: string;
}

/**
 * StickyHeaderSection - A reusable wrapper component that provides consistent
 * sticky header functionality across task list pages.
 *
 * This component handles:
 * - Getting model name and abbreviation from ModelInfoContext
 * - Rendering the StickyModelNameWrapper with standardized content
 * - Using the consistent translation pattern: miscellaneousT('modelPlanHeading', { heading: ... })
 *
 * Usage:
 * ```tsx
 * const { headerRef, modelName, abbreviation } = useStickyHeader();
 *
 * <PageHeading ref={headerRef}>Section Title</PageHeading>
 * <StickyHeaderSection
 *   headerRef={headerRef}
 *   sectionHeading={sectionMiscT('heading')}
 * />
 * ```
 */
const StickyHeaderSection: React.FC<StickyHeaderSectionProps> = ({
  headerRef,
  sectionHeading,
  className
}) => {
  const { modelName, abbreviation } = useStickyHeader();
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  return (
    <StickyModelNameWrapper triggerRef={headerRef} className={className}>
      <div className="padding-top-2 padding-bottom-1">
        <h3 className="margin-y-0">
          {miscellaneousT('modelPlanHeading', {
            heading: sectionHeading
          })}
        </h3>
        <p className="margin-y-0 font-body-lg line-height-sans-3">
          {miscellaneousT('for')} {modelName}
          {abbreviation && ` (${abbreviation})`}
        </p>
      </div>
    </StickyModelNameWrapper>
  );
};

export default StickyHeaderSection;
