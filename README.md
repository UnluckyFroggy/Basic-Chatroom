# 🐸 Froggy Chatroom 💬
###### Markdown (WIP) By: YeetsaJr
### Here is the original version of the [<a href="Froggy Chatroom</a>](https://froggy-chatroom.unluckyfroggy.repl.co")
***
## How to Personalize

### Name and Titles
To change the name/title of the chatroom first go to **index.html** and at line 19 change *Froggy Chatroom* to whatever you want the name to be.
```html
<title>Froggy Chatroom</title>
```
Next, go to line 54 in **index.html** and again change *Froggy Chatroom* to whatever you would like.
```
Froggy Chatroom
```
### Roles and Permissions
To change the roles and permissions find lines 19-27 of **index.js** and change these to whatever you would like.
For example, to change the tag that the code associates with the owner tag change `TAG_OWNER` to your specified role. (Don't forget to change every instance of the old tag in the code to your new one) Next change `red` to your desired color you want the prefix to show up as. (Refer to lines 93-123 in style.css for available colors) Finally, change `[OWNER]` to your desired prefix that you will see in the chat for that role.
```js
const TAG_OWNER = '<span class="red">[OWNER] </span>';
```
An example of the changed version:
```js
const Squad_Member = '<span class="blue">{Squad Member} </span>';
```

### Colors
Alright, you've got everything set up except colors of things, just a little warning, this might take a little while. To change the colors of the chatroom (Backgrounds, text colors, button colors, etc.) you will need to go into **style.css**.
#### Role Colors
Role colors are on lines 93-123 and to change them you will need to change the color name or you can it to RGB, HEX, HSL, or built in CSS colors. Here is an example:
```css
// All of these are the same color just different formats.
.blue1 {
  color:blue; //Built in CSS
}
.blue2 {
  color:#0000ff;//HEX color code
}
.blue3 {
  color:rgb(0, 0, 255); //RGB color code
}
.blue4 {
  color:hsl(240, 100%, 50%); //HSL color code
}
```
#### Other Colors
To change miscilaeous colors go to lines 14-36 and they are pretty self explanitory.
```css
//The "--" in front of each one indicates that it's a variable
:root {
	--u: calc(0.5vh + 0.5vw);
	--du: calc(var(--u) * 2);
	--bg: #222;
	--bd: #000;
  --time: #90a4ae; //Color of the text for how long ago the message was sent
  --border: 5px black; //Borders for different elements
  --sidebar: #111; //Sidebar background color
  --checkbox: #eee; //Background color for checkbox
  --checkbox-hover: #ccc; //Background color for checkboxes when the cursor is hovering over it
  --name: #00bcd4;
  --red: red; //I mean, it's just the color red. (but you can change it)
  --openbtn: #111;
  --openbtn-content: white;
  --openbtn-hover: #444;
  --message-hover: black;
  --green: #00eb27; //Again, just the color green, but you can change it
  --orange: orange; //Again, just the color orange, but you can change it
  --sidebar-close-hover: #f1f1f1; //Close button on the sidebar when hovered over with a cursor.
  --message: #ffffff; //The background color of when you hover over a message or a users name
  --input-bottom: #ffffff80;//The bottom color of an input
  --room-text: black;//Color of the text on the button for creating/joining rooms
  --room-btn: white; //Color of the button for creating/joining rooms
}
```
