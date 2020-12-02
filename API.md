# API Routing

## /api/user
| **URL**        | **HTTP Verb** |  **Action**|
|----------------|---------------|------------|
| `/user/:id?`   | GET           | Gets user specified by ID. if no ID given, returns all users
| `/user/`       | POST          | Create user and store username and password.  **Require variables `username`, `password` in body**     
| `/user/`       | PATCH         | Updates user information (username or password) (must have an active user session)
| `/user/`       | DELETE        | Delete user from database (must have an active user session)
|`/user/signin`  | POST          | Sign in as a user
|`/user/signout` | POST          | Sign out of a user account
|`/user/:username/search` | GET  | Search for a user by username

## /api/business
| **URL**                | **HTTP Verb** |  **Action**|
|------------------------|---------------|------------|
| `/business/:id?`       | GET           | Gets business specified by ID. if no ID given, returns all businesses.
| `/business/:id/reviews`| GET           | Gets all reviews of a specified business
| `/business/:id/badges` | GET           | Gets all badges of a specified business
| `/business/:id/rating` | GET           | Get the rating of a business
| `/business/`           | POST          | Create business and store accountName and password. **Require variables `name`, `accountName`, `password` in body**   
| `/business/:property`  | PATCH         | Updates business information (name, address, acountName, or password) (must have an active business session).  **Require variable named after `:property` value (i.e. `business/address` needs `address` variable  in the body** 
| `/business/`           | DELETE        | Delete business from database (must have an active business session)
| `/business/signin`     | POST | Sign in as a business
|`/business/signout`     | POST | Sign out from a business account

## /api/session
| **URL**              | **HTTP Verb** |  **Action**|
|----------------------|---------------|------------|
| `/session/`          | GET           | Gets any active session between client and api (both user or business)
<!-- | `/session/user`      | POST          | Validates password/username input and starts user session
| `/session/user`      | DELETE        | Ends user session if it exists
| `/session/business`  | POST          | Validates password/accountName input and starts business session
| `/session/business`  | DELETE        | Ends business session if it exists -->

## /api/review
| **URL**              | **HTTP Verb** |  **Action**|
|----------------------|---------------|------------|
| `/review/:id?`       | GET           | Gets all reviews by specified review ID. if no ID given, returns all reviews
| `/review/author/:id` | GET           | Gets all reviews by a specified user ID.
| `/review/`           | POST          | create review (must have an active user session). **Require variables `businessId`, `rating`, `content` in body** 
| `/review/`           | DELETE        | Delete business from database
| `/review/:id`        | PATCH         | update review information (must have an active user session). **Require variables `rating`, `content` in body** 
| `/review/:id/likes`  | GET           | Gets likes of a specified review 
| `/review/:id/likes`  | POST          | like a review (must have an active user session)
| `/review/:id/likes`  | DELETE        | unlike a review (must have an active user session)

## /api/badge
| **URL**             | **HTTP Verb** |  **Action**|
|---------------------|---------------|------------|
| `/badge/`           | GET           | Get all badge templates
| `/badge/filter`     | GET           | Get all businesses that have a specified badge. **Requires array variable `badges[]` in query.**
| `/badge/`           | POST          | Add a badge to a business (must have an active business session). **Requires string variable `label` in body.**
| `/badge/:id`        | DELETE        | Delete a specified badge (must have an active business session and badge must belong to business)
| `/badge/:id/affirm` | POST          | Affirm a badge (must have an active user session)  
| `/badge/affirm` | DELETE        | Remove a previous Affirm of badge (must have an active user session) **Requires int variable `id` in body.**
| `/badge/deny`   | POST          | Deny a badge (must have an active user session) **Requires int variable `id` in body.**
| `/badge/:id/deny`   | DELETE        | Remove a previous Deny of badge (must have an active user session)

## /api/search
| **URL**       | **HTTP Verb** |  **Action**|
|---------------|---------------|------------|
| `/search`     | GET           | Search for business by name, address, and other stuff?