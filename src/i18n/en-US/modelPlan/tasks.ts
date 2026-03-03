import {
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';

const tasks = {
  heading: 'Current tasks',
  state: {
    [PlanTaskState.TO_DO]: 'To do',
    [PlanTaskState.COMPLETE]: 'Complete'
  },
  [PlanTaskKey.MODEL_PLAN]: {
    copy: 'The Model Plan will help components across CMS evaluate your model’s operational requirements and IT needs. It contains questions about payments, providers, general characteristics, and more. The Model Plan is flexible, so you may leave questions blank, add new information, and change information as you iterate on your model or learn of new dependencies.',
    secondaryAction: 'View sample Model Plan',
    [PlanTaskStatus.TO_DO]: {
      heading: 'Start your Model Plan',
      primaryAction: 'Start'
    },
    [PlanTaskStatus.IN_PROGRESS]: {
      heading: 'Iterate on your Model Plan',
      primaryAction: 'Continue'
    },
    [PlanTaskStatus.COMPLETE]: {
      heading: 'Iterate on your Model Plan',
      primaryAction: 'Go to Model Plan'
    }
  },
  [PlanTaskKey.DATA_EXCHANGE]: {
    copy: 'Work with your IT Lead to determine how your model will exchange data so that CMMI and BSG can help with new policy or technology opportunities. Some models may have more complex needs or could be avenues to explore broader HHS policy initiatives around data exchange, so detailed completion of the data exchange approach will also help the MINT Team understand how best to help you.',
    secondaryAction: 'View help article',
    [PlanTaskStatus.TO_DO]: {
      heading: 'Start your data exchange approach',
      primaryAction: 'Start'
    },
    [PlanTaskStatus.IN_PROGRESS]: {
      heading: 'Finalize your data exchange approach',
      primaryAction: 'Continue'
    },
    [PlanTaskStatus.COMPLETE]: {
      heading: 'Finalize your data exchange approach',
      primaryAction: 'Go to approach'
    }
  },
  [PlanTaskKey.MTO]: {
    copy: 'Work with your IT Lead to document model milestones or functions required for your model and choose the solutions and IT systems your model will utilize. Track your progress towards implementation, browse milestone and solution libraries, see points of contact for available solutions, and monitor deadlines. Keeping this information up-to-date will also help the MINT Team understand how best to help you.',
    secondaryAction: 'View help article',
    [PlanTaskStatus.TO_DO]: {
      heading: 'Start your model-to-operations matrix (MTO)',
      primaryAction: 'Start'
    },
    [PlanTaskStatus.IN_PROGRESS]: {
      heading: 'Keep your model-to-operations matrix (MTO) up-to-date',
      primaryAction: 'Continue'
    },
    [PlanTaskStatus.COMPLETE]: {
      heading: 'Keep your model-to-operations matrix (MTO) up-to-date',
      primaryAction: 'Go to MTO'
    }
  }
};

export default tasks;
