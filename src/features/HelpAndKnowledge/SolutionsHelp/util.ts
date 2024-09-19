import { tObject } from 'utils/translation';

import { AboutConfigType } from './SolutionDetails/Solutions/Generic/about';
import { TimelineConfigType } from './SolutionDetails/Solutions/Generic/timeline';

export const timelineTranslationUtil = (solutionKey: string) =>
  tObject<keyof TimelineConfigType, any>(
    `helpAndKnowledge:solutions.${solutionKey}.timeline`
  );

export const aboutTranslationUtil = (solutionKey: string) =>
  tObject<keyof AboutConfigType, any>(
    `helpAndKnowledge:solutions.${solutionKey}.about`
  );
