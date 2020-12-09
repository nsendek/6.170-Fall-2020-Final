
# [Zelp](https://nvhj-zelp-v2.herokuapp.com/)
## [NVHJ]
### Purpose and Functionality
Describe the purpose and functionality of your application (~50 words) 

At our MVP, users and businesses can interact with the Zelp platform with nearly all of the functionality. Users can create and edit accounts, filter businesses by badge, and leave reviews on businesses they've visited. Businesses can also create and edit their accounts, and they can manage the set of badges that represent the policies that they are upholding.


### Instructions to Run Locally:
In command line:
```console
$ npm run build
$ npm run serve
```
In a separate shell:
```console
$ npm run dev
```
then you will find the application at `localhost:8080` in the browser

### Authorship:
* **Howard DaCosta**:
  * src
    * BusinessCreateAccount.vue
    * BusinessProfile.vue
    * UserLogin.vue (business logic)
    * BusinessProfilePage.vue
    * Review Page (affirm / deny badges)
  * models:
    * Badge.js
      * `affirm`
      * `deny`
    * Businesses.js
      * `create (added address creation)`
  * routes:
    * businesses.js
      * `POST/api/business/signin`
      * `POST/api/business/signout`
      * `POST/api/business/:id/rating`
    * badges.js
      * `POST/api/badge/affirm`
      * `POST/api/badge/deny`
    * users.js
      * `GET/api/user/:username/search`
* **Niko Sendek**:
  * db:
    * sqlite.js 
  * models:
    * Businesses.js
    * Reviews.js
    * Users.js
    * Badge.js
  * routes:
    * businesses.js
    * reviews.js
    * users.js
    * session.js
    * search.js
    * validators.js
  * src:
    * Feed.vue
    * Pane.vue
    * SearchView.vue
    * BusinessView.vue
    * EventHandler.vue
    * Overlay.vue
    * vuetify.js
    * router.js
* **Josh Verdejo**:
  * src
    * Main.Vue (Added Google Maps functionality)
  
* **Violetta Jusiega**:
  * db
    * generate_data.py
  * src
    * NavBar.vue
    * UserCreateAccount.vue
    * UserLogin.vue
    * UserProfile.vue
    * LoginPage.vue
    * BusinessFeed.vue (implemented pagination) 
  * web.css
    * g-map
    * map-pane
