// Hook to fetch solution contacts and map to FE help solution map

import { useMemo } from 'react';
import GetPossibleSolutions from 'gql/apolloGQL/Solutions/GetPossibleSolutions';
import { GetPossibleSolutionsQuery } from 'gql/gen/graphql';

import {
  HelpSolutionBaseType,
  helpSolutions,
  HelpSolutionType,
  SolutionContactType
} from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import useCacheQuery from './useCacheQuery';

export const mapContactsToSolutions = (
  solutions: HelpSolutionBaseType[],
  contactSolutions: GetPossibleSolutionsQuery['possibleOperationalSolutions']
): HelpSolutionType[] => {
  return solutions.map(solution => {
    const foundSolution = contactSolutions.find(
      contactSolution => solution.enum === contactSolution.key
    );

    return {
      ...solution,
      pointsOfContact:
        foundSolution?.pointsOfContact || ([] as SolutionContactType[])
    };
  });
};

const useHelpSolution = (): HelpSolutionType[] => {
  const { data } = useCacheQuery(GetPossibleSolutions);

  const helpSolutionsWithContacts = useMemo(() => {
    return mapContactsToSolutions(
      helpSolutions,
      data?.possibleOperationalSolutions || []
    );
  }, [data?.possibleOperationalSolutions]);

  return helpSolutionsWithContacts;
};

export default useHelpSolution;
