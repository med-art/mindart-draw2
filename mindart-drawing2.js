  var wideCount = 90;
  var unit;
  var count;
  var tri = [];
  var squ = [];
  var palWidth = 100;
  var palHighCount;
  var palWideCount = 2;
  var swatchCount = 24;
  var swatchUnit;

  var newColor;
  var newColorIndex;

  var triIndexArray = [];
  var colorIndexArray = [];
  var id;
  var isFullscreen = false;

  var top;

  var idText;
  var last;

  var popupText;
  var thankyou;
  var toRestart;

  var bHeight = 36;
  var bWidth = palWidth;

  var LOCKED = false;

  //buttons
  var toQuestions;

  var paletteVersion;

  var changePalette;



  function setup() {

    createCanvas(windowWidth - 30, windowHeight - 30);

    top = createGraphics(400, 400);

    paletteVersion = 1;
    paletteVersionTitle = "Urban";


    background(255);
    noStroke();
    newColor = Color(0);
    newColorIndex = 1;


    setupCanvas();
    setupPalette();
    setupDOM();

    //FIREBASE

    //ID
    id = "YET TO SUBMIT"
    last = "Previously submitted ID:<br>";
    //html paragraph containing ID
    // idText = createP(last + id);
    // idText.position( 0 ,palHighCount*swatchUnit + palWidth + 128);
    // idText.style("padding","5pt");

  }


  function setupCanvas() { //TRIANGLES

    palWidth = (((height/3)*2/(swatchCount/palWideCount))*palWideCount)+5;

    var canvasWidth = width - palWidth;
    var unit = canvasWidth / (wideCount + 1) * 2;
    var pitch = (tan(PI / 3)) * (unit / 2);
    var highCount = Math.floor(height / pitch);
    count = wideCount * highCount;
    var index = 0;
    for (var y = 0; y < highCount; y++) {
      for (var x = 0; x < wideCount; x++) {

        var p1x = x * unit / 2;
        var p1y = y * pitch;
        var p2x = (p1x + unit);
        var p2y = p1y;
        var p3x = (p1x + (unit / 2));
        var p3y = (p1y + pitch);

        if ((x + 1 * y) % 2 == 0) {
          p1y = p1y + pitch;
          p2y = p2y + pitch;
          p3y = p3y - pitch;
        }
        tri[index++] = new Triangle(p1x + palWidth, p1y,
          p2x + palWidth, p2y,
          p3x + palWidth, p3y, index);
      }
    }
    for (var i = 0; i < count; i++) {
      tri[i].draw();
    }
  }

  function setupPalette() { //PALETTE

    //SQUARES PALETTE
    var indexSq = 0;
    palHighCount = Math.ceil(swatchCount / palWideCount);
    swatchUnit = (height / palHighCount)/3*2;

    for (var u = 0; u < palHighCount; u++) {
      for (var v = 0; v < palWideCount; v++) {
        squ[indexSq++] = new Square(v * swatchUnit, u * swatchUnit, swatchUnit, swatchUnit, indexSq);
      }
    }
    for (var j = 0; j < swatchCount; j++) {
      squ[j].fillColor = Color(j);
      squ[j].draw();
    }
  }

  function setupDOM() {

    var buttonChangePalette = createButton(paletteVersionTitle + " Palette");
    buttonChangePalette.style("background-color", color(200));
    buttonChangePalette.style("border", "1px solid white");
    buttonChangePalette.size(palWidth, bHeight);
    buttonChangePalette.position(0, palHighCount * swatchUnit + palWidth);
    //  buttonChangePalette.touchStarted(changePalette);
    buttonChangePalette.mousePressed(changePalette);

    var buttonRestart = createButton('Restart');
    buttonRestart.style("background-color", color(200));
    buttonRestart.style("border", "1px solid white");
    buttonRestart.size(palWidth, bHeight);
    buttonRestart.position(0, palHighCount * swatchUnit + palWidth + bHeight);
    //  buttonRestart.touchStarted(restart);
    buttonRestart.mousePressed(restart);

    //SUBMIT POP-UP
    thankyou = "THANK YOU ! <br> Your drawing ID is:<br><br><b>";
    toRestart = "</b><br><br>To create another drawing press RESTART on the left. <br><br> If you have been provided a physical questionnaire please complete that.<br>Otherwise, continue to the online questionnaire."
    popup = createP(thankyou + " " + toRestart);
    popup.style("background-color", color(200, 240));
    popup.position(windowWidth / 2, windowHeight / 6);
    popup.style("transform", "translate(-50%)");
    popup.hide();

    toQuestions = createButton('Continue to online Questionnaire ' + '\u25b6');
    toQuestions.style("background-color", color(150));
    toQuestions.style("border", "1px solid white");
    toQuestions.size(palWidth, bHeight * 2);
    toQuestions.position(windowWidth / 2, windowHeight / 2);
    toQuestions.style("transform", "translate(-50%)");
    toQuestions.mousePressed(questionsLink);
    toQuestions.hide();

  }

  function changePalette() {

    if (paletteVersion == 1) {
      paletteVersion = 2;
      paletteVersionTitle = "Organic";


    } else {
      paletteVersion = 1;
      paletteVersionTitle = "Urban"
    }

    setupDOM();
    setupPalette();

  }

  function windowResized() {
    resizeCanvas(windowWidth - 30, windowHeight - 30);
    setupCanvas();
    setupPalette();
    drawStorage();

    toQuestions.position(windowWidth / 2, windowHeight / 2);
    popup.position(windowWidth / 2, windowHeight / 6);

  }



  function questionsLink() {

    window.open("http://emmafebvre-richards.squarespace.com/bv-questions/?SQF_PAL=" + paletteVersion + "&SQF_ID=" + id, "_self")

  }


  function restart() {

    popup.hide();
    toQuestions.hide();



    //reset canvas
    background(255);
    for (var i = 0; i < count; i++) {
      tri[i].fillColor = color(255);
      tri[i].draw();
    }
    //reset array values
    triIndexArray = [];
    colorIndexArray = [];

    LOCKED = false;

  //  setupPalette();

  }



  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4();
  }


  function touchMoved(){
    if (LOCKED == false) {
      for (var i = 0; i < count; i++) {
        tri[i].update();
        tri[i].draw();
      }
    }
  }

  function mousePressed() {
    if (LOCKED == false) {
      for (var i = 0; i < count; i++) {
        tri[i].update();
        tri[i].draw();
      }
      for (var j = 0; j < swatchCount; j++) {
        squ[j].update();
        squ[j].draw();
      }
    }
  }

  Triangle.prototype.update = function() {

    var a = createVector(this.p1x, this.p1y);
    var b = createVector(this.p2x, this.p2y);
    var c = createVector(this.p3x, this.p3y);
    var p = createVector(mouseX, mouseY);
    var v0 = c.sub(a);
    var v1 = b.sub(a);
    var v2 = p.sub(a);
    var dot00 = v0.dot(v0);
    var dot01 = v0.dot(v1);
    var dot02 = v0.dot(v2);
    var dot11 = v1.dot(v1);
    var dot12 = v1.dot(v2);
    var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    if ((u >= 0) && (v >= 0) && (u + v < 1)) {

      this.fillColor = newColor;

      //add to array if different from last
      if (triIndexArray[triIndexArray.length - 1] != this.index ||
        colorIndexArray[colorIndexArray.length - 1] != newColorIndex) {

        triIndexArray.push(this.index);
        colorIndexArray.push(newColorIndex);
      }
    }
  }

  Square.prototype.update = function() {
    if (mouseX >= this.xOff && mouseX <= this.xOff + this.x &&
      mouseY >= this.yOff && mouseY <= this.yOff + this.y) {
      newColor = this.fillColor;
      newColorIndex = this.index;
    }
  }

  Triangle.prototype.draw = function() {
    fill(this.fillColor);
    triangle(this.p1x, this.p1y, this.p2x, this.p2y, this.p3x, this.p3y);
  }

  Square.prototype.draw = function() {
    fill(this.fillColor);
    rect(this.xOff, this.yOff, swatchUnit, swatchUnit);
    //show current color
    stroke(200);
    fill(newColor);
    rectMode(RADIUS);

// below is the chosent swatch colour that needs to be amended to take up less real estate

    rect((palWidth / 2), palHighCount * (palWidth/palWideCount), (palWidth / 2)-5, (palWidth / 4));
    rectMode(CORNER);
    noStroke();


  }

  function drawStorage() {
    for (var i = 0; i < triIndexArray.length; i++) {

      var triSelect = triIndexArray[i] - 1;
      tri[triSelect].fillColor = Color(colorIndexArray[i] - 1);
      tri[triSelect].update();
      tri[triSelect].draw();
    }
  }


  function Triangle(_p1x, _p1y, _p2x, _p2y, _p3x, _p3y, _index) {
    this.p1x = _p1x;
    this.p1y = _p1y;
    this.p2x = _p2x;
    this.p2y = _p2y;
    this.p3x = _p3x;
    this.p3y = _p3y;
    this.fillColor = color(255);
    this.index = _index;
  }

  function Square(_xOff, _yOff, _x, _y, _index) {
    this.xOff = _xOff;
    this.yOff = _yOff;
    this.x = _x;
    this.y = _y;
    this.fillColor = color(255);
    this.index = _index;

  }


  function Color(_i) {

    if (paletteVersion == 1) {

      var colorIndex = [color(255),
        color(212, 195, 0),
        color(196, 195, 78),
        color(157, 151, 0),
        color(175, 165, 89),
        color(105, 108, 0),
        color(38, 64, 20),
        color(85, 114, 48),
        color(195, 164, 0),
        color(130, 160, 76),
        color(126, 102, 30),
        color(190, 116, 0),
        color(141, 83, 0),
        color(56, 37, 4),
        color(147, 139, 103),
        color(122, 136, 117),
        color(176, 191, 184),
        color(137, 153, 119),
        color(250, 233, 216),
        color(188, 166, 124),
        color(162, 187, 228),
        color(160, 175, 198),
        color(116, 153, 206),
        color(50, 93, 149)
      ];
    } else if (paletteVersion == 2) {

      var colorIndex = [color(255), //white
        color(255, 80, 22), // orange
        color(225, 114, 93), //orange
        color(255, 203, 71), //yellow
        color(255, 76, 85), //red
        color(177, 41, 25), //red
        color(189, 207, 204), //blue
        color(45, 58, 96), //blue
        color(2, 127, 255), //blue
        color(112, 133, 162), //blue
        color(181, 162, 139), //brown
        color(107, 92, 78), //brown
        color(159, 146, 139), // brown
        color(184, 173, 168), //brown
        color(32, 172, 117), // green
        color(160, 160, 150), //green
        color(88, 138, 57), //green
        color(197, 185, 183), //brown
        color(126, 115, 110), //brown
        color(57, 48, 52), //purp
        color(82, 72, 78), //purp
        color(34, 38, 59), //purp
        color(118, 113, 123), //purp
        color(169, 168, 174)
      ]; //purp
    }

    return colorIndex[_i];
  }
