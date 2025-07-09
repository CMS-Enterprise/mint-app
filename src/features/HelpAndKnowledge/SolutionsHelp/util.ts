import { tObject } from 'utils/translation';

import { AboutConfigType } from './SolutionDetails/Solutions/Generic/About';
import { TimelineConfigType } from './SolutionDetails/Solutions/Generic/Timeline';
import { HelpSolutionBaseType, HelpSolutionsType } from './solutionsMap';

export const timelineTranslationUtil = (solutionKey: string) =>
  tObject<keyof TimelineConfigType, any>(
    `helpAndKnowledge:solutions.${solutionKey}.timeline`
  );

export const aboutTranslationUtil = (solutionKey: string) =>
  tObject<keyof AboutConfigType, any>(
    `helpAndKnowledge:solutions.${solutionKey}.about`
  );

export const convertSolutionObjectToArray = (
  solutionMap: HelpSolutionsType
): HelpSolutionBaseType[] =>
  Object.values(solutionMap).map(solution => solution);
