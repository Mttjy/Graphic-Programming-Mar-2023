class Spaceship {

    constructor(){
        this.velocity = new createVector(0, 0);
        this.location = new createVector(width/2, height/2);
        this.acceleration = new createVector(0, 0);
        this.maxVelocity = 5;
        this.bulletSys = new BulletSystem();
        this.size = 50;
    }

    run(){
        this.bulletSys.run();
        this.draw();
        this.move();
        this.edges();
        this.interaction();
    }

    draw() {
        // save the current transformation matrix
        push();
        
        fill(color(110, 0, 0));
        triangle(this.location.x - this.size/2, this.location.y + this.size/2,
                 this.location.x + this.size/2, this.location.y + this.size/2,
                 this.location.x, this.location.y - this.size/2);

        stroke(1);
        strokeWeight(2);
        line(this.location.x, this.location.y+10 + this.size/2, this.location.x, this.location.y - this.size/2);
        line(this.location.x - this.size/3, this.location.y + this.size/4, this.location.x + this.size/3, this.location.y + this.size/4);

        // draw the smaller triangles
        fill(color(105, 0, 0));
        noStroke();
        triangle(this.location.x - this.size/4 - this.size/4, this.location.y + this.size/4,
                 this.location.x - this.size/4, this.location.y,
                 this.location.x - this.size/4 + this.size/4, this.location.y + this.size/4);
        triangle(this.location.x + this.size/4 - this.size/4, this.location.y + this.size/4,
                 this.location.x + this.size/4, this.location.y,
                 this.location.x + this.size/4 + this.size/4, this.location.y + this.size/4);

        // restore the previous transformation matrix
        pop();
    }

    move(){
        // YOUR CODE HERE (4 lines)
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxVelocity);
        this.location.add(this.velocity);
        this.acceleration.mult(0);

    }

    applyForce(f){
        this.acceleration.add(f);
    }

    interaction(){
        if (keyIsDown(LEFT_ARROW)){
            this.applyForce(createVector(-0.1, 0));
        }
        if (keyIsDown(RIGHT_ARROW)){
            // YOUR CODE HERE (1 line)
            this.applyForce(createVector(0.1, 0));
        }
        if (keyIsDown(UP_ARROW)){
            // YOUR CODE HERE (1 line)
            this.applyForce(createVector(0, -0.1));
        }
        if (keyIsDown(DOWN_ARROW)){
            // YOUR CODE HERE (1 line)
            this.applyForce(createVector(0, 0.1));
        }
    }

    fire(){
        this.bulletSys.fire(this.location.x, this.location.y);
    }

    edges(){
        if (this.location.x<0) this.location.x=width;
        else if (this.location.x>width) this.location.x = 0;
        else if (this.location.y<0) this.location.y = height;
        else if (this.location.y>height) this.location.y = 0;
    }

    setNearEarth(){
        //YOUR CODE HERE (6 lines approx)
        var gravity = createVector(0, 0.05);
        this.applyForce(gravity);

        var friction = this.velocity.copy();
        friction.mult(-1);
        friction.mult(1/30);
        this.applyForce(friction);
    }
}
