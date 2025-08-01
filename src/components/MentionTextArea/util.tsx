import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { TagType } from 'gql/generated/graphql';
// Possible Util to extract only mentions from content
export const getMentions = (data: any) => {
  const mentions: any = [];

  data?.content?.forEach((para: any) => {
    para?.content?.forEach((content: any) => {
      if (content?.type === 'mention') {
        mentions.push(content?.attrs);
      }
    });
  });

  return mentions;
};

export const getContent = (editorData: any) => {
  const data = { ...editorData };

  const text: any = [];

  data?.content?.forEach((para: any) => {
    para?.content?.forEach((content: any) => {
      if (content?.type === 'text') {
        text.push(content?.text);
      } else if (content?.type === 'mention') {
        text.push(`@${content?.attrs?.label}`);
      }
    });
  });

  return text.join(' ');
};

export const formatedSolutionMentions = (query?: string) => {
  let mappedSolutions = helpSolutionsArray.map(solution => {
    const acronym = solution.acronym ? ` (${solution.acronym})` : '';
    return {
      username: solution.key,
      displayName: `${solution.name}${acronym}`,
      tagType: TagType.MTO_COMMON_SOLUTION
    };
  });

  if (query) {
    mappedSolutions = mappedSolutions.filter(solution =>
      solution.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }

  return mappedSolutions;
};
