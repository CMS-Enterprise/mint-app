import { useContext, useRef } from 'react';

import { ModelInfoContext } from 'contexts/ModelInfoContext';

/**
 * Custom hook for sticky header functionality.
 * Provides the header ref and model information needed for StickyModelNameWrapper.
 *
 * @returns Object containing:
 *   - headerRef: Ref to attach to the PageHeading element
 *   - modelName: Model name from ModelInfoContext
 *   - abbreviation: Model abbreviation from ModelInfoContext
 */
export const useStickyHeader = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { modelName, abbreviation } = useContext(ModelInfoContext);

  return {
    headerRef,
    modelName,
    abbreviation
  };
};
