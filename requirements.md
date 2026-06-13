# Requirements Document

## Introduction

Amazon ReLife is a circular-commerce layer integrated inside the Amazon shopping experience. It is not a separate marketplace; instead it adds capabilities that allow customers to resell unused products, intelligently recover returned products, surface trusted second-life products inside Amazon search, and provide sellers with AI-powered insights. The goal is to ensure every product finds its best next life.

The system serves three primary personas: an owner who lists products that are not return-eligible (resell, refurbish, donate, or recycle), a returning customer whose low-value returns are intelligently routed to either the seller or a nearby recovery hub, and a small seller who receives AI-generated review and return intelligence. The platform is a production-quality MVP built as a full-stack web application.

This document defines the functional and quality requirements for the Amazon ReLife feature across nine modules: ReLife mode and marketplace, AI product inspection, product passport, decision engine, green credits and badges, recovery hub engine, open box marketplace, buyer recommendation engine, and seller intelligence dashboard.

## Glossary

- **ReLife_System**: The complete Amazon ReLife circular-commerce application, including frontend, backend, and data stores.
- **Listing_Owner**: A registered customer who lists a personally owned product that is not return-eligible (persona: Rahul).
- **Returning_Customer**: A registered customer who returns a previously purchased product (persona: Priya).
- **Seller**: A registered merchant who sells products on Amazon and uses the seller intelligence features (persona: Small Seller).
- **Buyer**: A registered customer who searches for and purchases products, including ReLife and Open Box products.
- **ReLife_Mode**: A user interface mode that displays ReLife (second-life) products, as distinct from New Products Mode.
- **New_Products_Mode**: A user interface mode that displays standard new Amazon products.
- **Search_Service**: The component that returns search results, including new products and nearby ReLife products.
- **AI_Inspection_Service**: The component that analyzes uploaded product images and video using the Gemini Vision API and produces an inspection report.
- **Inspection_Report**: A structured result containing Condition Score, Scratch Analysis, Damage Detection, Missing Components, and Expected Lifespan.
- **Condition_Score**: An integer from 0 to 100 representing assessed product condition, where higher values indicate better condition.
- **Expected_Lifespan**: An estimated remaining usable duration of a product, expressed in months.
- **Product_Passport_Service**: The component that generates and stores a Product Passport.
- **Product_Passport**: A trust record containing Product Name, Category, Ownership History, Repair History, Inspection Report, Condition Score, and Expected Lifespan.
- **Decision_Engine**: The component that assigns a ReLife disposition (Resell, Refurbish, Donate, or Recycle) based on Condition Score.
- **ReLife_Disposition**: One of the values Resell, Refurbish, Donate, or Recycle assigned to a listed product.
- **Green_Credits_Service**: The component that awards Green Credits and badges for voluntary sustainability actions.
- **Green_Credits**: A non-negative integer point balance awarded for sustainability actions.
- **Badge**: A recognition tier awarded based on Green Credits, with tiers Bronze Circular Citizen (awarded at 100 Green_Credits), Silver Circular Citizen (awarded at 500 Green_Credits), and Gold Circular Citizen (awarded at 1000 Green_Credits).
- **Recovery_Hub_Engine**: The component that determines routing of returned products between the seller and a recovery hub.
- **Recovery_Ratio**: A numeric value calculated as Product Value divided by Logistics Cost.
- **High_Ratio_Threshold**: The configured Recovery_Ratio boundary used to route Recovery Eligible returns, with a default value of 2.0; a Recovery_Ratio at or above this value routes to the seller, and a Recovery_Ratio below this value routes to a nearby recovery hub.
- **Recovery_Hub**: A physical location near the Returning_Customer that stores recovered products as Open Box inventory.
- **Open_Box_Service**: The component that publishes recovery hub products as Amazon Certified Open Box inventory.
- **Open_Box_Product**: A recovered product listed for sale with an Amazon Certified Open Box label.
- **Recommendation_Engine**: The component that recommends relevant nearby ReLife products to buyers.
- **Seller_Intelligence_Service**: The component that produces review summaries, top complaints, and product improvement suggestions for sellers.
- **Authentication_Service**: The component that authenticates users and authorizes access to features.
- **Location**: A geographic coordinate pair (latitude and longitude) associated with a user or recovery hub.
- **Distance**: The geographic distance in kilometers between two Locations.

## Requirements

### Requirement 1: Mode Switching Between New Products and ReLife

**User Story:** As a Buyer, I want to switch between New Products Mode and ReLife Mode, so that I can browse standard products and second-life products within one Amazon experience.

#### Acceptance Criteria

