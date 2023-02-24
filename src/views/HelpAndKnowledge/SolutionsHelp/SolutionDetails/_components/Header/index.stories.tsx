import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { helpSolutions } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Header from '.';

export default {
  title: 'Help and Knowledge Solution Details Header',
  component: Header,
  decorators: [Story => <Header solution={helpSolutions[0]} />]
} as ComponentMeta<typeof Header>;

export const Default = () => <Header solution={helpSolutions[0]} />;
