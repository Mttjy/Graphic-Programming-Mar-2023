var imgs = [];
var avgImg;
var numOfImages = 30;
var numOfImagesToDisplay;
var loadCounter = 0;
var currentImageIndex = 0;
var currentAvgIndex = 0;

//////////////////////////////////////////////////////////
function preload() { // preload() runs once
    for(var i = 0; i < numOfImages; i++){
        var img = loadImage("assets/"+i+".jpg",imageloadSuccess);
        imgs.push(img);
    }
}

function imageloadSuccess() {
    loadCounter++;
}
//////////////////////////////////////////////////////////
function setup() {
    createCanvas(1024, 500);
    pixelDensity(1);
}
//////////////////////////////////////////////////////////
function draw() {
    background(255);

    if(loadCounter != numOfImages){
        return;
    }

    var numOfImagesToDisplay = Math.round(lerp(1, numOfImages, mouseX / width));
    var imagesToDisplay = [];
    for (var i = currentAvgIndex; i < currentAvgIndex + numOfImagesToDisplay; i++) {
        imagesToDisplay.push(imgs[i % numOfImages]);
    }
    var avgImg = averageFace(imagesToDisplay);
    image(imgs[currentImageIndex], 0, 0);
    image(avgImg, imgs[0].width, 0);

    let info1 = createP("Press the ' e ' key to cycle images.");
    info1.position(10, 510);
    
    let info2 = createP("Press the ' r ' key to select a random image.");
    info2.position(10, 530);
}

function keyPressed() {
    if (key == 'e') {
        currentImageIndex = (currentImageIndex + 1) % numOfImages;
        currentAvgIndex = currentImageIndex;
        avgImg = averageFace(imgs.slice(0, numOfImagesToDisplay));
    } else if (key == 'r') {
        currentImageIndex = Math.floor(Math.random() * numOfImages);
        currentAvgIndex = currentImageIndex;
        avgImg = averageFace(imgs.slice(0, numOfImagesToDisplay));
    }
}

function averageFace(images) {
    for(var i = 0; i < images.length; i++){
        images[i].loadPixels()
    }

    var imgOut = createImage(images[0].width, images[0].height);
    imgOut.loadPixels();

    for(var y = 0; y < imgOut.height; y++){
        for(var x = 0; x < imgOut.width; x++){
            var pixelIndex = ((imgOut.width*y)+x)*4;
            var sumR = 0;
            var sumG = 0;
            var sumB = 0;

            for(var i = 0; i < images.length; i++){
                var img = images[i];
                sumR += img.pixels[pixelIndex+0];
                sumG += img.pixels[pixelIndex+1];
                sumB += img.pixels[pixelIndex+2];
            }

            imgOut.pixels[pixelIndex+0] = sumR/images.length;
            imgOut.pixels[pixelIndex+1] = sumG/images.length;
            imgOut.pixels[pixelIndex+2] = sumB/images.length;
            imgOut.pixels[pixelIndex+3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
