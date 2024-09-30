var speed;

function setup() {
    createCanvas(900, 700);
}

function celestialObj(c, size){
    strokeWeight(5);
    fill(c);
    stroke(0);
    ellipse(0, 0, size, size);
    line(0, 0, size/2, 0);
}

function draw() {
    background(0);
    speed = frameCount;

    push();
    translate(width/2, height/2);
    var SunSpin = map(speed/3, 0, 360, 0, 360);
    rotate(radians(SunSpin));
    celestialObj(color(255,150,0), 200); // SUN
    pop();
    
        push();
        translate(width/2, height/2);
        var EarthOrbit = map(speed, 0, 360, 0, 360);
        rotate(radians(EarthOrbit));
        translate(300, 0);
        var EarthSpin = map(speed, 0, 360, 0, 360);
        rotate(radians(EarthSpin));
        celestialObj(color(0, 0, 255), 80); // EARTH
    
            push();
            var MoonOrbit = map(-speed*3, 0, 360, 0, 360);
            rotate(radians(MoonOrbit));
            translate(100, 0);
            celestialObj(color(255, 255, 255), 30); // MOON
            pop();

                var Moon2 = map(-speed*5, 0, 360, 0, 360);
                rotate(radians(Moon2));
                translate(70, 0);
                celestialObj(color(255, 25, 55), 20); // MOON2
                pop();
}