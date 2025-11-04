# Snake Game 🐍

A classic Snake game built with HTML5 Canvas, CSS3, and vanilla JavaScript.

## Play Online

Once GitHub Pages is enabled, the game will be available at:
`https://filiptheking.github.io/Snake/`

## Features

- **Classic Gameplay**: Control the snake with arrow keys to eat food and grow
- **Score Tracking**: Current score and persistent high score (saved in browser)
- **Game Controls**: Start, Pause/Resume, and Reset buttons
- **Desktop Controls**:
  - Arrow Keys: Control snake direction
  - Space/P: Pause/Resume game
- **Mobile Controls** (iPhone/iPad optimized):
  - Swipe gestures for direction control
  - On-screen D-pad buttons
  - Touch-optimized interface
- **Collision Detection**: Wall and self-collision with game over
- **Modern UI**: Beautiful gradient design with smooth animations
- **Fully Responsive**: Optimized for both desktop and mobile devices

## How to Play

**Desktop:**
1. Click "Start Game" or press any arrow key to begin
2. Use arrow keys to control the snake's direction
3. Eat the red food to grow and increase your score
4. Avoid hitting walls or your own tail
5. Try to beat your high score!

**Mobile (iPhone/iPad):**
1. Tap "Start Game" or swipe on the canvas to begin
2. Use swipe gestures or on-screen D-pad buttons to control direction
3. Swipe up/down/left/right to change the snake's direction
4. Eat the red food to grow your snake
5. Avoid walls and your tail!

## Local Development

To run locally:
```bash
git clone https://github.com/filiptheking/Snake.git
cd Snake
# Open index.html in your browser
```

## Enabling GitHub Pages

To enable GitHub Pages for this repository:

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The game will be automatically deployed when you push changes

Your game will be live at: `https://filiptheking.github.io/Snake/`

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and animations
- `game.js` - Game logic and controls
- `.github/workflows/deploy.yml` - GitHub Pages deployment workflow

## Technologies Used

- HTML5 Canvas
- CSS3 (Gradients, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- LocalStorage API for high score persistence

Enjoy the game! 🎮
