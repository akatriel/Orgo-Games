var startX, startY, topNodes, botNodes, topSideChains, primaryNode, secondaryNode, primarySC, secondarySC, ran, success, num, si, score;
score = 0;
success = false;
var isDown = false;
var canvas = document.getElementById("canvas");
if(canvas.getContext){
	var context = canvas.getContext("2d");
	context.clearRect(0,0,canvas.width, canvas.height);
}

$('#unlimited').click(function(){
	$('#start, #unlimited, h2').hide();
	setNodes();
	drawSC();
});

$('#start').on('click', function(){
	$('#start, #unlimited, h2').hide();
	setTimer();
	//canvas setup
	setNodes();
	drawSC();
});
$('#canvas').on('mousedown', function(evt){
	success = false;
	evt.stopPropagation();
		evt.preventDefault();
	var downPositions = mousePosition(evt);
	startX = downPositions[0];
	startY = downPositions[1];
	if(intersects(startX, startY, primaryNode[0], primaryNode[1], 10)){
		isDown = true;
	}
});

$('#canvas').on('mousemove', function(evt) {
	if(!isDown){return;}
		var x = mousePosition(evt)[0];
		var y = mousePosition(evt)[1];

		if(isDown){
			context.clearRect(0,0,canvas.width, canvas.height);
			drawNodes();
			drawSC();
		var drawnAngle = getAngle(x,y);
		var psc;
		if(ran === 1){
			psc = primarySC[ran -1];
		}
		else{
			psc = primarySC[ran + 1];
		}
		if (Math.abs(drawnAngle - psc) < 10){
			success = true;
		}
		else{
			success = false;
		}
		drawLine(x,y);
	}
});

$('#canvas').on('mouseup', function(evt){
	evt.stopPropagation();
		evt.preventDefault();
	isDown = false;
	if(success){
		//redraw
		context.clearRect(0,0,canvas.width, canvas.height);
		setNodes();
		drawSC();
		score = score + (100 - num);

		if(num >= 10){
			num -= 10;
		}

		$('#score').show();

		if(isNaN(score)){
			$('#score').hide();
		}

		$('#score').text(score);
		
		console.log(score);
	}
	if(!success){
		num += 10;
	}


});

//just for logging
$('#canvas').on('click', function(evt){
		var positions = mousePosition(evt);
		var x = positions[0];
		var y = positions[1];
    console.log(x,y);

    if(intersects(x,y,116,108,10)){
    	console.log("intersects");
    }
});

function setTimer(){
	$('#progressbar, #innerBar').show();
	$('#innerBar').width('0%');
	num = 0;
	si = setInterval(function(){
		var wid = num + '%';
		num++;

		if(num > 100){
			clearInterval(si);
			$('h2').text('Game Over. Your score was: ' + score);
			$('h2').show();
			$('#playAgain').show();
		}
		$('#innerBar').width(wid);
	}, 500);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}


//set nodes. Counting starts at leftmost carbon and counts clockwise.
function setNodes(){
	console.log('setNodes');
	//coordinates of each node (x,y) from carbon-1 clockwise.
	topNodes = [[116,106], [266,141], [414,105], [492, 225], [345, 191], [195,227]];
	botNodes = [[109,494], [185,376], [336,414], [481,375], [405,495], [257,455]];
	//angles of rotation for axial and then equatorial. In degrees.
	topSideChains = [[90, 192], [270,120], [90,345], [270, 13], [90, 303], [270, 166]];
	botSideChains = [[270,166], [90, 192], [270, 57], [90, 345], [270, 15], [90, 235]];

	//choose a chair to draw on and a chair to be the template // 1 || 2
	var randy = getRandomInt(0,2);
	//setup primary and secondary nodes. They correspond to the appropriate carbons on the alternate conformation. Secondary Node is template, Primary Node is where the user draws from.  
	var rand = getRandomInt(0, topNodes.length);

	ran = getRandomInt(0,2); //To determine axial or equatorial

	if(randy === 1){//Top sidechains to be user drawn, bottom chair is template.
		primaryNode = topNodes[rand];
		secondaryNode = botNodes[rand];
		primarySC = topSideChains[rand];
		secondarySC = botSideChains[rand];
	}
	else{//Bot sidechains to be user drawn, top chair is template.
		primaryNode = botNodes[rand];
		secondaryNode = topNodes[rand];
		primarySC = botSideChains[rand];
		secondarySC = topSideChains[rand];
	}	
	drawNodes();
}

