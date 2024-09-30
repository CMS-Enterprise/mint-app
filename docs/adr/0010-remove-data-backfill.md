# Remove existing Data Backfill command from main


The data backfill command was created to be a one time use tool to import data from SharePoint into Mint production. It has fulfilled it's use, we don't expect to need to use it for an import in the future. Keeping the command in main means we need to maintain and update the code for each code change. We are faced with the options as enumerated below

[Commit in Main with the backfill](https://github.com/CMS-Enterprise/mint-app/commit/00e01f91fd8e7e624c54c25d3b3f62d0a8a388d4)

[Data Backfill PR](https://github.com/CMS-Enterprise/mint-app/pull/375)

## Considered Alternatives

* Deprecate the backfill tool and remove from main
* Continue to update the backfill tool with each code change

## Decision Outcome

### Deprecate the backfill tool and remove from main
* The backfill tool has served it's purpose, and we don't anticipate needing it in the future. If we need to use it or similar logic in the future, we can get the code from the commit in main and update then.
* Keeping the branch in main means that we would need to spend development time updating functionality that we likely won't need.
* If we need this logic in the future, it might be more efficient to use the old logic as inspiration, instead of trying to use the existing functionality.

Steps to use if needed in the future

1. Checkout the old commit.
2. Update the code logic to use the new paradigm.
3. Create a list of users JSON file.
4. Get the new data to be imported in CSV format.

## Pros and Cons of the Alternatives <!-- optional -->

### Continue to update the backfill tool with each code change

* `+` The command remains available easily if needed.
* `-` We don't expect to need it
* `-` It requires unnecessary development time to keep it up to date.
