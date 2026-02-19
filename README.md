###### Firefox Addon-Store link soon

💢 Only works on videos with ENG auto-captions! 💢

# SevenTitles
Uses the *YouTube timedtext API* and slight *DOM reading* to save `auto-generated` captions (en).  <br> Displays the toggled member(s) corresponding image and sound effect whenever/if the captions say their name.
##### ⓘ Uses Plasmo extension base
## ⚠️ Small Warning ⚠️
**You may see subtitles turn themselves on and flicker when you open a new video, this is expected behaviour as the extension has to make YouTube fetch the caption data to intercept it.**

# Installation
Grab the latest release from [here](https://github.com/BfoCrazy/SevenTitles/releases), download the attached ZIP file.

<img width="311" height="37" alt="zip" src="https://github.com/user-attachments/assets/df5c155e-1bfb-4336-9e62-c2b47d4f9ade" />
<br>Unzip the file to folder:
<br><img width="326" height="30" alt="unzip" src="https://github.com/user-attachments/assets/b80a57aa-b370-4a95-ba03-008d94a4caac" />
<br><br> Go to chrome://extensions/:
<br> <img width="272" height="42" alt="chrome" src="https://github.com/user-attachments/assets/239d8dce-3db4-4ea4-9d92-069c13e52261" />
<br> On the top right corner of the page, enable Developer Mode:
<br><img width="185" height="49" alt="dev" src="https://github.com/user-attachments/assets/5e25e80a-2611-42a7-aa73-d5f04a12dbc6" />
<br><br> Choose "Load Unpacked", and choose the folder you just extracted:
<br><img width="492" height="65" alt="pack" src="https://github.com/user-attachments/assets/883ca80d-216b-4e89-9893-8b3d930059d1" />

<br><img width="510" height="276" alt="done" src="https://github.com/user-attachments/assets/d38ff87b-e9d7-4b41-b73c-706bc57731a3" />

# Modification

<details>
<summary>Changing existing characters</summary>

 <br>Prepare your character image (.gif or .png), sound (mp3), and detection word.
<br>Place the sound file in assets/sfx, and the image in assets/image:
<br><img width="341" height="80" alt="image" src="https://github.com/user-attachments/assets/8fbe565b-d016-4a5d-8fad-fedd5732a10b" />
<br><br>Go to manifest.json, add the paths to your image and sound under "web_accesible_resources".
<br><img width="361" height="196" alt="image" src="https://github.com/user-attachments/assets/07431ab2-1c05-4201-b32b-1bbf1818eecd" />
<br>Make sure to have a (,) after each "path/to/asset" **until the last one**
<br><img width="361" height="196" alt="image" src="https://github.com/user-attachments/assets/645163fa-9aa7-4d98-97bb-9c7e81574ed9" />
<br><br>Navigate to fire(numbers).js, find this block of code:
<br><img width="1452" height="184" alt="image" src="https://github.com/user-attachments/assets/5a34fac9-d09d-4209-a9fb-43b0628b2082" />
<br>Replace any character of your choosing, for this example, let's change `"visitor"`.
<br>Change the `"visitor"` field (INSIDE the "" marks) to the word you want to be detected, and change the image and sound paths to those you made on the `manifest.json` file.
<br><img width="1532" height="72" alt="image" src="https://github.com/user-attachments/assets/1fbdd60e-f9cd-469d-9d48-433e1228d7bf" />

<br>Now, locate the popup(numbers).js file, and find this piece of code:
<br><img width="1005" height="58" alt="image" src="https://github.com/user-attachments/assets/55da03d9-a42a-408e-8c05-751e4c0799e7" />

<br>Replace `"visitor"` with the button/character name you want.
<br><img width="1129" height="87" alt="image" src="https://github.com/user-attachments/assets/af06e2c0-811e-4f30-8eaa-2ace0f31f591" />
<br> Now, reload the extension. And you're done!




</details>


<details>
<summary>Adding more than the default amount of characters</summary>
 
<br>Prepare your character image (.gif or .png), sound (mp3), and detection word.
<br>Place the sound file in assets/sfx, and the image in assets/image:
<br><img width="341" height="80" alt="image" src="https://github.com/user-attachments/assets/8fbe565b-d016-4a5d-8fad-fedd5732a10b" />
<br><br>Go to manifest.json, add the paths to your image and sound under "web_accesible_resources".
<br><img width="361" height="196" alt="image" src="https://github.com/user-attachments/assets/07431ab2-1c05-4201-b32b-1bbf1818eecd" />
<br>Make sure to have a (,) after each "path/to/asset" **until the last one**
<br><img width="361" height="196" alt="image" src="https://github.com/user-attachments/assets/645163fa-9aa7-4d98-97bb-9c7e81574ed9" />
<br><br>Navigate to fire(numbers).js, find this block of code:
<br><img width="1383" height="257" alt="image" src="https://github.com/user-attachments/assets/417a0d1a-2e75-4d6d-a50e-0c41ab93e483" />
<br>Paste the custom template below right on the highlighted area (between the `}` and `]`):
<br>`,{word:"customdetectableword",image:chrome.runtime.getURL("assets/img/image.png-or-gif"),sound:chrome.runtime.getURL("assets/sfx/sound.mp3"),enabled:!1}`
<br>Replace the `customdetectableword` with the word you want the extension to detect, and change the image and sound paths to those you made on the `manifest.json` file.

<br>Now, count the number of lines it takes to get to your word, and keep it in mind. (Count each `word` for convenience)
<br><img width="681" height="428" alt="image" src="https://github.com/user-attachments/assets/1e97b607-58ac-4201-b74a-d6d01bd18f40" />

<br>Locate the popup(numbers).js file, and find this piece of code:
<br><img width="1005" height="58" alt="image" src="https://github.com/user-attachments/assets/55da03d9-a42a-408e-8c05-751e4c0799e7" />
<br>Count them, and at the exact order where the previous count was, add a button title. This will create a button to toggle your character.
<br><img width="1236" height="87" alt="gfwgwgwg" src="https://github.com/user-attachments/assets/471ec1d9-f5c1-4f1e-aee9-4738f97cf296" />

<br> Now, reload the extension. And you're done, all you need to do to find the new button is to scroll down on the buttons menu in the extension popup.
<br> This is infintely expandable, if you want to add another character, repeat this method.




</details>







# There you are! Enjoy!
 Subtitle fetch code and other partial snippets were made with the help of my friend who didn't want to be credited, but here it is anyway :evil:
