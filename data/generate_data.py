import pandas as pd
import csv
from random import choice

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
  
