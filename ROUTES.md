# API Routing

## /api/user
| **URL**        | **HTTP Verb** |  **Action**|
|----------------|---------------|------------|
| `/user/:id?`   | GET           | Gets user specified by ID. if no ID given, returns all users
| `/user/`       | POST          | Create user and store username and password.   
| `/user/`       | PATCH         | Updates user information (username or password)  
| `/user/`       | DELETE        | Delete user from database 

## /api/business
| **URL**                | **HTTP Verb** |  **Action**|
|------------------------|---------------|------------|
| `/business/:id?`       | GET           | Gets business specified by ID. if no ID given, returns all businesses
| `/business/:id/reviews`| GET           | Gets all reviews of a specified business
| `/business/:id/badges` | GET           | Gets all badges of a specified business
| `/business/`           | POST          | Create business and store private account name and password.   
| `/business/:property`  | PATCH         | Updates business information (name, address, acount name, or password)  
| `/business/`           | DELETE        | Delete business from database 

## /api/session
| **URL**              | **HTTP Verb** |  **Action**|
|----------------------|---------------|------------|
| `/session`           | GET           | Gets any active session between client and api (both user or business)
| `/session/user`      | POST          | Validates password/username input and starts user session
| `/session/user`      | DELETE        | Ends user session if it exists
| `/session/business`  | POST          | Validates password/accountName input and starts business session
| `/session/business`  | DELETE        | Ends business session if it exists

## /api/review
| **URL**              | **HTTP Verb** |  **Action**|
|----------------------|---------------|------------|
| `/review/:id?`       | GET           | Gets all reviews by specified review ID. if no ID given, returns all reviews
| `/review/author/:id` | GET           | Gets all reviews by a specied user ID.
| `/review/`           | POST          | create review 
| `/review/`           | DELETE        | Delete business from database
| `/review/:id`        | PATCH         | update review information (rating AND content)  
| `/review/:id/likes`  | GET           | Gets likes of a specified review 
| `/review/:id/likes`  | POST          | like a freet (must have an active user session)
| `/review/:id/likes`  | DELETE        | unlike a freet (must have an active user session)

## /api/badge
| **URL**          | **HTTP Verb** |  **Action**|
|------------------|---------------|------------|
| `/badge`         | GET           | Get all badge templates
| `/badge/filter`  | GET           | Get all businesses that have a specified badge
| `/badge`         | POST          | Add a badge to a business (must have an active business session)  
| `/badge/id`      | DELETE        | Delete a specified badge (must have an active business session and badge must belong to business)
| `/badge/affirm`  | POST          | Affirm a badge (must have an active user session)  
| `/badge/affirm`  | DELETE        | Remove a previous Affirm of badge (must have an active user session)
| `/badge/deny`    | POST          | Deny a badge (must have an active user session)
| `/badge/deny`    | DELETE        | Remove a previous Deny of badge (must have an active user session)



## /api/search
| **URL**       | **HTTP Verb** |  **Action**|
|---------------|---------------|------------|
| `/search`     | GET           | Search for business by name, address, and other stuff?