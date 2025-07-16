import React from 'react';

import { HelpSolutionType } from '../../solutionsMap';
import GenericPointsOfContact from '../Solutions/Generic/PointsOfContact';

export const PointsOfContact = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  if (solution.components['points-of-contact']) {
    return solution.components['points-of-contact']({
      solution
    });
  }

  return <GenericPointsOfContact solution={solution} />;
};

export default PointsOfContact;
