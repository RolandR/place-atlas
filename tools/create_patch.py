import json
import os
import secrets
from pathlib import Path

patches_dir = "../data/patches/"
Path(patches_dir).mkdir(parents=True, exist_ok=True)

entry = None
entry_input = ""

print("Write/paste your JSON-formatted submission data here.")
while entry is None:
    
	entry_input += input("> ")
	try:
		entry = json.loads(entry_input)
	except:
		pass
print()
print("Submission is valid!")
print()
print("Enter your username as the attribution to be shown on the About page.")
print("Leave it empty if you don't want to be attributed.")
print("You can use your Reddit username. Do not include the \"u/\" part.")
print("You can also your GitHub username, but add \"gh:\" before your username (e.g. \"gh:octocat\")")
author = input("Author: ")

if author:
	entry['_author'] = author

filename = f'gh-{secrets.token_hex(2)}-{"-".join(entry["name"].split()).lower()}.json'
with open(f'{patches_dir}gh-{secrets.token_hex(2)}-{"-".join(entry["name"].split()).lower()}.json', 'w', encoding='utf-8') as out_file:
	out_file.write(json.dumps(entry, ensure_ascii=False))

print("Patch created as " + filename + "!")
print("You can commit the created file directly, to which you can push and create a pull request after that.")