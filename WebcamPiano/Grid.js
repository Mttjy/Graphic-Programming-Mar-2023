class Note {
    constructor(pos, size, state) {
        this.pos = pos;
        this.size = size;
        this.state = state;
    }
}

class Grid {
    constructor(_w, _h) {
        this.gridWidth = _w;
        this.gridHeight = _h;
        this.noteSize = 40;
        this.notes = [];
        this.lastPlayedNotes = [];

        // initalise grid structure and state
        for (let x = 0; x < _w; x += this.noteSize) {
            const noteColumn = [];
            for (let y = 0; y < _h; y += this.noteSize) {
                const pos = createVector(x + this.noteSize / 2, y + this.noteSize / 2);
                const size = this.noteSize;
                const state = 0;
                noteColumn.push(new Note(pos, size, state));
            }
            this.notes.push(noteColumn);
        }
        this.colorPairs = [
            [color(255, 0, 0), color(0, 255, 0)], // red-green
            [color(0, 255, 0), color(0, 0, 255)], // green-blue
            [color(0, 0, 255), color(255, 0, 255)], // blue-purple
            [color(255, 0, 255), color(255, 255, 0)] // purple-yellow
        ];
        this.currentColorPair = this.colorPairs[0];
    }   

    run(img) {
        img.loadPixels();
        this.findActiveNotes(img);
        this.drawActiveNotes(img);

        // display countdown timer
        fill(255);
        textSize(20);
        textAlign(RIGHT, TOP);
        var remainingTime = ceil((15000 - (millis() % 15000)) / 1000); // calculate remaining time
        text("Shape Change in: " + remainingTime + "s", width - 10, 10);

        for (let i = 0; i < this.cols; i++) {
            this.checkColumn(i);
        }
    }

    drawActiveNotes(img) {
        // draw active notes
        noStroke();
        for (let i = 0; i < this.notes.length; i++) {
            for (let j = 0; j < this.notes[i].length; j++) {
                const note = this.notes[i][j];
                const x = note.pos.x;
                const y = note.pos.y;
                if (note.state > 0) {
                    const alpha = note.state * 200;

                    const shapeIndex = floor((millis() / 15000) % 4); // choose shape based on elapsed time
                    if (this.currentShapeIndex !== shapeIndex) {
                        this.currentShapeIndex = shapeIndex;
                        this.currentColorPair = random(this.colorPairs);
                    }

                    const mix = lerpColor(this.currentColorPair[0], this.currentColorPair[1], map(i, 0, this.notes.length, 0, 1));
                    fill(mix);

                    const s = note.state;
                    switch (shapeIndex) {
                        case 0:
                            ellipse(x, y, note.size * s, note.size * s);
                            break;
                        case 1:
                            rect(x - note.size * s / 2, y - note.size * s / 2, note.size * s, note.size * s);
                            break;
                        case 2:
                            this.shape(x, y, note.size * s / 2, note.size * s / 3, 5); //Star
                            break;
                        case 3:
                            this.shape(x, y, note.size * s / 2, note.size * s / 2, 2); //Diamond
                            break;
                    }
                }
                note.state -= 0.05;
                note.state = constrain(note.state, 0, 1);
            }
        }
    }


    shape(x, y, radius1, radius2, npoints) {
        var angle = TWO_PI / npoints;
        var halfAngle = angle / 2.0;
        beginShape();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius2;
            var sy = y + sin(a) * radius2;
            vertex(sx, sy);
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    findActiveNotes(img) {
        for (let x = 0; x < img.width; x += 1) {
            for (let y = 0; y < img.height; y += 1) {
                const index = (x + y * img.width) * 4;
                const state = img.pixels[index];
                if (state == 0) {
                    const screenX = map(x, 0, img.width, 0, this.gridWidth);
                    const screenY = map(y, 0, img.height, 0, this.gridHeight);
                    const i = floor(screenX / this.noteSize);
                    const j = floor(screenY / this.noteSize);
                    if (i >= 0 && i < this.notes.length && j >= 0 && j < this.notes[i].length) {
                        const note = this.notes[i][j];
                        note.state += 0.5;
                        note.state = constrain(note.state, 0, 1);
                    }
                }
            }
        }
    }
}