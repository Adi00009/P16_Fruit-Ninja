/* Please also refer to my HTML and CSS files to view the respective structural and visual 
changes to the page */

// declare all variables

// create play and end states, and set current state to 1 or play
var PLAY = 1;
var END = 0;
var gameState = 1;

// declare all sprites and images
var knife, fruit, monster, fruitGroup, monsterGroup;
var knifeImg, fruit1, fruit2, fruit3, fruit4, monsterImg;

// declare a score variable
var score;

// declare game over and restart sprites to be displayed when game gets over
var gameOver, restart, restartDiv;

// declare game over and restart image to be displayed when game gets over
var gameOverImg, restartImg;

// declare variables to store sounds to be played when game gets over or the knife cuts a fruit
var gameOverSound, knifeSwoosh;

// initialise mode to manual
var auto = false;

function preload() {
  // load all images
  knifeImg  = loadImage("knife.png");
  fruit1 = loadImage("fruit1.png");
  fruit2 = loadImage("fruit2.png");
  fruit3 = loadImage("fruit3.png");
  fruit4 = loadImage("fruit4.png");
  monsterImg  = loadAnimation("alien1.png", "alien2.png");
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");

  // load all sounds
  gameOverSound = loadSound("gameover.mp3");
  knifeSwooshSound = loadSound("knifeSwoosh.mp3");
}

function setup() {
  // set background color of page to black using document.body's background color attribute of the style property
  document.body.style.backgroundColor = "black";

  // create a 600 * 600 pixel canvas
  createCanvas(600, 600);

  // create a knife, add image and shrink it
  knife = createSprite(40, 300, 20, 20);
  knife.x = 300;
  knife.addImage(knifeImg);
  knife.scale = 0.7;

  // set rectangular collider for knife
  knife.setCollider("rectangle", 0, 0, 40, 40);

  // create fruit and monster groups
  fruitGroup = createGroup();
  monsterGroup = createGroup();
  
  // initialise score
  score = 0;

  // save the restart "div" element as a variable
  restartDiv = document.getElementsByTagName("div")[0];

  // add a click event listener to check if restart div element is clicked
  restartDiv.addEventListener("click", function () {
    // reset score
    score = 0;

    // show knife by setting the boolean visible to true
    knife.visible = true;

    // hide game over sprite, restart sprite and restart div element by setting boolean visible to false
    gameOver.visible = false;
    restart.visible = false;
    restartDiv.style.display = "none";
    gameState = PLAY;
  }, false);
  // this boolean argument of the addEventListener property specifies whether to use the capture behaviour of the event listener
  // by setting to false, bubbling behaviour is followed, i.e., inner most element's event is handled first
}

function draw() {
  // set background color of canvas
  background("lightblue");

  // check if game state is play
  if (gameState === PLAY) {
    // call function to spawn fruits and monsters
    spawnFruits();
    spawnMonster();

    if (!auto) {
      // move knife horizontally and vertically with mouse pointer
      knife.y = World.mouseY;
      knife.x = World.mouseX;
    }

    // check if knife touching any fruit in the fruit group
    if (knife.isTouching(fruitGroup)) {
      // destroy all sprites of fruits group
      fruitGroup.destroyEach();

      // play swoosh sound
      knifeSwooshSound.play();

      // increment score by 2
      score += 5;
    } 
    
    // check if knife not touching fruit but touching any sprite in the monster group
    else if (knife.isTouching(monsterGroup)) {
      // change game state to end
      gameState = END;

      // play game over sound
      gameOverSound.play();

      // destroy knife
      knife.visible = false;

      // destroy all sprites of fruit and monster groups
      fruitGroup.destroyEach();
      monsterGroup.destroyEach();

      // create game over sprite, add image and enlarge it
      gameOver = createSprite(300, 300, 100, 50);
      gameOver.addImage(gameOverImg);
      gameOver.scale = 2;

      // create restart sprite, add image and enlarge it
      restart = createSprite(300, 300, 100, 50);
      restart.addImage(restartImg);
      restart.scale = 2;

      /* show the restart div element by setting restartDiv's display to the initial computed 
      value using the style property of the element */
      restartDiv.style.display = "initial";
    }
  }

  // draw sprites
  drawSprites();

  // display score on canvas in an enlarged font size
  textSize(25);
  text("Score : " + score, 250, 50);
}

