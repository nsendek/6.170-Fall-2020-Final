import pandas as pd
import csv
import random
from random import choice
from random_username.generate import generate_username
import lorem
import time

def generate_business_badges(): 
  # open the businesses and badges csv
  businesses = pd.read_csv('./businesses.csv')
  badges = pd.read_csv('./badge_templates.csv')

  # assign badges to businesses
  businessBadges = []
  itemNumber = 1
  for index, row in businesses.iterrows(): 
    businessID = row["id"]
    for index, row in badges.iterrows(): 
      # randomly pick whether each badge is assigned or not
      if choice([True, False]):
        bbEntry = {'id' : itemNumber, 'label' : row['label'], 'businessId' : businessID}
        businessBadges.append(bbEntry)
        itemNumber += 1
  pd.DataFrame(businessBadges).to_csv('./badges.csv', index=False)


# create 100 fake users 
def generate_users():
  fakeUsers = []
  for i in range(100):
    username = generate_username(1)[0]
    fakeUsers.append({'username' : username, 'password' : 'p', 'id' : 5 + i})
  pd.DataFrame(fakeUsers).to_csv('./users.csv', index=False, columns= ['id', 'username', 'password'])
  
# have users affirm / deny businesses 
def random_reviews(): 
  badges = pd.read_csv('./badges.csv')
  users = pd.read_csv('./users.csv')
  reviewId = 0
  affirmations = []
  reviews = []
  for userIndex, userRow in users.iterrows(): 
    prev_review = -1 
    userID = userRow["id"]
    for badgeIndex, badgeRow in badges.iterrows(): 
      if random.random() < 0.33 or badgeRow["businessId"] == prev_review: 
        aff = 1
        if random.random() < 0.15 : 
          aff = -1
        react = {'userId' : userID, 'badgeId' : badgeRow['id'], 'values' : aff}
        affirmations.append(react) 
        if prev_review == -1:
          reviews.append(generate_review(userID, badgeRow["businessId"], reviewId))
          reviewId += 1
        prev_review = badgeRow["businessId"]
      else: 
        prev_review = -1 
  pd.DataFrame(affirmations).to_csv('./badge_reacts.csv', index=False)
  pd.DataFrame(reviews).to_csv('./reviews.csv', index=False)


def generate_review(userId, businessId, reviewId):
  content = review_text()

  randomNum = random.random()
  rating = 5
  if randomNum > 0.75: 
    rating = 5
  elif randomNum > 0.3:
    rating = 4
  elif randomNum > 0.2: 
    rating = 3
  elif randomNum > 0.05: 
    rating = 2
  else: 
    rating = 1

  return {'id' : reviewId, 'userId' : userId, 'businessId' : businessId, 'content' : content, 'rating' : rating, 'timestamp' : time.time()}


def review_text():
  numSentences = random.randrange(2, 6, 1)
  text = ""
  for i in range(numSentences): 
    randText = lorem.sentence() 
    text += randText + " "
  return text
    
# generate_business_badges()
# generate_users()
random_reviews()