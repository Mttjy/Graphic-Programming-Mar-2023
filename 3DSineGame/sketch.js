let confettiArray = [];
let slider;
let stopCamera = false;
let freqSlider;
let colorPicker;
let button;
let material = "normal";


function setup() {
    createCanvas (1000, 700, WEBGL);
    camera(800, -400, 800, 0, 0, 0, 0, 1, 0);
    angleMode(DEGREES);

    //Slider for camera control
    slider = createSlider(300, 800, 400, 1);
    slider.position(120, 710);
    let sliderL = createP("Camera Control");
    sliderL.position(130, 715);
    
    //Button for Camera Stop
    let stopButton = createButton("Toggle Camera Spin");
    stopButton.size(100,40);
    stopButton.position(10, 710);
    stopButton.mousePressed(stopCameraFunction);
    
    //Slider for frequency control
    freqSlider = createSlider(0.5, 20, 1, 0.5);
    freqSlider.position(270, 710);
    let sliderL2 = createP("Frequency Control");
    sliderL2.position(275, 715);

    //Color Picker
    colorPicker = createColorPicker('#40ff99');
    colorPicker.size(40, 40);
    colorPicker.position(850, 710);

    //Button for Material Toggle
    button = createButton("Toggle Material");
    button.size(100,40);
    button.position(900, 710);
    button.mousePressed(toggleMaterial);
    
    let confettiCount = 200;
    for(let i = 0; i < confettiCount; i++){
        let a = random(-500, 500);
        let b = random(-500, 0);
        let c = random(-500, 500);
        let confetti = new Confetti(a, b, c);
        confettiArray.push(confetti);
    }
}

function toggleMaterial(){
    if(material == "normal"){
        material = "color";
    } else {
        material = "normal";
    }
}

function stopCameraFunction(){
    stopCamera = !stopCamera;
}

class Confetti {
    constructor(x, y, z) {
        this.location = createVector(x, y, z);
        this.rotation = random(0, 360);
        this.size = 15;
        this.speed = 1;
        this.rotationSpeed = 1;
    }

    update() {
        this.location.y += this.speed;
        this.rotation += this.rotationSpeed;

        if (this.location.y > 0) {
            this.reset();
        }
    }

    reset() {
        this.location.y = -800;
    }

    display() {
        push();
        translate(this.location.x, this.location.y, this.location.z);
        rotateX(this.rotation);
        plane(this.size, this.size);
        pop();
    }
}

function draw() {
    pointLight(255, 255, 255, 50, -400, 0);
    pointLight(100, 100, 100, 50, -400, 0);
    background (125);

    //Loop for camera spin toggle
    if (!stopCamera) {
        //Loop for camera control
        if (slider.value() === 400) {
            let xLoc = cos(frameCount) * height;
            let zLoc = sin(frameCount) * height;
            camera (xLoc, -1000, zLoc, 0, 0, 0, 0, 1, 0);
        } else {
            let xLoc = cos(frameCount + slider.value()) * height;
            let zLoc = sin(frameCount + slider.value()) * height;
            camera (xLoc, -1000, zLoc, 0, 0, 0, 0, 1, 0);
        }
    }else {
            let xLoc = cos(slider.value()) * height;
            let zLoc = sin(slider.value()) * height;
            camera (xLoc, -1000, zLoc, 0, 0, 0, 0, 1, 0);
    }

    if(material == "normal"){
        normalMaterial();
        colorPicker.hide(); //Hide ColorPicker
    }else{
        fill(colorPicker.color());
        colorPicker.show(); //Show ColorPicker
    }
    stroke(0);  

    //Create Object
    for(let x = -400; x <= 400; x += 50){
        for(let z = -400; z <= 400; z += 50){
            let freq = freqSlider.value();
            push();
            translate(x, 0, z);
            let distance = dist(0, 0, x, z)+(frameCount*freq);
            let length = map(sin(distance), -1, 1, 100, 300);
            box(50, length, 50);
            pop();
        }
    }

    normalMaterial();
    for(let confetti of confettiArray) {
        confetti.update();
        confetti.display();
    }
}