// function to be called in draw function to spawn random fruits
function spawnFruits() {
  // spawn only once in 80 frame counts
  // check if remainder of frame count / 80 is 0 using the % (modulus) operator
  if (World.frameCount % 80 === 0) {
    // create a fruit at random vertical position
    fruit = createSprite(0, Math.round(random(50, 550)), 20, 20);

    // scroll horizontally rightwards by 7 pixels
    // increment velocity by 1 for every 4 score counts to make the game increasingly challenging
    fruit.velocityX = 7 + (score / 4);

    // shrink fruit
    fruit.scale = 0.2;
    
/*  // show collider of fruit by setting the boolean debug to true
    // fruit.debug = true; */

    // use the "switch" statement to pick a rounded random integer from 1 to 4
    switch (Math.round(random(1, 4))) {
      // on the basis of this random integer, add an image of a random fruit
      // the "case" keyword checks if the quantity matches a specified value
      // the "break" keyword breaks out of the "switch" structure, so no other values or code blocks are considered
      case 1: fruit.addImage(fruit1); break;
      case 2: fruit.addImage(fruit2); break;
      case 3: fruit.addImage(fruit3); break;
      case 4: fruit.addImage(fruit4); break;
    }
    
    // use the "lifetime" property to destroy fruit after 100 frame counts
    fruit.lifetime = 100;

    // add fruit to fruit group
    fruitGroup.add(fruit);

    // check if mode is "auto"
    if (auto) {
      // add Artificial Intelligence (AI) to knife
      // align it vertically with the spawned fruit so as to collect it
      knife.y = fruit.y;
    }
  }
}

// function to be called in draw function to spawn monster
function spawnMonster() {
  // spawn only once in 200 frame counts
  // check if remainder of frame count / 200 is 0 using the % (modulus) operator
  if (World.frameCount % 200 === 0) {
    // create a monster at random vertical position
    monster = createSprite(400, Math.round(random(100, 550)), 20, 20);

    // add a moving animation
    monster.addAnimation("moving", monsterImg);

    // scroll horizontally leftwards by 8 pixels
    // increment velocity by 1 for every 10 score counts to make the game increasingly challenging
    monster.velocityX = -(8 + (score / 10));

    // use the "lifetime" property to destroy fruit after 100 frame counts
    monster.lifetime = 50;

    // add monster to monster group
    monsterGroup.add(monster);

    // check if mode is "auto"
    if (auto) {
      // add Artificial Intelligence (AI) to knife so as to dodge the spawned obstacle
      // if knife is just slightly above monster, take it a bit higher
      if (monster.y - knife.y < 75) {
        knife.y = monster.y - 75;

        /* use the setTimeout global function to align knife vertically with fruit after 500ms 
        or 500s, i.e, once obstacle is out of the way */
        setTimeout(function() { knife.y = fruit.y; }, 500);
      }
      
      // else if knife is just slightly below monster, take it a bit lower
      else if (knife.y - monster.y < 75) {
        knife.y = monster.y + 75;
        /* use the setTimeout global function to align knife vertically with fruit after 500ms 
        or 500s, i.e, once obstacle is out of the way */
        setTimeout(function() { knife.y = fruit.y; }, 500);
      }
    }
  }
}

function toggleMode (element) {
  /* The ternary (?) logical operator takes three operands - (condition) ? (code if true) : 
  (code if false) */

  // if auto is true, set auto to false, else to true
  auto = auto ? false : true;

  // set the button element's text as per the current mode
  element.innerText = auto ? 'Switch to manual mode' : 'Switch to AI mode';
}

/* Please also refer to my HTML and CSS files to view the respective structural and visual 
changes to the page */