1. THE ReLife_System SHALL display a control that allows a Buyer to select either New_Products_Mode or ReLife_Mode.
2. WHEN a Buyer selects ReLife_Mode, THE ReLife_System SHALL display ReLife products in the active view.
3. WHEN a Buyer selects New_Products_Mode, THE ReLife_System SHALL display new products in the active view.
4. WHILE New_Products_Mode is active, THE ReLife_System SHALL display only new products and SHALL NOT display ReLife products.
5. THE ReLife_System SHALL display New Products and ReLife Products in separate tabs.
6. WHEN a Buyer has not selected a mode, THE ReLife_System SHALL default to New_Products_Mode.

### Requirement 2: Unified Search With Nearby ReLife Results

**User Story:** As a Buyer, I want Amazon search to show both new products and nearby ReLife products, so that I can discover trusted second-life options without leaving search.

#### Acceptance Criteria

1. WHEN a Buyer submits a search query, THE Search_Service SHALL return matching new products and matching ReLife products in the result set.
2. WHEN a Buyer submits a search query and matching new products exist, THE Search_Service SHALL return those matching new products even if matching ReLife products also exist.
3. WHEN the Search_Service returns a ReLife product, THE ReLife_System SHALL display the product name, Condition_Score, Distance in kilometers, and price for that product.
4. WHEN a Buyer Location is available and ReLife products match the query, THE Search_Service SHALL order ReLife results by ascending Distance from the Buyer Location.
5. IF no ReLife products match the search query, THEN THE Search_Service SHALL return only new product results.
6. IF a Buyer Location is unavailable, THEN THE Search_Service SHALL return ReLife results without a Distance value.

### Requirement 3: Product Listing Upload by Owner

**User Story:** As a Listing_Owner, I want to upload a product that is not return-eligible, so that the system can decide its best next life.

#### Acceptance Criteria

1. WHEN a Listing_Owner submits a product with a name, category, and at least one image or video, THE ReLife_System SHALL create a product record in the Products collection.
2. WHEN a Listing_Owner uploads an image or video, THE ReLife_System SHALL store the uploaded file in AWS S3 and associate the stored file reference with the product record.
3. IF a Listing_Owner submits a product without at least one image or video, THEN THE ReLife_System SHALL reject the submission and SHALL return a validation error that identifies the missing media as part of the rejection.
4. IF a Listing_Owner submits a product without a name or category, THEN THE ReLife_System SHALL reject the submission and SHALL return a validation error that identifies the missing field as part of the rejection.
5. WHEN a product record is created, THE ReLife_System SHALL associate the product record with the authenticated Listing_Owner.

### Requirement 4: AI Product Inspection

**User Story:** As a Listing_Owner, I want the system to inspect my uploaded product using AI, so that its condition is assessed objectively.

#### Acceptance Criteria

1. WHEN a product with uploaded media is submitted for inspection, THE AI_Inspection_Service SHALL request analysis from the Gemini Vision API using the uploaded media.
2. WHEN the Gemini Vision API returns analysis results, THE AI_Inspection_Service SHALL generate an Inspection_Report containing a Condition_Score, Scratch Analysis, Damage Detection, Missing Components, and Expected_Lifespan.
3. THE AI_Inspection_Service SHALL produce a Condition_Score as an integer between 0 and 100 inclusive.
4. WHEN an Inspection_Report is generated, THE AI_Inspection_Service SHALL store the Inspection_Report associated with the product record.
5. IF the Gemini Vision API returns an error or does not respond within the configured timeout, THEN THE AI_Inspection_Service SHALL record an inspection failure status for the product and return a descriptive error.
6. IF the Gemini Vision API responds successfully but returns unusable data, including invalid JSON or a response missing required Inspection_Report fields, THEN THE AI_Inspection_Service SHALL record an inspection failure status for the product and return a descriptive error.

### Requirement 5: Product Passport Generation

**User Story:** As a Buyer, I want each ReLife product to have a Product Passport, so that I can trust its history and condition.

#### Acceptance Criteria

1. WHEN an Inspection_Report is generated for a product, THE Product_Passport_Service SHALL create a Product_Passport in the ProductPassports collection.
2. THE Product_Passport SHALL contain the Product Name, Category, Ownership History, Repair History, Inspection_Report, Condition_Score, and Expected_Lifespan.
3. WHEN a Listing_Owner is associated with a listed product, THE Product_Passport_Service SHALL record that owner in the Ownership History of the Product_Passport.
4. WHEN a Buyer requests a Product_Passport for a product, THE ReLife_System SHALL return the Product_Passport for that product.
5. IF a product has no generated Product_Passport, THEN THE ReLife_System SHALL return a not-found result when the Product_Passport is requested.

### Requirement 6: ReLife Decision Engine

