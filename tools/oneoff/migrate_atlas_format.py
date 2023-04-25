#!/usr/bin/python

"""
Migrator script from old atlas format to remastered atlas format.
- center and path: single -> time-specific
- website and subreddit: single strings -> links object
- submitted_by removed
"""

import re
import json

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

def per_line_entries(entries: list):
	"""
	Returns a string of all the entries, with every entry in one line.
	"""
	out = "[\n"
	for entry in entries:
		if entry:
			out += json.dumps(entry, ensure_ascii=False) + ",\n"
	out = out[:-2] + "\n]"
	return out

if __name__ == '__main__':

	def go(path):

		print(f"Formatting {path}...")

		with open(path, "r+", encoding='UTF-8') as f1:
			entries = json.loads(f1.read())

		for i in range(len(entries)):
			entry_formatted = migrate_atlas_format(entries[i])
			entries[i] = entry_formatted
			if not (i % 1000):
				print(f"{i} checked.")

		print(f"{len(entries)} checked. Writing...")

		with open(path, "w", encoding='utf-8', newline='\n') as f2:
			f2.write(per_line_entries(entries))

		print("Writing completed. All done.")

	go("../web/atlas.json")
