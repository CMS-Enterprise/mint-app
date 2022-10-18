import { TaskStatus } from './graphql-global-types';

export enum CLEARANCE_STATUS {
  CANNOT_START = 'CANNOT_START'
}

export type ModelPlanTaskStatus = TaskStatus | CLEARANCE_STATUS;
