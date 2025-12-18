export const knownErrors: Record<string, string> = {
  uniq_contractor_name_per_solution_key:
    'This contractor is already added to this solution and cannot be added again. Please edit the existing entry.',
  uniq_user_id_per_solution_key:
    'This user is already added to this solution and cannot be added again. Please edit the existing entry.',
  uniq_mailbox_address_per_solution_key:
    'This mailbox address is already added to this solution and cannot be added again. Please edit the existing entry.',
  uniq_system_owner_key_type_component:
    'This owner is already added to this solution and cannot be added again. Please edit the existing entry.',
  unique_collaborator_per_plan:
    'This person is already a member of your model team. Please select a different person to add to your team.',
  unique_name_per_model_plan_when_mto_common_milestone_is_null:
    'There is already a model milestone in your MTO with this name. Please choose a different name for this milestone.',
  unique_name_per_model_plan_when_mto_common_solution_is_null:
    'There is already a model solution in your MTO with this name. Please choose a different name for this solution.',
  uniq_category:
    'This subject category is already added and cannot be added again. Please edit the existing entry.',
  uniq_user_id_per_category:
    'This user is already added to this subject category and cannot be added again. Please edit the existing entry.',
  uniq_mailbox_address_per_category:
    'This mailbox address is already added to this subject category and cannot be added again. Please edit the existing entry.'
};

const error = {
  notFound: {
    heading: 'This page cannot be found.',
    thingsToTry: 'Here is a list of things you could try to check and fix:',
    list: [
      'Please check if the address you typed in is correct.',
      "If you've typed the address correctly, check the spelling.",
      "If you've copied and pasted the address, check that you've copied the entire address."
    ],
    tryAgain:
      'If none of the above have solved the problem, please return to the home page and try again.',
    goHome: 'Go back to the home page',
    modelPlanError: 'The model plan you are looking for does not exist.',
    fetchError:
      'There was an error fetching the requested data. Please try again later.'
  },
  global: {
    generalError: 'Something went wrong with your request.',
    generalBody:
      'Please try again. If the problem persists, please contact support.',
    knownErrors
  }
};

export default error;
