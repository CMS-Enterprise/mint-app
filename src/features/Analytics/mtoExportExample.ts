import { downloadMTOMilestoneSummary } from './util';

// Example usage of the updated downloadMTOMilestoneSummary function

// Your data structure (replace with actual data)
const exampleData = {
  "data": {
    "modelPlanCollection": [
      {
        "id": "c379d9bb-9010-4150-9dc8-52b923825ab8",
        "mtoMatrix": {
          "info": {
            "id": "a50095d7-257e-4def-867e-00189b3201d2",
            "__typename": "MTOInfo"
          },
          "milestones": [],
          "__typename": "ModelsToOperationMatrix"
        },
        "__typename": "ModelPlan"
      },
      {
        "id": "00000000-0000-0000-0000-000000000005",
        "mtoMatrix": {
          "info": {
            "id": "bd71baf2-0555-4754-996c-d2ac43eca77f",
            "__typename": "MTOInfo"
          },
          "milestones": [
            {
              "id": "cd81b56f-05d6-44f2-bcf6-235628c90f19",
              "key": "ACQUIRE_A_LEARN_CONT",
              "name": "Acquire a learning contractor",
              "status": "NOT_STARTED",
              "riskIndicator": "ON_TRACK",
              "needBy": null,
              "__typename": "MTOMilestone"
            },
            {
              "id": "6f52412f-3063-4b28-a4e4-c56e6646155f",
              "key": null,
              "name": "MilestoneCategory 0",
              "status": "NOT_STARTED",
              "riskIndicator": "ON_TRACK",
              "needBy": null,
              "__typename": "MTOMilestone"
            }
          ],
          "__typename": "ModelsToOperationMatrix"
        },
        "__typename": "ModelPlan"
      }
    ]
  }
};

// Export the data - arrays will be expanded into separate rows
export const exportMTOData = () => {
  downloadMTOMilestoneSummary(exampleData, 'mto-raw-export.xlsx');
};

// Example with real data from a GraphQL query
export const exportMTODataFromQuery = (queryData: any) => {
  downloadMTOMilestoneSummary(queryData, 'mto-query-export.xlsx');
};

// Example with custom filename and timestamp
export const exportMTOWithTimestamp = (data: any) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `mto-raw-export-${timestamp}.xlsx`;
  downloadMTOMilestoneSummary(data, filename);
};