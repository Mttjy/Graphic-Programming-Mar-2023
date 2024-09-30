var spaceship;
var asteroids;
//let asteroidimg;
var atmosphereLoc;
var atmosphereSize;
var earthLoc;
var earthSize;
var starLocs = [];
var score;
var scoreTxt;
var timer = 0;
var timerTxt;
var levelTxt;
var fade = 255;
var stage = 1;
var c1, c2;

//////////////////////////////////////////////////
function setup() {
    score = 0;
    createCanvas(1200,800);
    spaceship = new Spaceship();
    asteroids = new AsteroidSystem();

    //location and size of earth and its atmosphere
    atmosphereLoc = new createVector(width/2, height*2.9);
    atmosphereSize = new createVector(width*3, width*3);
    earthLoc = new createVector(width/2, height*3.1);
    earthSize = new createVector(width*3, width*3);

    //asteroidimg = loadImage('asteroid.jpg');
}

//////////////////////////////////////////////////
function draw() {
    push();
    background(0);
    sky();
    pop();

    spaceship.run();
    asteroids.run();

    drawEarth();

    checkCollisions(spaceship, asteroids); // function that checks collision between various elements

    fill(255);
    textSize(30);
    scoreTxt = text("Score: " + score, 1100, 30);
    

    if (frameCount % 60 == 0) { // frameCount is divisible by 60 (one minute)
        timer ++;
    }

    fill(255);
    textSize(25);
    timerTxt = text("Timer: " + timer, 1100, 60);

    //30 seconds level increment 
    if (frameCount % 1800 == 0 && asteroids.levelUp < 1) {
        asteroids.levelUp += 0.01;
        stage += 1;
        fade = 255;
    }
    fade --; //makes level indication disappear

    fill(255, 0, 0, fade);
    textSize(80);
    textAlign(CENTER);
    levelTxt = text("LEVEL " + stage, width/2, height/2);

    if (asteroids.levelUp > 0.01) {
        textSize(35);
        text("More Astroids Incoming!", width/2, 450);
    }
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth(){
    noStroke();
    //draw atmosphere
    fill(0,0,255, 50);
    ellipse(atmosphereLoc.x, atmosphereLoc.y, atmosphereSize.x,  atmosphereSize.y);
    //draw earth
    fill(100,255);
    ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids){

    //spaceship-2-asteroid collisions
    //YOUR CODE HERE (2-3 lines approx)
    for(var i=0;i<asteroids.locations.length;i++){
        var asteroidLoc = asteroids.locations[i];
        var asteroidDiam = asteroids.diams[i];
        var collision = isInside(asteroidLoc, asteroidDiam, spaceship.location, spaceship.size);
        if(collision){
            gameOver();
        }
    }

    //asteroid-2-earth collisions
    //YOUR CODE HERE (2-3 lines approx)
    for(var i=0;i<asteroids.locations.length;i++){
        var asteroidLoc = asteroids.locations[i];
        var asteroidDiam = asteroids.diams[i];
        var collision = isInside(asteroidLoc, asteroidDiam, earthLoc, earthSize.y);
        if(collision){
            gameOver();
        }
    }
    //spaceship-2-earth
    //YOUR CODE HERE (1-2 lines approx)
    var collision = isInside(spaceship.location, spaceship.size, earthLoc, earthSize.y);
    if(collision){
        gameOver();
    }
    //spaceship-2-atmosphere
    //YOUR CODE HERE (1-2 lines approx)
    var collision = isInside(spaceship.location, spaceship.size, atmosphereLoc, atmosphereSize.y);
    if(collision){
        spaceship.setNearEarth();
    }

    //bullet collisions
    //YOUR CODE HERE (3-4 lines approx)
    var bulletSys = spaceship.bulletSys;
    var bullets = bulletSys.bullets;
    for(var i=0;i<bullets.length;i++){
        for(var j=0;j<asteroids.locations.length;j++){
            var asteroidLoc = asteroids.locations[j];
            var asteroidDiam = asteroids.diams[j];
            var collision = isInside(asteroidLoc, asteroidDiam, bullets[i], bulletSys.diam);

            if (collision){
                asteroids.destroy(j);
                spaceship.bulletSys.bullets.splice(i,1)
                score += 1;
                break;
            }
        }
    }
}

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB){
    // YOUR CODE HERE (3-5 lines approx)

    var d = dist(locA.x, locA.y, locB.x, locB.y);
    var maxDist = sizeA/2 +sizeB/2;
    if (maxDist < d) {
        return false;
    }
    else {
        return true;
    }
}

//////////////////////////////////////////////////
function keyPressed(){
    if (keyIsPressed && keyCode === 32){ // if spacebar is pressed, fire!
        spaceship.fire();
    }
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over"
function gameOver(){
    fill(255);
    textSize(80);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2)
    textSize(40);
    text("Your Score: " + score, width/2, 450);
    button = createButton("Restart");
    button.size(100,50);
    button.style("font-size", "24px");
    button.position(width/2-50, height/2+60);
    button.mousePressed(restart);
    noLoop();
    scoreTxt.hide();
}

function restart(){
    window.location.reload();
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky(){
    push();
    while (starLocs.length<300){
        starLocs.push(new createVector(random(width), random(height)));
    }
    fill(255);
    for (var i=0; i<starLocs.length; i++){
        rect(starLocs[i].x, starLocs[i].y,2,2);
    }

    if (random(1)<0.3) starLocs.splice(int(random(starLocs.length)),1);
    pop();
}
