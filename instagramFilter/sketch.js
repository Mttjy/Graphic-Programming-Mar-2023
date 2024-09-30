// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];

var sepiaFilterEnabled = true;
var borderFilterEnabled = true;
var darkCornersEnabled = true;
var radialBlurEnabled = true;
var invertedEnabled = false;
var pixelateEnabled = false;

var rectX = 0;
var rectY = 0;
var rectW = 0;
var rectH = 0;
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgIn.width * 2, imgIn.height);

    // Create the checkboxes
    createCheckbox("Sepia Filter").checked(sepiaFilterEnabled).changed(() => {
        sepiaFilterEnabled = !sepiaFilterEnabled;
        redraw();
    });
    createCheckbox("Border Filter").checked(borderFilterEnabled).changed(() => {
        borderFilterEnabled = !borderFilterEnabled;
        redraw();
    });
    createCheckbox("Dark corners Filter").checked(darkCornersEnabled).changed(() => {
        darkCornersEnabled = !darkCornersEnabled;
        redraw();
    }); 
    createCheckbox("Radial Blur Filter").checked(radialBlurEnabled).changed(() => {
        radialBlurEnabled = !radialBlurEnabled;
        redraw();
    });
    createCheckbox("Inverted Filter").checked(invertedEnabled).changed(() => {
        invertedEnabled = !invertedEnabled;
        redraw();
    });
    createCheckbox("Pixelate Filter").checked(pixelateEnabled).changed(() => {
        pixelateEnabled = !pixelateEnabled;
        redraw();
    });

    rectX = imgIn.width/2 - 100;
    rectY = imgIn.height/2 - 100;
    rectW = 200;
    rectH = 200;
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);

    // Create a new image and apply filters
    imgOut = createImage(imgIn.width, imgIn.height);
    imgOut.copy(imgIn, 0, 0, imgIn.width, imgIn.height, 0, 0, imgIn.width, imgIn.height);

    earlyBirdFilter(imgOut);

    // Draw filtered image on right side
    image(imgOut, imgIn.width, 0);

    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
    loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img) {
    var resultImg = createImage(img.width, img.height);
    resultImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    if (sepiaFilterEnabled) {
        resultImg = sepiaFilter(resultImg);
    }

    if (darkCornersEnabled) {
        resultImg = darkCorners(resultImg);
    }

    if (radialBlurEnabled) {
        resultImg = radialBlurFilter(resultImg);
    }

    if (invertedEnabled) {
        resultImg = invertColors(resultImg);
    }

    if (pixelateEnabled) {
        resultImg = pixelate(resultImg);
    }

    if (borderFilterEnabled) {
        resultImg = borderFilter(resultImg);
    }

    img.copy(resultImg, 0, 0, resultImg.width, resultImg.height, 0, 0, img.width, img.height);
}


function borderFilter(img){

    var tempImg = createGraphics(img.width, img.height);
    tempImg.image(img, 0, 0);

    tempImg.noFill();
    tempImg.stroke(255);
    tempImg.strokeWeight(20);
    tempImg.rect(0, 0, img.width, img.height, 50);

    tempImg.noFill();
    tempImg.strokeWeight(20);
    tempImg.stroke(255);
    tempImg.rect(0, 0, img.width, img.height);

    return tempImg;
}

function sepiaFilter(img){

    img.loadPixels();
    for(var x = 0; x < img.width; x++){
        for(var y = 0; y < img.height; y++){

            var pixelIndex = ((img.width * y) + x) * 4;
            var oldRed = img.pixels[pixelIndex + 0];
            var oldGreen = img.pixels[pixelIndex + 1];
            var oldBlue = img.pixels[pixelIndex + 2];

            var newRed = (oldRed * .393) + (oldGreen * .769) + (oldBlue * .189);
            var newGreen = (oldRed * .349) + (oldGreen * .686) + (oldBlue * .168);
            var newBlue = (oldRed * .272) + (oldGreen * .534) + (oldBlue * .131);

            newRed = constrain(newRed, 0, 255);
            newGreen = constrain(newGreen, 0, 255);
            newBlue = constrain(newBlue, 0, 255);

            img.pixels[pixelIndex + 0] = newRed;
            img.pixels[pixelIndex + 1] = newGreen;
            img.pixels[pixelIndex + 2] = newBlue;
            img.pixels[pixelIndex + 3] = 255;
        }
    }

    img.updatePixels();
    return img;
}

