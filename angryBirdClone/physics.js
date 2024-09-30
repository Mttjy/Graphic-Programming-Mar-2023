var pY = 0;
var pSpeed = 2;

////////////////////////////////////////////////////////////////
function setupGround(){
    ground = Bodies.rectangle(500, 600, 1000, 40, {isStatic: true, angle: 0});
    World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround(){
    push();
    fill(128);
    drawVertices(ground.vertices);
    pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller(){
    // your code here
    propeller = Bodies.rectangle(150, 480, 200, 15, {isStatic: true, angle: angle});
    World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller(){
    push();
    // your code here
    fill(255);
    drawVertices(propeller.vertices);
    Body.setAngle(propeller, angle);
    Body.setAngularVelocity(propeller, angleSpeed);
    angle += angleSpeed;
    pop();
}
////////////////////////////////////////////////////////////////
function setupBird(){
    var bird = Bodies.circle(mouseX, mouseY, 20, {friction: 0, restitution: 0.95, collisionFilter: {category: 0x0003, mask: 0xffff}});
    Body.setMass(bird, bird.mass*10);
    birds.push(bird);
    World.add(engine.world, [bird]);
}
////////////////////////////////////////////////////////////////
function drawBirds(){
    push();
    //your code here
    fill(255);
    for (var i = birds.length-1; i >= 0; i--){
        fill(255, 0, 0);
        drawVertices(birds[i].vertices);

        if(isOffScreen(birds[i])){
            World.remove(engine.world, birds[i]);
            removeFromWorld(birds[i]);
            birds.splice(i,1);
            i--;
        }
    }
    pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower(){
    //your code here
    var boxRows = 5;
    var boxCols = 3;
    var size = 80;
    var startX = width-size;
    var startY = height-size;

    for(var row = 0; row < boxRows; row++){
        for(var col = 0; col < boxCols; col++){
            var x = startX - (col*size);
            var y = startY - (row*size);
            var box = Bodies.rectangle(x, y, size, size, { 
                collisionFilter: {
                    category: 0x0001,
                    mask: 0x0001
                }
            });

            World.add(engine.world, [box]);
            boxes.push(box);
            var c = color(random(150, 255), random(50, 150), random(20, 255));
            colors.push(c);
        }
    }
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){
    push();
    //your code here
    for (var i = boxes.length-1; i >= 0; i--){
        fill(colors[i]);
        drawVertices(boxes[i].vertices); //pass info to "drawVertices"

        if(isOffScreen(boxes[i])){
            World.remove(engine.world, boxes[i]);
            removeFromWorld(boxes[i]);
            boxes.splice(i,1);
            colors.splice(i,1);
            i--;
        }
    }
    pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot(){
    //your code here
    slingshotBird = Bodies.circle(200, 250, 20, {friction: 0, restitution: 0.95, collisionFilter: {category: 0x0003, mask: 0xffff}});
    Body.setMass(slingshotBird, slingshotBird.mass*10);
    slingshotConstraint = Constraint.create({
        pointA: { x: 200, y:200 },
        bodyB: slingshotBird,
        stiffness: 0.01,
        damping: 0.0001
    });
    World.add(engine.world, [slingshotBird, slingshotConstraint])
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot(){
    // your code here
    push();
    fill(250, 250, 15);
    drawVertices(slingshotBird.vertices);
    stroke(255);
    fill(255);
    drawConstraint(slingshotConstraint);
    pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction(){
    var mouse = Mouse.create(canvas.elt);
    var mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05 },
        collisionFilter: {
            category: 0x0002,
            mask: 0x0002
        }
    }
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);
}

function gameState(){
    push();
    fill(255);
    if (frameCount % 60 == 0 && time > 0) time--;
    textSize(50);
    text('Time: '+ time + 's', 10, 50);
    pop();

    if (boxes.length == 0){
        fill(255);
        textSize(50);
        text('Congratulations!', 325, 300);
        rButton();
        noLoop();
    }else if (time == 0){
        fill(255);
        textSize(50);
        text('GAME OVER!', 325, 300);
        rButton();
        noLoop();
    }

    function rButton() {
        button = createButton("Restart");
        button.size(100,50);
        button.style("font-size", "24px");
        button.position(width/2-50, height/2+60);
        button.mousePressed(restart);
    }

    function restart(){
        window.location.reload();
        removeFromWorld(slingshotBird);
        removeFromWorld(slingshotConstraint);
        setupSlingshot();
    }

}

function drawPillar() {
  // update the y coordinate
  pY += pSpeed;
  if (pY < 0 || pY > height - 300) {
    pSpeed = -pSpeed;
  }

  // update the y coordinate of the vertices
  pillar.vertices[0].y += pSpeed;
  pillar.vertices[1].y += pSpeed;
  pillar.vertices[2].y += pSpeed;
  pillar.vertices[3].y += pSpeed;

  drawVertices(pillar.vertices);
}

function setupPillar(){
    // update the y coordinate
    pY += pSpeed;
    // if the rectangle reaches the top or bottom of the screen, reverse the direction of movement
    if (pY < 0 || pY > height - 300) {
        pSpeed = -pSpeed;
    }
    pillar = Bodies.rectangle(600, pY, 16, 250, {isStatic: true, angle: 0});
    World.add(engine.world, [pillar]);
}
