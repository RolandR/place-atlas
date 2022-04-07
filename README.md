[![Entry count](https://img.shields.io/badge/dynamic/json?color=blue&label=count&query=%24.length&url=https%3A%2F%2Fgithub.com%2FplaceAtlas%2Fatlas%2Fblob%2Fmaster%2Fweb%2Fatlas.json%3Fraw%3Dtrue)](https://place-atlas.stefanocoding.me/)
![Commit activity](https://img.shields.io/github/commit-activity/w/placeAtlas/atlas)
![Netlify](https://img.shields.io/netlify/1e7291ce-0680-45ed-9843-47a32a992bbb?logo=netlify&logoColor=white)
[![License](https://img.shields.io/github/license/placeAtlas/atlas)](https://github.com/placeAtlas/atlas/blob/master/LICENSE)  
[![Discord](https://img.shields.io/discord/960791635342524496?color=%235865F2&logo=discord&logoColor=white)](https://discord.gg/pJkm23b2nA)
[![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/placeAtlas2?color=%23FF4500&label=r%2FplaceAtlas2&logo=reddit&logoColor=white)](https://www.reddit.com/r/placeAtlas2/)
[![Website](https://img.shields.io/static/v1?label=website&message=place-atlas.stefanocoding.me&color=blue)](https://place-atlas.stefanocoding.me/)

# The 2022 Place Atlas

The /r/place Atlas is a project aiming to catalog all the artworks created during Reddit's 2022 /r/place event.
This project was created by Roland Rytz and is licensed under the GNU Affero General Public License v3.0.

---

*You can check out the website by clicking [here](https://place-atlas.stefanocoding.me/).*

If you don't know GitHub and wanted to submit new entries or request changes to existing ones, please visit [/r/placeAtlas2](https://www.reddit.com/r/placeAtlas2/).

## How To Contribute

### Map Contributions

**WE ONLY ACCEPT NEW CONTRIBUTIONS ON REDDIT!**

To contribute to the map, we require a certain format for artwork region and labels. This can be generated on the [contributing page](https://place-atlas.stefanocoding.me/index.html?mode=draw) on the website. 

#### Reddit Submission

1. Follow the instructions on the [contributing page](https://place-atlas.stefanocoding.me/index.html?mode=draw), then click "Post Direct to Reddit".
2. Flair your post with the "New Entry" tag.
3. A moderator will accept your contribution shortly.

<!--

#### GitHub Submission

1. Create a fork of our repo.
2. Enter your data into the `web/_js/atlas.js` file, with the correct format and ID number.
3. Create a Pull Request.

-->

### Map Edits

1. Create a fork of our repo.
2. Enter your data into the `web/atlas.json` file, with the correct format and ID number.
3. Create a Pull Request against the `cleanup` branch.

### Cleaning Contributions

If you spot a duplicate, please PR against the `cleanup` branch. To help find duplicates, append `?mode=overlap` to the url: [`https://place-atlas.stefanocoding.me?mode=overlap`](https://place-atlas.stefanocoding.me?mode=overlap).
