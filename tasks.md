# Implementation Plan: Amazon ReLife

## Overview

This plan implements Amazon ReLife as a full-stack web app: a Node.js/Express REST API with MongoDB (Mongoose) and a React/Vite/Tailwind SPA. It follows a test-driven, inside-out approach. The correctness-critical pure engines (`decisionEngine`, `creditRules`, `badgeRules`, `recoveryEngine`, `geoService`) are built first with `fast-check` property-based tests (Properties 1–5), then auth and integration adapters, then orchestration services, then REST routers, and finally the React frontend. Each step builds on the previous and ends by wiring components together so there is no orphaned code.

Property-based test tasks are marked optional with `*`, reference their design property number, and are tagged `Feature: amazon-relife, Property {n}`. Each PBT runs a minimum of 100 generated cases.

## Tasks

- [ ] 1. Project scaffolding (backend + frontend)
  - [ ] 1.1 Scaffold the Express backend
    - Create `server/` with `package.json`, Express app entry (`src/app.js`, `src/server.js`), folder structure (`models/`, `engines/`, `services/`, `adapters/`, `middleware/`, `routers/`, `config/`, `errors/`, `test/`)
    - Add dependencies: express, mongoose, jsonwebtoken, bcrypt, multer, @aws-sdk/client-s3, @google/generative-ai, zod (validation)
    - Add dev dependencies and configure the test runner (Vitest or Jest) plus `fast-check`
    - Add environment config loader (`config/env.js`) for Mongo URI, JWT secret, S3 settings, `GEMINI_TIMEOUT_MS`, `HIGH_RATIO_THRESHOLD` (default 2.0)
    - _Requirements: 14.1_
  - [ ] 1.2 Scaffold the React frontend
    - Create `client/` with Vite + React 18, Tailwind CSS, React Router 6, and Axios
    - Configure Tailwind responsive breakpoints (`sm`/`md`/`lg`) and base layout shell
    - Set up React Testing Library for component tests
    - _Requirements: 14.1, 14.5_

- [ ] 2. Implement MongoDB Mongoose schemas (7 collections)
  - [ ] 2.1 Create Users and Products schemas
    - `models/User.js`: name, email (unique, indexed), passwordHash, role, location, greenCredits (default 0), highestBadge
    - `models/Product.js`: ownerId, sellerId, name, category, price, media[], source, location, conditionScore, disposition, inspectionStatus, inspectionReportId, passportId, openBox, reviews[], returnReasons[]; indexes on ownerId/sellerId/source and text index on name/category
    - _Requirements: 3.1, 3.5, 8.5, 12.1_
  - [ ] 2.2 Create ProductPassports, RecoveryProducts, and SellerInsights schemas
    - `models/ProductPassport.js`: productId (unique), productName, category, ownershipHistory[], repairHistory[], inspectionReport, conditionScore, expectedLifespanMonths
    - `models/RecoveryProduct.js`: productId, returningCustomerId, conditionScore, recoveryEligible, productValue, logisticsCost, recoveryRatio, routingDecision, recoveryHubId
    - `models/SellerInsight.js`: productId, sellerId, reviewSummary, topComplaints[], improvementSuggestions[], dominantComplaint, empty
    - _Requirements: 5.1, 5.2, 9.6, 12.4_
  - [ ] 2.3 Create Credits and Badges schemas
    - `models/Credit.js`: userId, action, amount, balanceAfter, createdAt
    - `models/Badge.js`: userId, tier, thresholdAt, awardedAt; unique compound index `{ userId, tier }` for idempotent awards
    - _Requirements: 7.7, 8.4_