**User Story:** As a Listing_Owner, I want the system to decide whether my product should be resold, refurbished, donated, or recycled, so that it follows the best circular path.

#### Acceptance Criteria

1. WHEN a Condition_Score greater than 85 is assigned to a listed product, THE Decision_Engine SHALL assign the ReLife_Disposition Resell.
2. WHEN a Condition_Score from 65 to 85 inclusive is assigned to a listed product, THE Decision_Engine SHALL assign the ReLife_Disposition Refurbish.
3. WHEN a Condition_Score from 35 to below 65 is assigned to a listed product, THE Decision_Engine SHALL assign the ReLife_Disposition Donate.
4. WHEN a Condition_Score below 35 is assigned to a listed product, THE Decision_Engine SHALL assign the ReLife_Disposition Recycle.
5. WHEN the Decision_Engine assigns a ReLife_Disposition, THE Decision_Engine SHALL store the ReLife_Disposition in the product record.
6. WHEN the Decision_Engine assigns a ReLife_Disposition, THE Decision_Engine SHALL assign exactly the ReLife_Disposition that matches the Condition_Score range, and IF a candidate disposition does not match the Condition_Score range, THEN THE Decision_Engine SHALL override it with the ReLife_Disposition that matches the Condition_Score range.

### Requirement 7: Green Credits for Voluntary Sustainability Actions

**User Story:** As a Listing_Owner, I want to earn Green Credits for sustainable actions, so that I am rewarded for circular behavior.

#### Acceptance Criteria

1. WHEN a Listing_Owner completes a Resell action, THE Green_Credits_Service SHALL add 100 Green_Credits to the user balance.
2. WHEN a Listing_Owner completes a Donate action, THE Green_Credits_Service SHALL add 150 Green_Credits to the user balance.
3. WHEN a Listing_Owner completes a Recycle action, THE Green_Credits_Service SHALL add 75 Green_Credits to the user balance.
4. WHEN a Buyer completes a purchase of a refurbished product, THE Green_Credits_Service SHALL add 50 Green_Credits to the Buyer balance for the Buy Refurbished action.
5. WHEN a Returning_Customer completes a product return, THE Green_Credits_Service SHALL award zero Green_Credits for the return action itself and SHALL leave the user Green_Credits balance unchanged for that return action.
6. WHEN a user completes a Resell, Donate, Recycle, or Buy Refurbished action, THE Green_Credits_Service SHALL award the Green_Credits corresponding to that action even if a product return occurs in the same session.
7. WHEN Green_Credits are added to a user balance, THE Green_Credits_Service SHALL record the credit transaction in the Credits collection.

### Requirement 8: Badges Based on Green Credits

**User Story:** As a Buyer, I want to earn Circular Citizen badges, so that my sustainability contribution is recognized.

#### Acceptance Criteria

1. WHEN a user Green_Credits balance reaches 100 Green_Credits, THE Green_Credits_Service SHALL award the Bronze Circular Citizen Badge.
2. WHEN a user Green_Credits balance reaches 500 Green_Credits, THE Green_Credits_Service SHALL award the Silver Circular Citizen Badge.
3. WHEN a user Green_Credits balance reaches 1000 Green_Credits, THE Green_Credits_Service SHALL award the Gold Circular Citizen Badge.
4. WHEN a Badge is awarded, THE Green_Credits_Service SHALL record the Badge in the Badges collection associated with the user.
5. WHILE a user holds a Badge, THE ReLife_System SHALL display the highest earned Badge tier on the user profile.
6. WHILE a user holds no Badge, THE ReLife_System SHALL NOT display any Badge on the user profile.
7. WHEN a user has earned a Badge, THE ReLife_System SHALL continue to display that Badge regardless of whether the current Green_Credits balance later drops below the earning threshold.

### Requirement 9: Recovery Hub Routing for Returns

**User Story:** As a Returning_Customer, I want the system to route my returned product intelligently, so that low-value returns avoid wasteful reverse logistics.

#### Acceptance Criteria

1. WHEN a Returning_Customer submits a product return, THE Recovery_Hub_Engine SHALL request an Inspection_Report from the AI_Inspection_Service for the returned product.
2. IF the returned product Condition_Score is below 90, THEN THE Recovery_Hub_Engine SHALL assign the routing decision Return To Seller.
3. WHEN the returned product Condition_Score is 90 or above, THE Recovery_Hub_Engine SHALL mark the returned product as Recovery Eligible and calculate the Recovery_Ratio as Product Value divided by Logistics Cost.
4. WHERE a returned product is Recovery Eligible and the Recovery_Ratio is at or above the High_Ratio_Threshold of 2.0, THE Recovery_Hub_Engine SHALL assign the routing decision Return To Seller.
5. WHERE a returned product is Recovery Eligible and the Recovery_Ratio is below the High_Ratio_Threshold of 2.0, THE Recovery_Hub_Engine SHALL assign the routing decision Nearby Recovery Hub.
6. WHEN the Recovery_Hub_Engine assigns a routing decision, THE Recovery_Hub_Engine SHALL store the returned product and routing decision in the RecoveryProducts collection.

