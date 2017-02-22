$(document).ready(function(){
	var cvs = $(canvas).get(0);
	var ctx = cvs.getContext("2d");
	var w = cvs.width;
	var h = cvs.height;
	var r = 20;
	var player;
	var balls = [];
	var mouseX;
	var mouseY; 
	var dx;
	var dy;
	var friction = 0.7;
	var drag = 0.05;
	var over;
	var worldW = 5000;
	var worldH = 5000;
	var gridSpacing = 100;

	function init(){
		player = new ball(worldW/2, worldH/2, 20, 0, 0);
		player.mass = player.r/2;

		cvs.width = $(window).width();
	    cvs.height = $(window).height();

	    w = cvs.width;
	    h = cvs.height;

		for (var i = 0; i < 1000; i++) {
			spawnBall();
		}

		draw();
	}

	function spawnBall() {
		var colliding = true;
		var failedAttempts = 0;

		while (colliding) {
			colliding = false;

			randomX = Math.round(Math.random()*worldW);
			randomY = Math.round(Math.random()*worldH);
			randomR = Math.round(Math.random()*(r - 5)) + 5;
		
			var currentBall = new ball(randomX, randomY, randomR, 0, 0, randomR/2);				

			for (var j = 0; j < balls.length; j++) {
				if (currentBall.intersects(balls[j])) {

					colliding = true;
					break;
				}
			}

			if (currentBall.intersects(player)) {
				colliding = true;
			}

			if (!colliding) {
				balls.push(currentBall);
			}

			if (failedAttempts++ > 10) {
				break;
			}
		}
	}

	function drawGrid() {
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';

		for (var x = -worldW; x < worldW * 2; x += gridSpacing) {
			ctx.beginPath();
			ctx.moveTo(x, -worldH);
			ctx.lineTo(x, worldH * 2);
			ctx.stroke();
		}

		for (var y = -worldH; y < worldH * 2; y += gridSpacing) {
			ctx.beginPath();
			ctx.moveTo(-worldW, y);
			ctx.lineTo(worldW * 2, y);
			ctx.stroke();
		}
	}

	function draw(){
		ctx.save();
		ctx.clearRect(0, 0, w, h);
		
		updatePlayer();
		updateBalls();

		ctx.translate((w/2- player.x), (h / 2) - player.y);

		drawPlayer();
		drawBalls();
		drawGrid();

		ctx.restore();
		requestAnimationFrame(draw);
	}

	function drawPlayer(){	
		ctx.beginPath();
		ctx.fillStyle ="grey";
		ctx.arc(player.x, player.y, player.r, 0, 2*Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle ="black";
		ctx.font="bold "+ player.r/2 +"px serif";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillText(player.r,player.x, player.y);
		ctx.fill();
		
	}

	function updatePlayer(){
		
		if(player.x >= worldW){
			player.x = worldW;
		}
		if(player.x <= -0){
			player.x = -0;
		}
		if(player.y >= worldH){
			player.y = worldH;
		}
		if(player.y <= 0){
			player.y = 0;
		}

		if(over){
			player.vx = mouseX * drag;
			player.vy = mouseY * drag;
		}

		player.x += player.vx;
		player.y += player.vy;
		
	}

	var ball = function(x, y, r, vx, vy, mass){
		this.x=x;
		this.y=y;
		this.r=r;
		this.vx=vx;
		this.vy=vy;
		this.mass=mass;
	}

	ball.prototype.intersects = function(ball) {
		var distance = Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2));

		return distance < (this.r + ball.r);
	}

	function drawBalls(){
		for(var i = 0; i < balls.length; i++){
			ctx.beginPath();
			ctx.fillStyle ="black";
			ctx.arc(balls[i].x , balls[i].y, balls[i].r, 0, 2*Math.PI);
			ctx.fill();
		}
	}

	function updateBalls(){
		for (var j = balls.length - 1; j >= 0; j--) {
			balls[j].x += balls[j].vx;
			balls[j].y += balls[j].vy;

			if (player.intersects(balls[j])) {

				player.r += balls[j].mass/4;

				balls.splice(j, 1);

				spawnBall();
			}
		}
	}

	$("canvas").mousemove(function(e){
		over = true;
		mouseX = e.offsetX;
		mouseY = e.offsetY;	
		mouseX -= w / 2;
		mouseY -= h / 2;	

	});

	$(window).bind("resize", function() {

		cvs.width = $(window).width();
	    cvs.height = $(window).height();

	    w = cvs.width;
	    h = cvs.height;
	});

	init();

});