- [x] 3. Implement pure logic engines with property-based tests
  - [x] 3.1 Implement `decisionEngine.decide(conditionScore)`
    - Return "Resell" when score > 85, "Refurbish" when 65 ≤ score ≤ 85, "Donate" when 35 ≤ score < 65, "Recycle" when score < 35
    - Treat `decide` as the single source of truth: validate any candidate disposition against the score range and override a mismatched candidate with the disposition that matches the Condition_Score range before it is stored
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_
  - [x]* 3.2 Write property test for the decision engine
    - **Property 1: Decision engine assigns the correct disposition for every condition score**
    - Tag: `Feature: amazon-relife, Property 1`
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.6**
  - [x] 3.3 Implement `creditRules.creditsFor(action)` and `creditRules.applyAction(balance, action)`
    - Deltas: Resell +100, Donate +150, Recycle +75, BuyRefurbished +50, Return 0; `applyAction` returns `balance + delta`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x]* 3.4 Write property test for credit arithmetic
    - **Property 2: Green Credits arithmetic applies the exact action delta**
    - Tag: `Feature: amazon-relife, Property 2`
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6**
  - [x] 3.5 Implement `badgeRules.badgeFor(balance)` and `badgeRules.newlyEarned(prev, next)`
    - `badgeFor`: Gold ≥ 1000, Silver 500–999, Bronze 100–499, else null; `newlyEarned` returns tiers whose threshold lies in `(prev, next]`
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_
  - [x]* 3.6 Write property test for badge tiering
    - **Property 3: Badge tiering returns the correct highest tier for any balance**
    - Tag: `Feature: amazon-relife, Property 3`
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.5, 8.6**
  - [x]* 3.7 Write property test for badge award monotonicity
    - **Property 4: Badge awards are monotonic, idempotent, and never revoked**
    - Tag: `Feature: amazon-relife, Property 4`
    - **Validates: Requirements 8.4, 8.7**
  - [x] 3.8 Implement `geoService.haversine(a, b)`
    - Great-circle distance in km (Earth radius 6371) on `{lat,lng}` pairs; symmetric, non-negative, zero for identical points
    - _Requirements: 2.4, 11.2_
  - [x]* 3.9 Write unit tests for the distance function
    - Symmetry, non-negativity, zero-distance, and a known-distance fixture
    - _Requirements: 2.4, 11.2_
  - [x] 3.10 Implement `recoveryEngine.route(score, value, cost, threshold=2.0)`
    - Eligible iff score ≥ 90; not eligible → "Return To Seller" with null ratio; eligible → ratio = value/cost, "Return To Seller" iff ratio ≥ threshold else "Nearby Recovery Hub"; reject non-positive cost as invalid input
    - _Requirements: 9.2, 9.3, 9.4, 9.5_
  - [x]* 3.11 Write property test for recovery routing
    - **Property 5: Recovery routing follows the eligibility-then-ratio decision tree**
    - Tag: `Feature: amazon-relife, Property 5`
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.5**

