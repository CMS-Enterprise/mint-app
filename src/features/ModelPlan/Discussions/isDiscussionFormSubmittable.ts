import { DiscussionUserRole } from 'gql/generated/graphql';

import { DiscussionFormPropTypes } from '.';

export const getDiscussionFormValidationErrors = (
  values: DiscussionFormPropTypes,
  renderType: 'question' | 'reply'
): Partial<Record<keyof DiscussionFormPropTypes, string>> => {
  const errors: Partial<Record<keyof DiscussionFormPropTypes, string>> = {};

  if (!values.content?.trim()) {
    errors.content = `Please enter a ${renderType}`;
  }

  if (renderType === 'question' && !values.topic) {
    errors.topic = 'Please select a discussion topic';
  }

  if (!values.userRole) {
    errors.userRole = 'Please select a role';
  }

  if (
    values.userRole === DiscussionUserRole.NONE_OF_THE_ABOVE &&
    !values.userRoleDescription?.trim()
  ) {
    errors.userRoleDescription = 'Please enter a role description';
  }

  return errors;
};

export const isDiscussionFormSubmittable = (
  values: DiscussionFormPropTypes,
  renderType: 'question' | 'reply'
): boolean =>
  Object.keys(getDiscussionFormValidationErrors(values, renderType)).length ===
  0;
