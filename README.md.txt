# Mouse Escape Game

A 2D survival game built using HTML5 Canvas and JavaScript.

## Description

Mouse Escape is a browser game I made where you play as a mouse trying to escape from an arena before time runs out. The main idea is simple: you spawn inside a room with 4 moving cats and 2 turrets on the walls that aim at you and shoot bullets. The exit door is locked at the start, so you have to run around, grab the golden key first to unlock the door, and then reach the exit before the timer hits zero.

## How to Play and Game Rules

- Starting the Round: When you press Start Game, you get 3 lives and a 20-second countdown timer.
- Unlocking the Door: You cannot win while the door is locked (red). Once you touch the golden key, the door unlocks (turns green) and you get +5 extra seconds added to your timer.
- Winning and Losing: Reaching the green exit door wins the round and saves your score if it is a new high score. If a cat touches you, a bullet hits you, or the 20-second timer reaches 0, you lose a life. Losing all 3 lives ends the game.
- Scoring and Timer System: The game counts down in seconds from 20. Your score is based on how fast you escape and your remaining time, and your best score is saved automatically in the browser using localStorage.

## Controls and Buttons

- Arrow Up: Move the mouse up
- Arrow Down: Move the mouse down
- Arrow Left: Move the mouse left
- Arrow Right: Move the mouse right
- P or Esc: Pause the game or open the pause menu
- Start Game Button: Starts a new round
- Options Button: Opens settings for difficulty, colors, theme, and sound
- High Scores Button: Shows your saved best score

## Difficulty Levels and Options

- Easy Mode: Cats move slower and turret bullets are easier to dodge.
- Medium Mode: Normal speed for both the 4 cats and the turret shots.
- Hard Mode: Fast cats and faster bullets for a harder challenge.
- Customization: Inside the Options menu, you can change the color of the mouse, switch the arena background between Light mode and Night mode, and turn sound effects on or off or change the volume.

## Languages and Tech Used

- HTML5 Canvas: Used to draw the game arena, the mouse, cats, turrets, key, and door.
- CSS3: Used for styling the main menu, options screen, and buttons.
- JavaScript: Used for player movement, collision detection, timer countdown, turret aiming math, and generating sound effects using Web Audio API.

## Screenshots

![Gameplay Screenshot](screenshot.png)

Play the game online here: https://mayr1425031-jpg.github.io/Mouse-Escape/

## Getting Started

### Dependencies

- Any modern web browser like Chrome, Edge, Firefox, or Safari.
- No extra libraries or programs needed.

### Installing

- Download the project files or clone the repository:
```bash
git clone (https://github.com/mayr1425031-jpg/Mouse-Escape.git)