import smtplib
import unicodedata
import datetime
import time

# Email credentials
SENDER_EMAIL = "reidwyde@gmail.com"
SENDER_PASSWORD = "ttfq imgu akry fjgd"
RECIPIENT_EMAIL = "reidwyde@gmail.com"

# Function to remove non-ASCII characters
def remove_non_ascii(text):
    return unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')

while True:
    # Get the current time
    now = datetime.datetime.now()

    # Only send emails between 9am and 9pm
    if now.hour >= 9 and now.hour < 21:
        # Read the to-do list from file
        todo_list = ""
        with open("C:\\Users\\Reid\\Desktop\\todo.txt", "r", encoding="utf-8") as file:
            todo_list = file.read()

        todo_list = remove_non_ascii(todo_list.strip())

        # Email subject with today's date
        subject = f"TODO {datetime.date.today()}"
        message = f"Subject: {subject}\n\n{todo_list}"

        # Send the email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, message)

        print("Email sent successfully!")

        # Wait for 2 hours before sending the next email
        time.sleep(2 * 60 * 60)  # Sleep for 2 hours (in seconds)
    else:
        # If it's outside of the allowed time range, wait until 9am the next day
        next_send_time = datetime.datetime.combine(now.date() + datetime.timedelta(days=1), datetime.time(9, 0))
        time_to_wait = (next_send_time - now).total_seconds()
        print(f"Waiting until {next_send_time} to send the next email...")
        time.sleep(time_to_wait)