function darkCorners(img){

    img.loadPixels();
    var midX = img.width/2;
    var midY = img.height/2;

    var maxDist = abs(dist(midX, midY, 0, 0));
    var dynLum = 1;

    for(var x = 0; x < img.width; x++){
        for(var y = 0; y < img.height; y++){

            var d = abs(dist(midX, midY, x, y));

            if(d>300){
                var pixelIndex = ((img.width * y) + x) * 4;
                var oldRed = img.pixels[pixelIndex + 0];
                var oldGreen = img.pixels[pixelIndex + 1];
                var oldBlue = img.pixels[pixelIndex + 2];

                if(d<=450){
                    dynLum = map(d, 300, 450, 1, 0.4);
                }else{
                    dynLum = map(d, 450, maxDist, 0.4, 0);
                }

                dynLum = constrain(dynLum, 0, 1);

                img.pixels[pixelIndex + 0] = oldRed*dynLum;
                img.pixels[pixelIndex + 1] = oldGreen*dynLum;
                img.pixels[pixelIndex + 2] = oldBlue*dynLum;
            }
        }
    }

    img.updatePixels();
    return img;
}

function radialBlurFilter(img){
    img.loadPixels();

    for(var x = 0; x < img.width; x++){
        for(var y = 0; y < img.height; y++){

            var pixelIndex = ((img.width * y) + x) * 4;
            var oldRed = img.pixels[pixelIndex + 0];
            var oldGreen = img.pixels[pixelIndex + 1];
            var oldBlue = img.pixels[pixelIndex + 2];

            var c = convolution(x, y, matrix, matrix.length, img);
            var mouseDist = abs(dist(x, y, mouseX, mouseY));
            var dynBlur =  map(mouseDist, 100, 300, 0 ,1);
            dynBlur = constrain(dynBlur, 0, 1);

            var newRed = c[0]*dynBlur + oldRed*(1-dynBlur);
            var newGreen = c[1]*dynBlur + oldGreen*(1-dynBlur);
            var newBlue = c[2]*dynBlur + oldBlue*(1-dynBlur);

            img.pixels[pixelIndex + 0] = newRed;
            img.pixels[pixelIndex + 1] = newGreen;
            img.pixels[pixelIndex + 2] = newBlue;
        }
    }

    img.updatePixels();
    return img;
}

function convolution(x, y, matrix, matrixSize, img){
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;

    var offset = floor(matrixSize / 2);

    for(var i = 0; i < matrixSize; i++){
        for(var j = 0; j < matrixSize; j++){

            var xloc = x + j - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;

            index = constrain(index, 0, img.pixels.length - 1);

            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    return [totalRed, totalGreen, totalBlue];
}


function invertColors(img) {
    img.loadPixels();
    for (var i = 0; i < img.pixels.length; i += 4) {
        var r = img.pixels[i];
        var g = img.pixels[i+1];
        var b = img.pixels[i+2];
        img.pixels[i] = 255 - r; 
        img.pixels[i+1] = 255 - g; 
        img.pixels[i+2] = 255 - b; 
    }
    img.updatePixels();
    return img;
}

function pixelate(img) {
  var resultImg = createImage(img.width, img.height);
  resultImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

  var blockSize = 8;
  for (var y = 0; y < img.height; y += blockSize) {
    for (var x = 0; x < img.width; x += blockSize) {
      var blockSumR = 0;
      var blockSumG = 0;
      var blockSumB = 0;
      var pixelsInBlock = 0;

      // compute the sum of pixel values within the block
      for (var j = y; j < y + blockSize && j < img.height; j++) {
        for (var i = x; i < x + blockSize && i < img.width; i++) {
          var c = img.get(i, j);
          blockSumR += red(c);
          blockSumG += green(c);
          blockSumB += blue(c);
          pixelsInBlock++;
        }
      }

      // compute the average pixel color within the block
      var avgR = blockSumR / pixelsInBlock;
      var avgG = blockSumG / pixelsInBlock;
      var avgB = blockSumB / pixelsInBlock;

      // set all pixels within the block to the average color
      for (var j = y; j < y + blockSize && j < img.height; j++) {
        for (var i = x; i < x + blockSize && i < img.width; i++) {
          resultImg.set(i, j, color(avgR, avgG, avgB));
        }
      }
    }
  }

  resultImg.updatePixels();
  return resultImg;
}
