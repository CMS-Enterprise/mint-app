/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation LinkNewPlanDocument($input: PlanDocumentLinkInput!) {\n    linkNewPlanDocument(input: $input) {\n      id\n    }\n  }\n": types.LinkNewPlanDocumentDocument,
    "\n  mutation CreatReportAProblem($input: ReportAProblemInput!) {\n    reportAProblem(input: $input)\n  }\n": types.CreatReportAProblemDocument,
    "\n  mutation CreatSendFeedback($input: SendFeedbackEmailInput!) {\n    sendFeedbackEmail(input: $input)\n  }\n": types.CreatSendFeedbackDocument,
    "\n  query GetFunding($id: UUID!) {\n    modelPlan(id: $id) {\n      id\n      modelName\n      payments {\n        id\n        fundingSource\n        fundingSourceTrustFundType\n        fundingSourceOther\n        fundingSourceNote\n        fundingSourceR\n        fundingSourceRTrustFundType\n        fundingSourceROther\n        fundingSourceRNote\n        payRecipients\n        payRecipientsOtherSpecification\n        payRecipientsNote\n        payType\n        payTypeNote\n        payClaims\n      }\n      operationalNeeds {\n        modifiedDts\n      }\n    }\n  }\n": types.GetFundingDocument,
    "\n  mutation UpdatePayments($id: UUID!, $changes: PlanPaymentsChanges!) {\n    updatePlanPayments(id: $id, changes: $changes) {\n      id\n    }\n  }\n": types.UpdatePaymentsDocument,
    "\n  mutation CreateShareModelPlan(\n    $modelPlanID: UUID!\n    $viewFilter: ModelViewFilter\n    $usernames: [String!]!\n    $optionalMessage: String\n  ) {\n    shareModelPlan(\n      modelPlanID: $modelPlanID\n      viewFilter: $viewFilter\n      usernames: $usernames\n      optionalMessage: $optionalMessage\n    )\n  }\n": types.CreateShareModelPlanDocument,
    "\n  query GetPossibleSolutions {\n    possibleOperationalSolutions {\n      id\n      key\n      pointsOfContact {\n        id\n        name\n        email\n        isTeam\n        role\n      }\n    }\n  }\n": types.GetPossibleSolutionsDocument,
    "\n  query GetNDA {\n    ndaInfo {\n      agreed\n      agreedDts\n    }\n  }\n": types.GetNdaDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LinkNewPlanDocument($input: PlanDocumentLinkInput!) {\n    linkNewPlanDocument(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation LinkNewPlanDocument($input: PlanDocumentLinkInput!) {\n    linkNewPlanDocument(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatReportAProblem($input: ReportAProblemInput!) {\n    reportAProblem(input: $input)\n  }\n"): (typeof documents)["\n  mutation CreatReportAProblem($input: ReportAProblemInput!) {\n    reportAProblem(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatSendFeedback($input: SendFeedbackEmailInput!) {\n    sendFeedbackEmail(input: $input)\n  }\n"): (typeof documents)["\n  mutation CreatSendFeedback($input: SendFeedbackEmailInput!) {\n    sendFeedbackEmail(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFunding($id: UUID!) {\n    modelPlan(id: $id) {\n      id\n      modelName\n      payments {\n        id\n        fundingSource\n        fundingSourceTrustFundType\n        fundingSourceOther\n        fundingSourceNote\n        fundingSourceR\n        fundingSourceRTrustFundType\n        fundingSourceROther\n        fundingSourceRNote\n        payRecipients\n        payRecipientsOtherSpecification\n        payRecipientsNote\n        payType\n        payTypeNote\n        payClaims\n      }\n      operationalNeeds {\n        modifiedDts\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFunding($id: UUID!) {\n    modelPlan(id: $id) {\n      id\n      modelName\n      payments {\n        id\n        fundingSource\n        fundingSourceTrustFundType\n        fundingSourceOther\n        fundingSourceNote\n        fundingSourceR\n        fundingSourceRTrustFundType\n        fundingSourceROther\n        fundingSourceRNote\n        payRecipients\n        payRecipientsOtherSpecification\n        payRecipientsNote\n        payType\n        payTypeNote\n        payClaims\n      }\n      operationalNeeds {\n        modifiedDts\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePayments($id: UUID!, $changes: PlanPaymentsChanges!) {\n    updatePlanPayments(id: $id, changes: $changes) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePayments($id: UUID!, $changes: PlanPaymentsChanges!) {\n    updatePlanPayments(id: $id, changes: $changes) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateShareModelPlan(\n    $modelPlanID: UUID!\n    $viewFilter: ModelViewFilter\n    $usernames: [String!]!\n    $optionalMessage: String\n  ) {\n    shareModelPlan(\n      modelPlanID: $modelPlanID\n      viewFilter: $viewFilter\n      usernames: $usernames\n      optionalMessage: $optionalMessage\n    )\n  }\n"): (typeof documents)["\n  mutation CreateShareModelPlan(\n    $modelPlanID: UUID!\n    $viewFilter: ModelViewFilter\n    $usernames: [String!]!\n    $optionalMessage: String\n  ) {\n    shareModelPlan(\n      modelPlanID: $modelPlanID\n      viewFilter: $viewFilter\n      usernames: $usernames\n      optionalMessage: $optionalMessage\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPossibleSolutions {\n    possibleOperationalSolutions {\n      id\n      key\n      pointsOfContact {\n        id\n        name\n        email\n        isTeam\n        role\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPossibleSolutions {\n    possibleOperationalSolutions {\n      id\n      key\n      pointsOfContact {\n        id\n        name\n        email\n        isTeam\n        role\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetNDA {\n    ndaInfo {\n      agreed\n      agreedDts\n    }\n  }\n"): (typeof documents)["\n  query GetNDA {\n    ndaInfo {\n      agreed\n      agreedDts\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;