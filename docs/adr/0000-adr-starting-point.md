# Restart ADRs for MINT application

The MINT application is based on the EASi application.
Some design decisions were already chosen from documentation 
in EASI ADRs. As we add to the documentation for MINT, we need to decide to keep the old documentation in this repo, or to note that earlier ADRs are viewable in the [EASi repo](https://github.com/CMS-Enterprise/easi-app/blob/master/docs/adr) for historic purposes.

## Considered Alternatives

* Keep all ADR Records
* Start fresh with MINT specific ADRs


## Decision Outcome

* Start fresh with MINT specific ADRs

 The MINT app will have new ADR needs, and this will allow us to have a clean start, while still retaining historic records in the [EASi Repo](https://github.com/CMS-Enterprise/easi-app/blob/master/docs/adr).


## Pros and Cons of the Alternatives <!-- optional -->

### Start fresh with MINT specific ADRs

* `+` Cleaner documentation of choices that are specific to MINT
* `+` Less redundancy for information 
* `-` Legacy decisions are not visible in the MINT app

### * Keep all ADR Records

* `+` Easy to see a record of all ADR records
* `-` Not all decisions apply to MINT
* `-` Some EASi ADR decisions are no longer applicable
* `-` Redundant information kept in both repositories



### Resources
[EASI Architecture Decision Records (ADRs)](https://github.com/CMS-Enterprise/easi-app/blob/master/docs/adr)
