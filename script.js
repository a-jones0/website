/*
    1. Create two canvas objects within the webpages left and right sidebars.
    2. Draw particle effects within the canvas objects.
        - Particles will not bounce, instead will "portal" to the other side upon collision with a wall
*/


/* 
    INITIALIZE CANVAS ELEMENTS
*/
const canvas_left = document.getElementById("canvas_left");
const canvas_right = document.getElementById("canvas_right");
const ctx_left = canvas_left.getContext('2d');
const ctx_right = canvas_right.getContext('2d');
const left_sidebar_rect = canvas_left.getBoundingClientRect();
const right_sidebar_rect = canvas_right.getBoundingClientRect();


/* 
    PARTICLE OBJECT CONSTRUCTOR AND FUNCTIONS
*/

// create Particle constructor function
function Particle(canvas, x, y, directionX, directionY, radius, color){
    this.canvas = canvas;   // a string, "left" or "right", indicating which sidebar the particle is in
    this.x=x;
    this.y=y;
    this.directionX=directionX;
    this.directionY=directionY;
    this.radius=radius;
    this.color=color;
}

// add draw function to Particle prototype
Particle.prototype.draw = function(){
    if(this.canvas == "left"){
        ctx_left.beginPath();
        ctx_left.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx_left.fillStyle = this.color;
        ctx_left.fill();
    }
    else if(this.canvas == "right"){
        ctx_right.beginPath();
        ctx_right.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx_right.fillStyle = this.color;
        ctx_right.fill();
    }
    
}

// add update function to Particle prototype
Particle.prototype.update = function(){
    let dist = 0;
    // if particle is in the left sidebar...
    if(this.canvas == "left"){
        // collision detection - particle hits right side of left sidebar
        if(this.x + this.radius > left_sidebar_rect.right + this.radius + dist){
            this.x = 0;
        }
        // collision detection - particle hits left side of left sidebar
        else if(this.x - this.radius < -this.radius - dist){
            this.x = left_sidebar_rect.right + this.radius;
        }
        else{
            this.x += this.directionX;
        }

        // collision detection - particle hits bottom of left sidebar
        if(this.y + this.radius > document.body.scrollHeight + this.radius + dist){
            this.y = 0;
        }
        // collision detection - particle hits top of left sidebar
        else if(this.y - this.radius < -this.radius - dist){
            this.y = document.body.scrollHeight + this.radius;
        }
        else {
            this.y += this.directionY;
        }
    }
    // if particle is in the right sidebar...
    else if(this.canvas == "right"){
        // collision detection - particle hits right side of right sidebar
        if(this.x + this.radius > right_sidebar_rect.width + this.radius + dist){
            this.x = 0;
        }
        // collision detection - particle hits left side of right sidebar
        else if(this.x - this.radius < - this.radius - dist){
            this.x = right_sidebar_rect.right + this.radius;
        }
        else {
            this.x += this.directionX;
        }

        // collision detection - particle hits bottom of right sidebar
        if(this.y + this.radius > document.body.scrollHeight + this.radius){
            this.y = 0;
        }
        // collision detection - particle hits top of right sidebar
        else if(this.y - this.radius < -this.radius){
            this.y = document.body.scrollHeight + this.radius;
        }
        else {
            this.y += this.directionY;
        }
    }
    this.draw();
}

/* 
    CREATE PARTICLE ARRAYS
*/

let particleArrayLeft;
let particleArrayRight;
let num_particles = 20;
let particle_color = "white";
let radius_const = 5;
let directionX_const = 0.5;
let directionY_const = 0.5;


// create initializtion function for left and right sidebar particle arrays
function init() {
    particleArrayLeft = [];
    particleArrayRight = [];

    // set initial width, height for both canvas objects
    canvas_left.width = left_sidebar_rect.width;
    canvas_left.height = document.body.scrollHeight;
    canvas_right.width = right_sidebar_rect.width;
    canvas_right.height = document.body.scrollHeight;

    for(let i=0; i<num_particles; i++){
        // initialize particles in left sidebar
        let radius_left = Math.random() * radius_const;
        let x_left = Math.random() * (left_sidebar_rect.right - radius_left*2);
        let y_left = Math.random() * (document.body.scrollHeight - radius_left*2);
        let directionX_left = Math.random() * directionX_const;
        let directionY_left = Math.random() * directionY_const; 

        // initialize particles in right sidebar
        let radius_right = Math.random() * radius_const;
        let x_right = Math.random() * (right_sidebar_rect.width - radius_right*2);
        let y_right = Math.random() * (document.body.scrollHeight - radius_right*2);
        let directionX_right = Math.random() * directionX_const;
        let directionY_right = Math.random() * directionY_const; 

        // add the two Particle objects to their respective arrays
        particleArrayLeft.push(new Particle("left", x_left, y_left, directionX_left, directionY_left, radius_left, particle_color));
        particleArrayRight.push(new Particle("right", x_right, y_right, directionX_right, directionY_right, radius_right, particle_color));
    }
}

// create animate function to animate onscreen particles
function animate(){
    requestAnimationFrame(animate);
    // clear both canvas objects before redrawing
    ctx_left.clearRect(0,0, left_sidebar_rect.width, document.body.scrollHeight);
    ctx_right.clearRect(0,0, right_sidebar_rect.width, document.body.scrollHeight);

    for(let i=0; i<particleArrayLeft.length;i++){
        particleArrayLeft[i].update();
    }

    for(let i=0; i<particleArrayRight.length;i++){
        particleArrayRight[i].update();
    }
}

init();
animate();

// resize canvas every time the browser window is resized
window.addEventListener('resize', 
    function(){
        canvas_left.width = left_sidebar_rect.width;
        canvas_left.height = document.body.scrollHeight;
        canvas_right.width = right_sidebar_rect.width;
        canvas_right.height = document.body.scrollHeight;
    }
)
