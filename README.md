# Image Collector

![alt text](https://cdn.discordapp.com/attachments/454248926963564556/465474355690733568/PicturesCollector.jpg)
One page solution to creating, tracking, and accessing albums.
Built using Javascript/JQuery, HTML, CSS

# How it works
1. Drag and drop files into App
2. Give album and name and password 
3. Save album
4. Retrieve album using name and password

# What needs to be done
1. Implement drag and drop functionality
2. Set up server and implementation details

--------------------------------------------------------------------------------------------------------
# Current Version
Currently loads in a JSON file in the following format and displays to screen:
{
  "title1": "url2",
  "title2": "url2",
  .....
}
<br/>
All operations are handled client side
# Architecture
Consists of 3 components:<br/>
1. Display<br/>
2. Images<br/>
3. TopBar<br/>
<br/>
Display handles viewport and scrollbar functionality<br/>
Images handles loading images from URL and appending to scrollbar<br/>
TopBar aceepts a URL and calls Images.LoadImages()<br/>
<br/>
<br/>
In the final version, TopBar should facilitate album creation, deletion, access and clientside-server side communications
