
import praw
import json

outfile = open('temp_atlas.json', 'w')
failfile = open('manual_atlas.json', 'w')

credentials = open('credentials', 'r')
client_id = credentials.readline().strip(' \t\n\r')
client_secret = credentials.readline().strip(' \t\n\r')

reddit = praw.Reddit(client_id=client_id, client_secret=client_secret, user_agent='atlas_bot')

failcount = 0
successcount = 0

latestID = int(input("Latest ID: "))

for submission in reddit.subreddit('placeAtlas2').new(limit=220):
	"""
	Auth setup
	1. Head to https://www.reddit.com/prefs/apps
	2. Click "create another app"
	3. Give it a name and description
	4. Select "script"
	5. Redirect to http://localhost:8080
	6. Copy ID (under Personal Use Script)
	7. Append to file called "credentials"
	8. Copy Secret 
	9. Append on newline to "credentials" file
	10. Run Script

	Running Script
	1. Input the next ID to use
	2. Manually resolve errors in manual_atlas.json
	3. Copy temp_atlas.json entries into web/_js/atlas.js
	4. Pull Request

	"""
	#print(dir(submission))
	if(submission.link_flair_text == "New Entry"):
		text = submission.selftext
		text = text.replace("\\", "")
		text = text.replace("\"id\": 0,", "\"id\": 0,\n\t\t\"submitted_by\": \""+submission.author.name+"\",")

		lines = text.split("\n")

		text = "\n".join(lines)

		for i, line in enumerate(lines):
			if("\"id\": 0" in line):
				lines[i] = line.replace("\"id\": 0", "\"id\": "+str(latestID))
				latestID = latestID + 1
		
		try:
			outfile.write(json.dumps(json.loads(text))+",\n")
		except json.JSONDecodeError:
			print("Errored "+submission.title)
			failfile.write(text+",\n")
			failcount += 1
		print("written "+submission.title)
		successcount += 1
	else:
		print("skipped "+submission.title)

print(f"\n\nSuccess: {successcount}\nFail: {failcount}\nPlease check manual_atlas.txt for failed entries to manually resolve.")