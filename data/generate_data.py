import pandas as pd
import csv
import random
from random import choice
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
    fakeUsers.append({'username' : 'user' + str(i), 'password' : 'p', 'id' : 5 + i})
  pd.DataFrame(fakeUsers).to_csv('./fake_users.csv', index=False)
  
# have users affirm / deny businesses 
def random_affirm_deny(): 
  badges = pd.read_csv('./badges.csv')
  users = pd.read_csv('./fake_users.csv')
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
  rating = random.randrange(1, 5, 1)
  return {'id' : reviewId, 'userId' : userId, 'businessId' : businessId, 'content' : content, 'rating' : rating, 'timestamp' : time.time()}


def review_text():
  numSentences = random.randrange(2, 6, 1)
  text = ""
  for i in range(numSentences): 
    randText = lorem.sentence() 
    text += randText + " "
  return text
    
# generate_business_badges()
generate_users()
random_affirm_deny()