//draws all nodes and changes color of primary and secondary nodes. These are selected at random in setNodes()
function drawNodes(){
	//draw nodes top
	for(var i = 0; i < topNodes.length; i++){
		var x = topNodes[i][0];
		var y = topNodes[i][1];

		context.beginPath();
		if(x === primaryNode[0] && y === primaryNode[1]){
			context.strokeStyle = 'green';
		}
		else if(x === secondaryNode[0] && y === secondaryNode[1]){
			context.strokeStyle = 'red';
		}
		else{	
			context.strokeStyle = 'black';
		}
		context.lineWidth = 4;
		context.arc(x,y,10,0,2*Math.PI);
		context.closePath();
		context.stroke();
	}
	//draw bottom nodes
	for(var i = 0; i < botNodes.length; i++){
		var x = botNodes[i][0];
		var y = botNodes[i][1];

		context.beginPath();
		if(x === primaryNode[0] && y === primaryNode[1]){
			context.strokeStyle = 'green';
		}
		else if(x === secondaryNode[0] && y === secondaryNode[1]){
			context.strokeStyle = 'red'; 
		}
		else{
			context.strokeStyle = 'black';
		}
		context.arc(x,y,10,0,2*Math.PI);
		context.closePath();
		context.stroke();
	}
}

//draw side chain on a random chair at secondary node.
function drawSC(){
	var ox = secondaryNode[0];
	var oy = secondaryNode[1];
	var direction = secondarySC[ran];//in degrees
	console.log("sc direction: " + direction);

	direction = direction * (Math.PI / 180); //to set direction to radians
	var opp = Math.sin(direction) * 50;// hyp = 50
	var adj = Math.cos(direction) * 50;
	
	var x = ox + adj;
	var y = oy - opp;

	context.beginPath();
	context.moveTo(ox, oy);
	context.strokeStyle = 'black';
	context.lineTo(x,y);
	context.closePath();
	context.stroke();
	
}

//getBoundingClientRect returns the dimensions of the canvas element including offsets, such as a border. This is used to adjust the mouse coordinates returned so that they correspond to the canvas directly and consistently.
function mousePosition(evt){
	var rect = canvas.getBoundingClientRect();
	var x = Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
	var y = Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
	var array = [x, y];
	return array
}

//called on mouse move
function drawLine(x,y){
	context.beginPath();
	context.moveTo(primaryNode[0],primaryNode[1]);
	if(success){
		context.strokeStyle = 'green';
	}
	else{
		context.strokeStyle = 'black';	
	}
	context.lineTo(x, y);
	context.closePath();
	context.stroke();
}

//called on mouse move
//returns angle from node to mouse
function getAngle(x,y){
	var aX = x - primaryNode[0];
	var aY = y - primaryNode[1];
	//in Radians between [-PI <--> +PI]
	var theta = Math.atan2(-aY,aX);
	//for Non-negative values
	if(theta < 0){
		theta += 2 * Math.PI;
	}
	//to Degrees
	theta = theta * 180 / Math.PI;
	console.log(theta);
	return theta;
}

//http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
function intersects(x, y, cx, cy, r) {
	var dx = x - cx;
	var dy = y - cy;
	//Pythagorean Theorem
	return dx * dx + dy * dy <= r * r;
}

//TODO list:
// drag and drop line only from node. [x]
//calculate degrees rotated from origin (node) [x]
//randomize node appearance. [x]
//randomize drawing between different chairs [x]
//draw template and allow drawing only from corresponding node on opposite chair.[x]
//fix angle drawn [x]
//Fix line color [x]
//prevent template line to be cleared when drawing user line [x]
//compare drawn line to template line [x]
//timer[x]
//scoring [x]
