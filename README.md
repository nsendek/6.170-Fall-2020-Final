
# [Zelp](https://nvhj-zelp-v2.herokuapp.com/)
## [NVHJ]
### Purpose and Functionality
Describe the purpose and functionality of your application (~50 words) 

For our final product, Zelp has a its full set of functionality. From our MVP, users can now
 (1) post and edit reviews about businesses
 (2) rank the safety policies most important to them. Zelp now sorts business results based on these preferences. Businesses, on the other hand, can view  metrics about each of their posted safety policies.

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
    * BusinessProfilePage.vue
    * UserProfile.vue
    * UserProfilePage.vue
    * Review Page (affirm / deny badges)
  * models:
    * Badge.js
      * `ratio`
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
