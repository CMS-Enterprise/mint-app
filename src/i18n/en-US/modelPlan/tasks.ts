import { PlanTaskKey, PlanTaskStatus } from 'gql/generated/graphql';

const tasks = {
  heading: 'Current tasks',
  modelPlanTasks: {
    [PlanTaskKey.MODEL_PLAN]: {
      [PlanTaskStatus.TO_DO]: {
        heading: 'Start your Model Plan',
        copy: 'The Model Plan will help components across CMS evaluate your model’s operational requirements and IT needs. It contains questions about payments, providers, general characteristics, and more. The Model Plan is flexible, so you may leave questions blank, add new information, and change information as you iterate on your model or learn of new dependencies.'
      },
      [PlanTaskStatus.IN_PROGRESS]: {
        heading: 'Iterate on your Model Plan',
        copy: 'The Model Plan will help components across CMS evaluate your model’s operational requirements and IT needs. It contains questions about payments, providers, general characteristics, and more. The Model Plan is flexible, so you may leave questions blank, add new information, and change information as you iterate on your model or learn of new dependencies.'
      },
      [PlanTaskStatus.COMPLETE]: {
        heading: 'Iterate on your Model Plan',
        copy: 'The Model Plan will help components across CMS evaluate your model’s operational requirements and IT needs. It contains questions about payments, providers, general characteristics, and more. The Model Plan is flexible, so you may leave questions blank, add new information, and change information as you iterate on your model or learn of new dependencies.'
      }
    }
  }
};

export default tasks;
