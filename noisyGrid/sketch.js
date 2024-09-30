var stepSize = 20;

function setup() {
    createCanvas(500, 500);
}
///////////////////////////////////////////////////////////////////////
function draw() {
    background(125);

    colorGrid();
    compassGrid();
}
///////////////////////////////////////////////////////////////////////
function colorGrid(){
    // your code here
    for (var col=0 ;col<25 ;col++){
        for (var row=0; row<25 ; row++){
            
            var left = col * stepSize;
            var top = row * stepSize;
            var n = noise(left/1000, top/1000, frameCount/mouseX) ;
            var lerC = color("#70D6FF");
            var lerC2 = color("#F4D35E");
            var lerp = lerpColor (lerC, lerC2, n);

            fill(lerp); 
            noStroke() ;
            rect(left, top, stepSize, stepSize);
        }
    }
}
    ///////////////////////////////////////////////////////////////////////
    function compassGrid(){
        // your code here
        for (var x = 0; x < width; x += width/25) {
            for (var y = 0; y < height; y += height/25) {

                var speed = map(mouseX +10, 0, width, 0, 1);
                var fr = frameCount/(1000*speed);
                var compNoise = noise(x/1000, y/1000, fr);
                var angle = map(compNoise, 0, 1, 0, 720);
                var cols = lerpColor(color("#000103"), color("#DF2935"), compNoise);
                var l = map(compNoise, 0, 1, 0, 3);
                var noiseLength = noise(x/100, y/100, fr)*stepSize;

                push()
                translate(stepSize/2 + x,stepSize/2 + y);
                stroke(cols);
                strokeWeight(l);
                rotate(radians(angle));
                line(0, 0, 0, max(noiseLength, 20));
                pop()
            }
        }
    }
