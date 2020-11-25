
# [Zelp](https://nvhj-zelp.herokuapp.com/)
## [NVHJ]
### Purpose and Functionality
Describe the purpose and functionality of your application (~50 words) 

At this stage, users will be able to filter businesses by the badges that they have added. Once populated with the businesses in Cambridge, it will allow users to narrow down establishments that follow any given set of safety precautions.

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
    * BusinessFeed.vue
    * BusinessFeedItem.vue
  * models:
    * Badge.js
  * routes:
    * badges.js
* **Niko Sendek**:
  * db
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
    * validators.js
  * src
    * Feed.vue
    * BusinessView.vue
    * EventHandler.vue
* **Josh Verdejo**:
  * src
    * Main.Vue (Added Google Maps functionality)
  
* **Violetta Jusiega**:
  * web.css
    * g-map
    * map-pane