### Requirement 10: Open Box Marketplace Publishing

**User Story:** As a Buyer, I want recovered products to appear as Amazon Certified Open Box, so that I can purchase verified second-life products.

#### Acceptance Criteria

1. WHEN a returned product is routed to a Nearby Recovery Hub, THE Open_Box_Service SHALL publish the product as an Open_Box_Product with an Amazon Certified Open Box label.
2. WHEN an Open_Box_Product is displayed, THE Open_Box_Service SHALL display the Condition_Score, Inspection_Report, and Product_Passport for that product.
3. WHEN an Open_Box_Product is published, THE Open_Box_Service SHALL display the Open_Box_Product price.
4. WHEN a Buyer searches in ReLife_Mode, THE Search_Service SHALL include matching Open_Box_Product items in the result set.

### Requirement 11: Buyer Recommendation Engine

**User Story:** As a Buyer, I want relevant nearby ReLife products recommended during search, so that I can find second-life alternatives that fit my needs.

#### Acceptance Criteria

1. WHEN a Buyer submits a search query, THE Recommendation_Engine SHALL identify ReLife products relevant to the search query.
2. WHEN relevant ReLife products are identified and a Buyer Location is available, THE Recommendation_Engine SHALL select nearby ReLife products ordered by ascending Distance from the Buyer Location.
3. WHEN at least one relevant nearby ReLife product is selected, THE ReLife_System SHALL display a "Similar ReLife Product Available Near You" indicator with the recommended product in the search results.
4. IF no relevant ReLife product is identified for the search query, THEN THE Recommendation_Engine SHALL return no ReLife recommendation for that query.

### Requirement 12: Seller Intelligence Dashboard

**User Story:** As a Seller, I want AI-generated review and return insights, so that I can improve my products.

#### Acceptance Criteria

1. WHEN a Seller requests insights for a product, THE Seller_Intelligence_Service SHALL process the product reviews, ratings, and return reasons for that product.
2. WHEN the Seller_Intelligence_Service processes product feedback, THE Seller_Intelligence_Service SHALL produce a Review Summary, a list of Top Complaints, and a list of Product Improvement Suggestions.
3. WHEN the Seller_Intelligence_Service identifies a dominant complaint category, THE Seller_Intelligence_Service SHALL include the complaint percentage and a corresponding improvement suggestion in the output.
4. WHEN insights are produced for a product, THE Seller_Intelligence_Service SHALL store the insights in the SellerInsights collection.
5. IF a product has no reviews, ratings, or return reasons, THEN THE Seller_Intelligence_Service SHALL return an empty-insights result for that product.

### Requirement 13: User Authentication and Authorization

**User Story:** As a registered user, I want my actions to be authenticated and authorized, so that my data and role-specific features are protected.

#### Acceptance Criteria

1. WHEN a user submits valid credentials, THE Authentication_Service SHALL establish an authenticated session for that user.
2. IF a user submits invalid credentials, THEN THE Authentication_Service SHALL reject the request and return an authentication error.
3. WHILE a user is unauthenticated, THE ReLife_System SHALL restrict access to product upload, profile, credits, seller dashboard, and recovery hub dashboard features.
4. WHEN a Seller requests the Seller Intelligence Dashboard, THE Authentication_Service SHALL authorize access only for products owned by that Seller.
5. THE ReLife_System SHALL require an authenticated session for every product upload and SHALL provide no guest or temporary-access exception for product uploads.

### Requirement 14: Application Pages and Responsive Interface

**User Story:** As a user, I want a modern, Amazon-inspired responsive interface, so that the ReLife experience feels built into Amazon.

#### Acceptance Criteria

1. THE ReLife_System SHALL provide the following pages: Home, Search, Amazon ReLife Marketplace, Upload Product, Product Details, Product Passport, Seller Dashboard, Recovery Hub Dashboard, Profile, and Credits & Badges.
2. THE ReLife_System SHALL render product listings using card components that display the Condition_Score.
3. WHERE a product has a Product_Passport, THE ReLife_System SHALL provide access to the Product_Passport only from the Product Details page.
4. THE ReLife_System SHALL display the user Green_Credits balance and earned Badges on the Credits & Badges page.
5. WHEN the viewport width changes, THE ReLife_System SHALL adapt the page layout to remain usable across desktop and mobile widths.
