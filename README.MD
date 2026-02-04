## How to Run
`npm install`
`npm test`
`npm run dev`

## Solution Briefing

This code check-in implements all requested enhancements, bug fixes, and test coverage for the GraphQL assignment using GraphQL Yoga and Envelop. The solution keeps resolver logic focused on business behavior while handling cross-cutting concerns (request headers, logging, and response metadata) centrally via Envelop plugins.

## Key Changes

> Schema & Types:

- Added `state` to the `Address` schema and aligned TypeScript types accordingly.
 
> Mutation:

- Implemented `createAddress` mutation to persist new address records to `addresses.json`.
- Enforces create-only behavior (no overwrite of existing records).

> Request Validation:

- Added Envelop plugin to enforce required `client` header on all requests.

> Logging:

- Fixed requestId lifecycle issue so it is generated before resolvers execute.
- Updated logger to include both `requestId` and `client` in every log entry.

> Response Metadata:

- Appended requestId to all GraphQL responses under a top-level metadata field using the Envelop execution lifecycle.

> Testing:

- Added unit/integration tests covering

  - Required client header enforcement
  - createAddress mutation behavior (success + duplicate rejection)
  - Presence of metadata.requestId in responses
- File system interactions are safely mocked to avoid modifying real data.


### Design notes
- Envelop plugins are used to centralize request-level concerns (headers, logging, response shaping) instead of duplicating logic in resolvers.
- Resolver implementations remain focused solely on business logic.
- Tests execute against an in-memory Yoga server to closely match real runtime behavior.