- [x] 4. Checkpoint - Ensure all engine tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement authentication, middleware, and error model
  - [x] 5.1 Implement typed error classes and `errorMiddleware`
    - Create `AppError` base and `ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `InspectionError`, `IntegrationError`; `errorMiddleware` maps them to `{ error: { code, message, field? } }` with correct status codes
    - _Requirements: 3.3, 3.4, 5.5, 13.2_
  - [x] 5.2 Implement `authService` (register, login, verify)
    - Hash passwords with bcrypt, sign JWT carrying id + role on login, verify token; reject invalid credentials with `AuthenticationError`
    - _Requirements: 13.1, 13.2_
  - [x]* 5.3 Write property test for the auth token round trip
    - **Property 20: Authentication token round trip**
    - Tag: `Feature: amazon-relife, Property 20`
    - **Validates: Requirements 13.1**
  - [x] 5.4 Implement `authMiddleware` and `roleMiddleware`
    - `authMiddleware` verifies Bearer token, sets `req.user = { id, role }`, returns 401 when missing/invalid; `roleMiddleware(...roles)` returns 403 when role not allowed
    - _Requirements: 13.2, 13.3, 13.4_
  - [x] 5.5 Implement `validate(schema)` and `uploadMiddleware`
    - `validate` throws `ValidationError` with offending field; `uploadMiddleware` configures multer memory storage with file count/size and image/* + video/* mime limits, exposing `req.files`
    - Mount `uploadMiddleware` only after `authMiddleware` on the product-upload route so every upload requires a verified authenticated session with no guest or temporary-access exception
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 13.5_

- [x] 6. Implement integration adapters
  - [x] 6.1 Implement `s3Service.upload(buffer, meta)` and `getUrl(key)`
    - Put objects under `relife/{ownerId}/{productId}/{uuid}`, return `{ key, url }`; throw `IntegrationError` on failure
    - _Requirements: 3.2_
  - [x]* 6.2 Write integration test for S3 upload (mocked client)
    - Verify object key shape and stored reference
    - _Requirements: 3.2_
  - [x] 6.3 Implement `geminiVisionAdapter.analyze(media[])`
    - Build multimodal request, enforce `GEMINI_TIMEOUT_MS`, parse/validate JSON, clamp/round `conditionScore` to integer 0–100; throw `InspectionError` on API error or timeout, and also when the API responds successfully but returns unusable data (invalid JSON or a payload missing required Inspection_Report fields)
    - _Requirements: 4.1, 4.3, 4.5, 4.6_
  - [x]* 6.4 Write integration test for Gemini Vision adapter (mocked client)
    - Verify request shape and response parsing; verify timeout/error throws `InspectionError`, and that a successful-but-unusable response (invalid JSON / missing required fields) also throws `InspectionError`
    - _Requirements: 4.1, 4.5, 4.6_
  - [x] 6.5 Implement `geminiTextAdapter.summarizeFeedback(feedback)`
    - Construct prompt to extract `topComplaints`, `improvementSuggestions`, and `dominantComplaint`; enforce strict JSON schema output; fallback to simple generic extraction on repeated timeouts
    - _Requirements: 10.1, 10.2_
  - [x]* 6.6 Write integration test for Gemini text adapter (mocked client)
    - Verify request shape and parsed output structure
    - _Requirements: 12.1_

- [ ] 7. Implement listing, inspection, and passport services
  - [ ] 7.1 Implement `productService`
    - Validate required name/category and ≥1 image/video, upload media via `s3Service`, associate owner, persist Product (status="inspecting"); best-effort cleanup on partial upload failure
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]* 7.2 Write property test for submission validation
    - **Property 10: Submission validation rejects exactly the invalid submissions**
    - Tag: `Feature: amazon-relife, Property 10`
    - **Validates: Requirements 3.3, 3.4**
  - [ ] 7.3 Implement `inspectionService`
    - Call `geminiVisionAdapter`, build structurally complete `Inspection_Report`, sanitize condition score to integer 0–100, persist report, set status "complete"; on adapter failure (API error, timeout, or a successful response with unusable data such as invalid JSON or missing required Inspection_Report fields) set status "failed" and return descriptive error; invoke `decisionEngine` and persist disposition, then `passportService`
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 6.5_
  - [ ]* 7.4 Write property test for condition-score sanitation
    - **Property 11: Condition score is always an integer within 0–100**
    - Tag: `Feature: amazon-relife, Property 11`
    - **Validates: Requirements 4.3**
  - [ ]* 7.5 Write property test for inspection-report completeness
    - **Property 12: Inspection report is structurally complete**
    - Tag: `Feature: amazon-relife, Property 12`
    - **Validates: Requirements 4.2**
  - [ ]* 7.6 Write unit test for inspection failure handling
    - **Property 13: Inspection failures produce a failure status and descriptive error**
    - Tag: `Feature: amazon-relife, Property 13`
    - **Validates: Requirements 4.5, 4.6**
  - [ ] 7.7 Implement `passportService`
    - Build and persist Product Passport with productName, category, ownershipHistory (including owner), repairHistory, inspectionReport, conditionScore, expectedLifespanMonths; lookup returns passport or `NotFoundError`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ]* 7.8 Write property test for passport content completeness
    - **Property 14: Product Passport is content-complete and records the owner**
    - Tag: `Feature: amazon-relife, Property 14`
    - **Validates: Requirements 5.2, 5.3**
  - [ ]* 7.9 Write property test for passport create/fetch round trip
    - **Property 15: Passport create/fetch round trip**
    - Tag: `Feature: amazon-relife, Property 15`
    - **Validates: Requirements 5.4**

- [ ] 8. Implement credits and badges services
  - [ ] 8.1 Implement `creditsService`
    - Apply `creditRules.applyAction`, persist a Credits transaction with balanceAfter, update user balance, then call `badgeService` to evaluate new tiers
    - A Return action records a zero-credit transaction and leaves the balance unchanged, while every other voluntary action (Resell, Donate, Recycle, BuyRefurbished) is credited independently so a return in the same session never cancels their credits; record every credit transaction in the Credits collection
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  - [ ] 8.2 Implement `badgeService`
    - Use `badgeRules.newlyEarned`, persist awarded badges idempotently (rely on unique index), update denormalized `highestBadge`, expose highest tier for profile
    - Persist awarded badges independently of the live Green_Credits balance: once earned a tier record is never removed (a later balance drop never revokes a badge), and expose no badge when the user holds none
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  - [ ]* 8.3 Write integration tests for credits + idempotent badge awards
    - Verify transaction recorded, balance updated, and re-awarding a crossed tier creates no duplicate badge record
    - _Requirements: 7.7, 8.4_

- [ ] 9. Implement recovery and open box services
  - [ ] 9.1 Implement `recoveryService`
    - Request inspection for returned product, call `recoveryEngine`, persist `RecoveryProducts` record; on "Nearby Recovery Hub" trigger `openBoxService`
    - _Requirements: 9.1, 9.6_
  - [ ]* 9.2 Write property test for hub-routed Open Box publishing
    - **Property 16: Hub-routed products are published as Amazon Certified Open Box**
    - Tag: `Feature: amazon-relife, Property 16`
    - **Validates: Requirements 10.1**
  - [ ] 9.3 Implement `openBoxService`
    - Publish recovery-hub products with Amazon Certified Open Box label, expose conditionScore, inspectionReport, passport, and price
    - _Requirements: 10.1, 10.2, 10.3_
  - [ ]* 9.4 Write property test for Open Box display completeness
    - **Property 17: Open Box display is complete**
    - Tag: `Feature: amazon-relife, Property 17`
    - **Validates: Requirements 10.2, 10.3**

- [ ] 10. Implement search and recommendation services
  - [ ] 10.1 Implement `searchService`
    - Query matching new + ReLife + Open Box products; always include matching new products when they exist even if matching ReLife products also exist; when buyer location present, compute distances via `geoService` and order ReLife/Open Box ascending by distance; omit distance when location absent; return only new products when no ReLife matches
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 10.4_
  - [ ]* 10.2 Write property test for distance ordering
    - **Property 6: ReLife results are ordered by ascending distance when location is available**
    - Tag: `Feature: amazon-relife, Property 6`
    - **Validates: Requirements 2.4, 11.2**
  - [ ]* 10.3 Write property test for distance omission
    - **Property 7: Distance is omitted when buyer location is unavailable**
    - Tag: `Feature: amazon-relife, Property 7`
    - **Validates: Requirements 2.6**
  - [ ]* 10.4 Write property test for search completeness
    - **Property 8: Search includes all matching products of every kind**
    - Tag: `Feature: amazon-relife, Property 8`
    - **Validates: Requirements 2.1, 2.2, 10.4**
  - [ ]* 10.5 Write property test for ReLife result display-completeness
    - **Property 9: ReLife product results are display-complete**
    - Tag: `Feature: amazon-relife, Property 9`
    - **Validates: Requirements 2.3, 14.2**
  - [ ] 10.6 Implement `recommendationService`
    - Identify query-relevant ReLife products, select nearest by `geoService`, return "Similar ReLife Product Available Near You" recommendation or none
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  - [ ]* 10.7 Write property test for recommendation relevance
    - **Property 18: Recommendations are relevant to the query**
    - Tag: `Feature: amazon-relife, Property 18`
    - **Validates: Requirements 11.1, 11.4**

- [ ] 11. Implement seller intelligence service and authorization
  - [ ] 11.1 Implement `sellerInsightsService`
    - Aggregate reviews/ratings/return reasons, call `geminiTextAdapter`, compute dominant complaint percentage + suggestion, persist insights; return empty-insights result (`empty: true`) without calling Gemini when no feedback; expose owner-scope check (insights granted iff product owned by requesting seller)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 13.4_
  - [ ]* 11.2 Write property test for seller insights completeness
    - **Property 19: Seller insights output is complete for non-empty feedback**
    - Tag: `Feature: amazon-relife, Property 19`
    - **Validates: Requirements 12.2, 12.3**
  - [ ]* 11.3 Write property test for owner-scoped insight access
    - **Property 21: Seller insight access is owner-scoped**
    - Tag: `Feature: amazon-relife, Property 21`
    - **Validates: Requirements 13.4**

- [ ] 12. Checkpoint - Ensure all service tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement REST routers and wire the API
  - [ ] 13.1 Implement `authRouter`
    - `POST /api/auth/register`, `POST /api/auth/login` delegating to `authService`
    - _Requirements: 13.1, 13.2_
  - [ ] 13.2 Implement product, inspection, and passport routers
    - `productRouter` (`POST /api/products` auth+multipart running upload→inspection→decision→passport, `GET /api/products/:id`), `inspectionRouter` (`POST`/`GET /api/products/:id/inspection`), `passportRouter` (`GET /api/products/:id/passport` with 404)
    - Require an authenticated session for every product upload (`authMiddleware` before `uploadMiddleware`) with no guest or temporary-access exception
    - _Requirements: 3.1, 4.1, 4.4, 5.4, 5.5, 6.5, 13.5_
  - [ ] 13.3 Implement search and recommendation routers
    - `searchRouter` (`GET /api/search`), `recommendationRouter` (`GET /api/recommendations`)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 10.4, 11.1, 11.3, 11.4_
  - [ ] 13.4 Implement credits and badge routers
    - `creditsRouter` (`POST /api/credits/actions`, `GET /api/credits`), `badgeRouter` (`GET /api/badges`), all auth-guarded
    - _Requirements: 7.1, 7.7, 8.4, 8.5, 13.3_
  - [ ] 13.5 Implement recovery and open box routers
    - `recoveryRouter` (`POST /api/returns`, `GET /api/recovery`), `openBoxRouter` (`GET /api/openbox/:id`), auth-guarded
    - _Requirements: 9.1, 9.6, 10.1, 10.2, 10.3, 13.3_
  - [ ] 13.6 Implement seller intelligence router
    - `sellerRouter` (`GET /api/seller/insights/:productId`) guarded by auth + `roleMiddleware('seller')` + owner-scope check (403 if not owned)
    - _Requirements: 12.1, 12.4, 12.5, 13.4_
  - [ ] 13.7 Wire all routers and middleware into the Express app
    - Mount routers in `app.js`, register `authMiddleware`/`roleMiddleware` on protected routes, add `uploadMiddleware` to the product upload route after `authMiddleware` so every upload is authenticated with no guest exception, register central `errorMiddleware` last; connect Mongoose
    - _Requirements: 13.3, 13.5, 14.1_
  - [ ]* 13.8 Write integration tests for protected and key endpoints
    - 401 for unauthenticated protected routes, 403 for non-owner seller insights, 404 for missing passport, end-to-end upload→inspection→passport happy path with mocked adapters
    - _Requirements: 5.5, 13.3, 13.4_

- [ ] 14. Implement frontend foundation
  - [ ] 14.1 Implement API client and cross-cutting contexts
    - Axios client with JWT bearer interceptor and 401 handling; `AuthContext` (user/role/token), `ModeContext` (defaults to New_Products_Mode when no mode selected; while New Products Mode is active expose only new products and never ReLife products), `ProtectedRoute` wrapper redirecting unauthenticated users
    - _Requirements: 1.4, 1.6, 13.3_
  - [ ] 14.2 Implement reusable components
    - `ProductCard` (always shows Condition_Score for ReLife, distance + "Similar ReLife Product Available Near You" badge), `ConditionBadge`, `OpenBoxBadge`, `SearchBar`, `PassportView`, `CreditsPanel`, `BadgeShelf`, `InsightsPanel`, responsive Tailwind grid
    - _Requirements: 2.3, 11.3, 14.2, 14.5_
  - [ ]* 14.3 Write component tests for reusable components
    - Condition-score display, Open Box label, recommendation badge, responsive snapshots
    - _Requirements: 14.2, 14.5_

- [ ] 15. Implement frontend pages and routing
  - [ ] 15.1 Implement Login and Register pages
    - Forms calling auth API, storing token via `AuthContext`
    - _Requirements: 13.1, 14.1_
  - [ ] 15.2 Implement Home, Search, and ReLife Marketplace pages
    - `ModeToggle` control; separate New Products and ReLife Products tabs; while New Products Mode is active render only new products and never ReLife products; search results rendering new/ReLife/Open Box with condition score, distance, and price
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 14.1_
  - [ ] 15.3 Implement Upload Product, Product Details, and Product Passport pages
    - Upload form (name/category/media) posting multipart; Product Details with passport access link when present; Passport page via `PassportView` reachable only from the Product Details page (no passport entry point on search results, marketplace cards, or profile)
    - _Requirements: 3.1, 5.4, 14.1, 14.3_
  - [ ] 15.4 Implement Seller Dashboard and Recovery Hub Dashboard pages
    - Seller insights view via `InsightsPanel`; recovery hub inventory listing
    - _Requirements: 9.6, 12.2, 14.1_
  - [ ] 15.5 Implement Profile and Credits & Badges pages
    - Profile showing highest badge tier; Credits & Badges page showing balance and earned badges
    - _Requirements: 8.5, 14.1, 14.4_
  - [ ] 15.6 Wire React Router with all pages and protected routes
    - Configure all ten required routes plus auth routes; guard `/upload`, `/seller` (seller role), `/recovery`, `/profile`, `/credits`
    - _Requirements: 13.3, 14.1_
  - [ ]* 15.7 Write routing and page tests
    - Assert all ten pages resolve and protected routes redirect when unauthenticated; mode default and toggle behavior; New Products Mode shows only new products and never ReLife
    - _Requirements: 1.4, 1.5, 1.6, 13.3, 14.1_

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP; core implementation tasks are never optional.
- Each task references specific requirement sub-clauses for traceability.
- Property-based tests use `fast-check` (minimum 100 generated cases each) and are tagged `Feature: amazon-relife, Property {n}`; example/integration/snapshot tests cover wiring, persistence, and UI rendering.
- Pure engines (Properties 1–5) are implemented and property-tested first to validate the most correctness-critical logic before services depend on them.
- Checkpoints provide incremental validation between layers.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "3.1", "3.3", "3.5", "3.8", "3.10", "5.1", "14.1"] },
    { "id": 2, "tasks": ["3.2", "3.4", "3.6", "3.7", "3.9", "3.11", "5.2", "5.4", "5.5", "6.1", "6.3", "6.5", "14.2"] },
    { "id": 3, "tasks": ["5.3", "6.2", "6.4", "6.6", "7.1", "7.7", "8.2", "9.3", "10.1", "11.1", "14.3", "15.1", "15.2", "15.3", "15.4", "15.5"] },
    { "id": 4, "tasks": ["7.2", "7.3", "7.8", "7.9", "8.1", "9.4", "10.2", "10.3", "10.4", "10.5", "10.6", "11.2", "11.3", "15.6"] },
    { "id": 5, "tasks": ["7.4", "7.5", "7.6", "8.3", "9.1", "10.7", "15.7"] },
    { "id": 6, "tasks": ["9.2", "13.1", "13.2", "13.3", "13.4", "13.5", "13.6"] },
    { "id": 7, "tasks": ["13.7"] },
    { "id": 8, "tasks": ["13.8"] }
  ]
}
```
