
# P5_FSWD_Neighborhood_Map

Project 5 for the Full Stack Web Development Program.  The neighborhood map is a single page application (SPA), which features a map of a neighborhood I'd like to visit.  Some of the places I've already visited, but included them anyways, since I frequent those establishments multiple times.  You as a user can filter out uninterested locations, e.g. typing in an 'h' into the box filters out everything except for the Hard Rock Cafe, and Showbox at the Market.  Selecting one of the locations on the left drops a marker on the map location, with various information including the name, website (if it has one), the street address, and phone number (if it has one).

## Required Software

1.  Node.JS - the Javascript runtime, built on top of Google Chrome's V8 engine.  It uses an event driven, non-blocking I/O model, and has a package system, called npm (Node Package Manager), which is a huge software library repositry/registry.  Node (which includes npm) can be downloaded from [here](https://nodejs.org/en/).  Information on npm, as well as a searchable function is located [here](https://www.npmjs.com/).

## How to run build

1. Clone the Project Repository:<br /><br />```https://github.com/SoftwareDevPro/P5_FSWD_Neighborhood_Map```

2. Change to the project directory:<br /><br />```cd P5_FSWD_Neighborhood_Map```

3. Use node/npm to install dependencies:<br /><br />```npm install```

4. Execute the Gruntfile:<br /><br />```grunt```

## How to run

After running the build, navigate to the dist/index.html, and open it using your preferred browser.

# Frameworks / Libraries.

1.  Paper Dashboard Bootstrap Theme - Used to display the locations / map / filter box in a visualy nice fashion. It can be viewed, downloaded from [here](https://www.creative-tim.com/product/paper-dashboard).

2.  Bootstrap - (required by Paper Dashboard theme) it was incorporated into the application (rather then using a CDN). The website is located [here](https://getbootstrap.com/).

3. Chartist.JS - (required by Paper Dashboard theme).  Response Chart Library, it was incorporated into the application.  It can be viewed, downloaded from [here](https://gionkunz.github.io/chartist-js/).

4.  Jquery - (required by Paper Dashboard theme).  Javascript library for doing HTML traversal/manipulation, event handling, animation, Ajax.  It was incorporated into the application (rather then using a CDN). The website is located [here](https://jquery.com/).

5.  Knockout.JS - (used by the main application).  Javascript library which implements declarative bindings, automatic UI refresh, dependency tracking, templating.  It was incorporated into the application (rather then using a CDN).  The website is located [here](http://knockoutjs.com/).
