#!/usr/bin/python

"""
Migrator script from old atlas format to remastered atlas format.
- center and path: single -> time-specific
- website and subreddit: single strings -> links object
- submitted_by removed
"""

from io import TextIOWrapper
import re
import json
import tqdm

COMMATIZATION = re.compile(r'[,;& ]+(?:and)?[,;& ]*?')
FS_REGEX = re.compile(r'(?:(?:(?:(?:https?:\/\/)?(?:(?:www|old|new|np)\.)?)?reddit\.com)?\/)?[rR]\/([A-Za-z0-9][A-Za-z0-9_]{1,20})(?:\/[^" ]*)*')

def migrate_atlas_format(entry: dict):
	new_entry = {
		"id": "",
		"name": "",
		"description": "",
		"links": {},
		"path": {},
		"center": {}
	}

	center = entry['center']
	path = entry['path']

	if isinstance(center, list):
		
		new_entry = {
			**new_entry,
			"center": {
				"T:0-1, 144": center
			},
			"path": {
				"T:0-1, 144": path
			}
		}

		del entry['center']
		del entry['path']

	if "website" in entry:
		if isinstance(entry["website"], str) and entry["website"]:
			new_entry['links']['website'] = [entry['website']]
		del entry['website']

	if "subreddit" in entry:
		if isinstance(entry["subreddit"], str) and entry["subreddit"]:
			new_entry['links']['subreddit'] = list(map(lambda x: FS_REGEX.sub(r"\1", x), COMMATIZATION.split(entry['subreddit'])))
		del entry['subreddit']
	
	toreturn = {
		**new_entry,
		**entry
	}

	return toreturn

def per_line_entries(entries: list, file: TextIOWrapper):
	"""
	Returns a string of all the entries, with every entry in one line.
	"""
	file.write("[\n")
	line_temp = ""
	for entry in tqdm.tqdm(entries):
		if line_temp:
			file.write(line_temp + ",\n")
		line_temp = json.dumps(entry, ensure_ascii=False)
	file.write(line_temp + "\n]")

if __name__ == '__main__':

	def go(path):

		print(f"Formatting {path}...")

		with open(path, "r+", encoding='UTF-8') as f1:
			entries = json.loads(f1.read())

		for i in tqdm.trange(len(entries)):
			entry_formatted = migrate_atlas_format(entries[i])
			entries[i] = entry_formatted

		print(f"{len(entries)} checked. Writing...")

		with open(path, "w", encoding='utf-8', newline='\n') as f2:
			per_line_entries(entries, f2)

		print("Writing completed. All done.")

	go("../web/atlas.json")
