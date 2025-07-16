import React from 'react';
import { Meta } from '@storybook/react';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Header from '.';

export default {
  title: 'Help and Knowledge Solution Details Header',
  component: Header,
  decorators: [Story => <Header solution={helpSolutionsArray[0]} />]
} as Meta<typeof Header>;

export const Default = () => <Header solution={helpSolutionsArray[0]} />;
