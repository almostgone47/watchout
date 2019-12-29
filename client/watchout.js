const height = 600;
const width = 1000;
let score;
// ENEMY DATA
const jsonCircles = [
  { "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
  { "x_axis": 70, "y_axis": 70, "radius": 20, "color" : "purple"},
  { "x_axis": 110, "y_axis": 100, "radius": 20, "color" : "red"}
];

// PLAYER'S DATA
const player = [
  { lives: 3 }
];

// CREATE CANVAS FOR GAME
const svgContainer = d3.select('.board')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background-color', 'black')

// CREATES ENEMY CIRCLES FROM DATA
const setEnemies = () => {
  const circles = svgContainer.selectAll('circle')
    .data(jsonCircles)
    .enter()
    .append('image')
    .attr('xlink:href', 'images/Nancy.png')
    .attr("class", "nancy")
    .attr('x', (d) => d.x_axis)
    .attr('y', (d) => d.y_axis)
    .attr('r', (d) => d.radius)
    // .attr('fill', (d) => d.color)
};

// CREATES PLAYER FROM PLAYER OBJ DATA
svgContainer.selectAll('rect')
  .data(player)
  .enter()
  .append('image')
  .attr("class", "trump")
  .attr('xlink:href', 'images/trump.png')
  .attr('width', 80)
  .attr('height', 120)
  .attr('fill', 'white')
  .attr('x', 450)
  .attr('y', 200)

// MOVE PLAYER
const dragHandler = d3.drag()
.on("drag", function () {
  d3.select(this)
    .attr("x", d3.event.x)
    .attr("y", d3.event.y);
});
dragHandler(svgContainer.selectAll("image"));

/// MOVE ENEMIES AROUND CANVAS
const moveEnemies = () => {
  const intervalId = setInterval(function() {
    d3.selectAll(".nancy")
      .transition()
      .duration(500) // SLOW DOWN THE ENEMIES TRAVELLING PACE!
      .attr("transform", "translate(0)")
      .attr('x', (d) => Math.floor(Math.random() * 900) + 1)
      .attr('y', (d) => Math.floor(Math.random() * 500) + 1)
      .attr("r", 25);
    if(collisionDetection()) {
      collisionHandler(intervalId);
    };
    if (player[0].lives > 0) {
      updateScore();
    }
  }, 500);
};
// DETECT COLLISIONS
var collisionDetection = function() {
  var radius = 80;
  var collision = false;

  var enemies = document.querySelectorAll('.nancy');
  var player1 = document.querySelector('image');

  enemies.forEach((enemy) => {
    var enemyX = parseInt(enemy.x.animVal.value) + radius;
    var enemyY = parseInt(enemy.y.animVal.value) + radius;
    var heroX = parseInt(player1.x.animVal.value) + radius;
    var heroY = parseInt(player1.y.animVal.value) + radius;
    var a = enemyX - heroX;
    var b = enemyY - heroY;
    var c = Math.sqrt(a * a + b * b);
    var distance = c;
    if (distance < radius * 2) {
      collision = true;
    }
  }); // end enemies.each
  return collision;
};

// HANDLE COLLISIONS
const collisionHandler = (intervalId) => {
  showLivesLeft();
  clearInterval(intervalId);
  if (player[0].lives > 0) {
    setInterval(moveEnemies, 1000);
  }
};

// PLAYER LIVES TRACKER
const showLivesLeft = () => {
  player[0].lives--;
  let lives = player[0].lives;

  document.getElementById('lives').innerHTML = lives;
  const board = document.querySelector('.board');
  const livesLeftH1 = document.createElement('h1');

  if (lives > 0) {
    livesLeftH1.innerHTML = `You have ${lives} chances left!`
    board.appendChild(livesLeftH1)
  } else {
    livesLeftH1.innerHTML = `YOU'RE IMPEACHED!!!`;
    setEnemies();
  }
  board.appendChild(livesLeftH1)
  setTimeout(function(){ board.removeChild(livesLeftH1); }, 1000);
};

/// START GAME
const startBtn = document.getElementById('start');
  startBtn.addEventListener('click', function() {
  score = 0;
  setEnemies();
  moveEnemies();
});

// UPDATE CURRENT SCORE
const updateScore = () => {
  score++;
  document.getElementById('currentScore').innerHTML = score * 10;
};

// RESET GAME
const resetGame = () => {
  score = 0;
  player[0].lives = 3;
  d3.selectAll('.nancy').remove();
};
document.getElementById('reset').addEventListener('click', () => resetGame());