from bs4 import BeautifulSoup

import requests

url = "https://hoamwedding.com/wp-admin/admin-ajax.php"
dates_to_check = [
  '2025-03-09',
  '2025-03-16',
  '2025-03-23',
  '2025-03-30',
  '2025-04-06',
  '2025-04-13',
  '2025-04-20',
  '2025-04-27',
  '2025-05-11', 
  '2025-05-18',
  '2025-05-25',
]
# iterate for dates_to_check
result = {}
for date in dates_to_check:
  payload = 'action=booked_calendar_date&date={}&calendar_id=0'.format(date)
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  response = requests.request("POST", url, headers=headers, data=payload)

  soup = BeautifulSoup(response.text, 'html.parser')

  # Find the div for the 1 PM timeslot
  timeslot_1pm = soup.find('span', string='1:00 오후').parent.parent

  # Extract the text of the reservation button
  button_text = timeslot_1pm.find('span', class_='button-text').text
  result[date] = button_text == "예약하기"

print(result)