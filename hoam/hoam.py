from bs4 import BeautifulSoup

import requests, json

api_url = "https://api.esimsta.com/test/test"
url = "https://hoamwedding.com/wp-admin/admin-ajax.php"
months=['3','4','5']
dates_to_check = [
  {"month": "3", "date":'2025-03-09'},
  {"month": "3", "date":'2025-03-16'},
  {"month": "3", "date":'2025-03-23'},
  {"month": "3", "date":'2025-03-30'},
  {"month": "4", "date":'2025-04-06'},
  {"month": "4", "date":'2025-04-13'},
  {"month": "4", "date":'2025-04-20'},
  {"month": "4", "date":'2025-04-27'},
  {"month": "5", "date":'2025-05-11'}, 
  {"month": "5", "date":'2025-05-18'},
  {"month": "5", "date":'2025-05-25'},
]
# iterate for dates_to_check
result = {}
for pair in dates_to_check:
  month = pair['month']
  date = pair['date']
  payload = json.dumps({
    'url': url,
    'action': 'booked_calendar_date',
    'date': date,
    'calendar_id': '0'
  })
  headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
  }

  response = requests.request("POST", api_url, headers=headers, data=payload)

  soup = BeautifulSoup(json.loads(response.text)['data'][0], 'html.parser')

  # Find the div for the 1 PM timeslot
  timeslot_1pm = soup.find('span', string='1:00 오후').parent.parent

  # Extract the text of the reservation button
  button_text = timeslot_1pm.find('span', class_='button-text').text
  if button_text == "예약하기":
    if month in result:
      result[month].append(date)
    else:
      result[month] = [date]


for month in months:
  if month not in result:
    print(f"Month {month} has no available datesEOF")
  else:
    print(f"Month {month} has available dates: {result[month]}EOF")
print("end")
print("EOF", end="")