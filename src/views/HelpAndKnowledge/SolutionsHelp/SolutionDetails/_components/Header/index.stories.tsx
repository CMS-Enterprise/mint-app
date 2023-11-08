import React from 'react';
import { Meta } from '@storybook/react';

import { helpSolutions } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Header from '.';

export default {
  title: 'Help and Knowledge Solution Details Header',
  component: Header,
  decorators: [Story => <Header solution={helpSolutions[0]} />]
} as Meta<typeof Header>;

export const Default = () => <Header solution={helpSolutions[0]} />;
