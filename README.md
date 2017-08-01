![photo #1](https://github.com/alyshae/griddog/blob/master/public/images/grid-dog-full-dog.png)

# GridDog

GridDog is a simple game inspired by simple curiosity. I wanted to experience working with a technology which allows users to interact with the web in an unconventional way (not through a mouse, keyboard or touch-screen). The goal is to guide Elmer, the GridDog, through the grid to his ball using spoken commands before the time runs out. The Web Speech API converts the users speech into text and I have used JavaScript and jQuery to connect specific text to control Elmer's moves. Currently, the game is designed for use on a desktop or laptop browser (compatible browsers listed below).

Heroku Link: https://griddog.herokuapp.com/

![photo #2](https://github.com/alyshae/griddog/blob/TUE1-finishingTchs/public/images/screenshot4.png)

## Technologies Used
- JavaScript
- jQuery
- ajax
- Node
- Express
- MongoDB/mongoose
- Web Speech API
- Materialize.CSS
- Animate.CSS

## Installation Steps

The Web Speech API is a privileged API which requires the following permissions to be set in your manifest.webapp file:

```
"permissions": {
  "audio-capture" : {
    "description" : "Audio capture"
  },
  "speech-recognition" : {
    "description" : "Speech recognition"
  }
}

"type": "privileged"
```

## Compatible Browsers
- Chrome
- Edge
- Firefox

## Wire Frames/Planning
![photo #3](https://github.com/alyshae/griddog/blob/master/public/images/wireframe.jpg)

## Existing Issues
- Modals can be triggered if user clicks faster than certain timer-related actions/animations
- A bunch more I can't think of at the moment because I am trying to fix some of them before I have to present this project
- Fences are persistent

## Future Features
- increased accuracy for recognizing the 4 directional commands
- voice commands to control other functionality (starting the game, choosing YES or NO on a modal, etc.)
- mobile use

## Shout-Outs
- Graphics designed by Jeff Faes Design
- Emotional support provided by Jeff Faes
- Thank you to Michelle, Nathan, Bill, Cindy, Younji, Kabita, Ibrahim, Justin, Nuranne, Matt, Kat
