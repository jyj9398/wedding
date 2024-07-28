from bs4 import BeautifulSoup

import requests, json

api_url = "https://api.esimsta.com/test/test"
url = "https://hoamwedding.com/wp-admin/admin-ajax.php"
months=['3','4','5']
dates_to_check = [
  {"month": "3", "date":'2025-03-08'},
  {"month": "3", "date":'2025-03-15'},
  {"month": "3", "date":'2025-03-22'},
  {"month": "3", "date":'2025-03-29'},
  {"month": "4", "date":'2025-04-05'},
  {"month": "4", "date":'2025-04-19'},
  {"month": "5", "date":'2025-05-10'}, 
  {"month": "5", "date":'2025-05-17'},
  {"month": "5", "date":'2025-05-24'},
  {"month": "5", "date":'2025-05-31'},
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


print("delim<<EOF")
for month in months:
  if month not in result:
    print(f"Month {month} has no available dates")
  else:
    print(f"Month {month} has available dates: {result[month]}")
print("EOF", end="")