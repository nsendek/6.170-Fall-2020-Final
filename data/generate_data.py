import pandas as pd
import csv
import random
from random import choice

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
    # TIMESTAMP ?
    fakeUsers.append({'username' : 'user' + str(i), 'password' : 'p', 'id' : 1000 + i})
  pd.DataFrame(fakeUsers).to_csv('./fake_users.csv', index=False)
  
# have users affirm / deny businesses 
def random_affirm_deny(): 
  badges = pd.read_csv('./badges.csv')
  users = pd.read_csv('./fake_users.csv')
  affirmations = []
  for index, row in users.iterrows(): 
    prev_review = -1 
    userID = row["id"]
    for index, row in badges.iterrows(): 
      if random.random() < 0.33 or row["businessId"] == prev_review: 
        aff = 1
        if random.random() < 0.15 : 
          aff = -1
        react = {'userId' : userID, 'badgeId' : row['id'], 'values' : aff}
        affirmations.append(react) 
        prev_review = row["businessId"]
  pd.DataFrame(affirmations).to_csv('./badge_reacts.csv', index=False)

# generate_business_badges()
# generate_users()
random_affirm_deny()