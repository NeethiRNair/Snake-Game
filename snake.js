const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");
var scale =20;
const rows = cvs.height/scale;
const columns = cvs.width/scale;

var dir, playerName, playerScore, newGame;

function resetfn(){
    localStorage.setItem("HighestScore",0);
    snake.highest = 0;
    document.getElementById("highestScore").innerText="Highest Score: " + localStorage.getItem("HighestScore");
}

//START GAME
function game(){ 
    setUp();
}
    function setUp(){
        snake = new Snake();
        food =new Food();
        food.location();
        newGame = setInterval(playGame,150);
    }
    
    function playGame(){
        
        document.getElementById("score").innerText="Score: " + snake.total;
        document.getElementById("highestScore").innerText="Highest Score: " + snake.highest;
        snake.clear();
        food.draw();
        
        snake.collisionCheck();
        snake.update();
        changeDirection();
        snake.draw();
    }
    
function gameOver(){
    clearInterval(newGame);
                
    if(snake.total >= snake.highest){

        snake.saveHighestScore();
    }
    let choice = prompt("Would you like to continue playing (y/n): ? ");
    if(!choice) choice = 'n';
    if(choice.toLocaleLowerCase() === 'y'){
        
        setUp();
    }
    else {
        snake.clear();
        ctx.font = "5em Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER !!!", cvs.width/2, cvs.height/2); 
        swal("Game Over !!!");
    }
}
 

//Set Player Name
function setPlayerName(){
    playerName = prompt("Enter the Player Name (If not entered will be set as 'Anonymous'): ");
    if(playerName != "" && playerName != null){
        document.querySelector("#playerName").textContent = "Player Name: " + playerName;
    }else{
        document.querySelector("#playerName").textContent  = "Player Name: Anonymous";
    }

}
//CHANGE THE DIRECTION OF THE SNAKE
function changeDirection(){
    if (dir == "LEFT") {snake.x -= scale }
    else if (dir == "RIGHT") {snake.x += scale }
    else if (dir == "UP") {snake.y -= scale }
    else if (dir == "DOWN") {snake.y += scale }
}

//FOOD
function Food () {
    this.x;
    this.y;

    //FOOD LOCATION
    this.location = function(){
        this.x = (Math.floor(Math.random()*columns - 1) + 1)*scale;
        this.y = (Math.floor(Math.random()*rows - 1) + 1)*scale;
        
        if(this.x === 0)
        {this.x += scale}
        else if(this.x === cvs.width-scale)
        {this.x -= scale}
        if(this.y === 0)
        {this.y += scale}
        else if(this.y === cvs.height-scale)
        {this.y -= scale}
        
    }
    //DRAW FOOD
    this.draw = function(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y,scale,scale);
    }
}

//SNAKE
function Snake(){
    this.x = 9*scale;
    this.y = 10*scale;
    this.total = 0;
    this.tail = [];
    this.highest = (localStorage.getItem("HighestScore")) ? localStorage.getItem("HighestScore") : 0; 
    
    //DRAW
    this.draw = function(){
        
        
        for(var i=0; i<this.tail.length; i++){
            ctx.fillStyle = "rgb(79, 216, 37)";
            ctx.fillRect(this.tail[i].x, this.tail[i].y,  scale, scale);
            ctx.strokeStyle = "white";
            ctx.strokeRect(this.tail[i].x, this.tail[i].y, scale, scale)
        }
            
        ctx.fillStyle = "white";
        ctx.fillRect(this.x,this.y,scale,scale);
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.x,this.y,scale,scale);
    }
    
    //UPDATE
    this.update = function(){
        
        //Wrapping of snake
     /*    
        if(this.x > cvs.width)
        {this.x = 0;}
        if(this.x < 0)
        {this.x = cvs.width;}
        if(this.y > cvs.height)
        {this.y= 0; }
        if(this.y < 0)
        {this.y = cvs.height;}
 */
        //If food eaten update the snake length
        for(var i=0; i<this.tail.length - 1; i++){
            this.tail[i] = this.tail[i+1];
        }
        this.tail[this.total - 1] ={x:this.x,y:this.y}
            
        if (food.x === this.x && food.y === this.y){
            ctx.clearRect(food.x, food.y, scale, scale);
            food.location();
            food.draw();
            this.total++;
            if(this.total > this.highest){

                this.highest = this.total;          
            }
        }
    }

    //KEYPRESSED
    window.addEventListener("keydown", function(e){
        if (e.keyCode == 37 && dir!="RIGHT"){
            dir = "LEFT"; 
        }
        if (e.keyCode == 38 && dir!="DOWN"){
            dir = "UP"; 
        }
        if (e.keyCode == 39 && dir!="LEFT"){
            dir = "RIGHT"; 
        }
        if (e.keyCode == 40 && dir!="UP"){
            dir = "DOWN"; 
        }
        
    });

    //GameOver
    this.collisionCheck = function(){
        if ((this.x < scale || this.x > cvs.width-(2*scale) || 
        this.y < scale || this.y > cvs.height-(2*scale)   )){
            gameOver();
            
        }
        else{
        for(let i=0; i<this.tail.length; i++){
            
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) 
            { 
               gameOver();
            }
        }
    }
    }

    //Saving Highest SCore
    this.saveHighestScore=function(){
        localStorage.setItem("HighestScore",this.highest);
    }


    //CLEAR SCREEN 
    this.clear = function (){
        ctx.clearRect(0,0,cvs.width,cvs.height);
    }
    
}
