const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adX = 5;
let adY = 5;
ctx.lineWidth = 3;

// handle mouse
const mouse = {
    x: null, 
    y: null,
    radius: 150
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

ctx.fillStyle = 'white';
ctx.font = '25px Verdana';
ctx.fillText('Adam', 0, 25);
const textCoords = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 8) + 1;
        this.distance;
    }

    draw(){
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = 'rgba(34, 147, 214, 1)';
        ctx.beginPath();

        if (this.distance < mouse.radius - 5){
            this.size = 10;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
        else if (this.distance <= mouse.radius){
            this.size = 10;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();

        } else {
            this.size = 8;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }

        ctx.closePath();
        ctx.fill();
    }

    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        let fDX = dx / distance; // fDX = force distance x
        let fDY = dy / distance; // fDY = force distance y
        let maxDist = mouse.radius;
        let force = (maxDist - distance) / maxDist;
        let dirX = fDX * force * this.density;
        let dirY = fDY * force * this.density;

        if (distance < mouse.radius){
            this.x -= dirX;
            this.y -= dirY;
        }
        else {
            if (this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
        this.draw();
    }
}

function init(){
    particleArray = [];
    y2 = textCoords.height;
    x2 = textCoords.height;
    for (let y = 0; y < y2; y++){
        for (let x = 0; x < x2; x++){
            if(textCoords.data[(y * 4 * textCoords.width) + (x * 4) + 3] > 128){
                let posX = x + adX;
                let posY = y + adY;
                particleArray.push(new Particle(posX * 20, posY * 20));
            }
        }
    }
}


init();
console.log(particleArray);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    //connect();
    requestAnimationFrame(animate);
}

animate();

// dont need this function anymore for the bubbles effect.
function connect(){
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a; b < particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < 50){
                // 1 = full opacity
                opacityValue = 1 - (distance/50);
                ctx.strokeStyle = 'rgba(255, 255, 255' + opacityValue + ')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }

        }
    }
}





