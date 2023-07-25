/**
 * 字母圆球
 */
class Ball {
    constructor(canvas, freeq, option = {}) {
        this.canvas = canvas;
        this.freeq = freeq;
        this.radius = option.radius;
        this.text = option.text;
        this.arcColor = option.arcColor;
        this.fontColor = option.fontColor;
        this.ctx = canvas.getContext('2d');
        this.y = this.getRandomIntInclusive(0, this.canvas.height);
        this.x = this.canvas.width;
        this.vy = -((this.y - this.canvas.height / 2) / freeq);
        this.vx = -(this.canvas.width / this.freeq);

        this.beenShot = false;
        this.missed = false;
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }

    /**
     * 字母球运动 递增 x 和 y 的坐标
     */
    updatePosition() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x <= 50) {
            this.x = this.canvas.width;
            this.y = this.getRandomIntInclusive(0, this.canvas.height);
            this.hitTarget = true;
        }
    }

    draw() {
        this.updatePosition();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.arcColor;
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = this.fontColor;
        this.ctx.textAlign = 'center';
        this.ctx.font = Math.floor(this.radius * 1.5) + 'px sans-serif';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.text, this.x, this.y);
    }

}


/**
 * 子弹
 */
class Bullet {
    constructor(cv, initPos, ball) {
        this.canvas = cv;
        this.x = initPos.x;
        this.y = initPos.y;
        this.target = ball;
        this.vx = 40;
        this.vy = (ball.y - this.y) * (this.vx / (ball.x - this.x));
        this.ctx = this.canvas.getContext('2d');
        this.bingo = false;
    }

    updatePosition() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x >= this.target.x) {
            this.bingo = true;
            if (this.target instanceof Ball) {
                this.target.beenShot = true;
            }
        }
    }

    shoot() {
        this.updatePosition();
        this.ctx.beginPath();
        this.ctx.fillStyle = '#FFF';
        this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }
}



/**
 * 字母球被击中的散花
 */
class Dot {
    constructor(ctx, option) {
        this.ctx = ctx;
        this.x = option.x;
        this.y = option.y;
        this.r = option.r;
        this.color = option.color;
        this.dx = Math.random() * 15 - 7;
        this.dy = Math.random() * 15 - 7;
        this.destroy = false;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.updatePosition();
    }

    updatePosition() {
        this.x += this.dx;
        this.y += this.dy;
        this.r--;
        this.destroy = this.r < 0;
    }
}


/**
 * 在最大和最小值之间随机取值
 * @param {*} min 
 * @param {*} max 
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


function getRandomArrayElements(arr, count) {
    let shuffled = arr.slice(0),
        i = arr.length,
        min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

document.addEventListener('DOMContentLoaded', function (e) {
    let canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        start = document.getElementById('start'),
        shootSounds = Array.from(document.getElementsByName('shootSound')),
        //chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ';', '\'', ',', '.', '/', '[', ']'],
        chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        colors = [
            'rgba(255, 0, 0, 1)',
            'rgba(255, 165, 0,1)',
            'rgba(255, 255, 0, 1)',
            'rgba(0, 255, 0, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(139, 0, 255, 1)'
        ],
        letters = [],
        bullets = [],
        dots = [],
        level = {
            value: 3,
            rate: 1
        },
        raf = null,
        unit = 40;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let life, score,
        ballSpeed = {
            min: 800,
            max: 1000,
            rate: 20
        };

    document.addEventListener('keypress', function (e) {
        let x = shootSounds.find(e => e.paused);
        if (x) {
            x.play();
        }
        let _ball = letters.find(x => x.text == e.key.toUpperCase());
        if (_ball) {
            bullets.push(new Bullet(canvas, {
                x: 20,
                y: canvas.height / 2,
            }, _ball));
        } else {
            bullets.push(new Bullet(canvas, {
                x: 20,
                y: canvas.height / 2
            }, {
                x: canvas.width,
                y: canvas.height / 2
            }));
        }
    });

    function startGame() {
        //如果生命值小于0或得分超过canvas宽度 游戏暂停
        if (life.value <= 0 || score.value >= canvas.width) {
            letters = [];
            bullets = [];
            dots = [];
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.font = '50px sans-serif';
            ctx.textBaseline = 'middle';

            //如果没有了生命值==>game over
            if (life.value <= 0) {
                ctx.fillText('GAME OVER', (canvas.width - 50) / 2, (canvas.height - 50) / 2);
                life.value = 0;
                start.innerHTML = 'Start';
            }

            //如果满分 则进入下一关
            if (score.value >= canvas.width) {
                ctx.fillText('Great job!', (canvas.width - 50) / 2, (canvas.height - 50) / 2);
                start.innerHTML = 'Next Level';
                //增加难度
                //字母球的并发数量递增
                level.value += level.rate;

                //字母球的运动速度递增
                ballSpeed.min -= ballSpeed.rate;
                ballSpeed.max -= ballSpeed.rate;
            }
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground();
            window.cancelAnimationFrame(raf);
            showMenu();
            raf = null;
            return;
        }

        //保持字母球的数量不少于当前关卡设置的数量
        if (letters.length < level.value) {
            letters = letters.concat(
                getRandomArrayElements(chars, level.value).map((e) => {
                    return new Ball(canvas, getRandomIntInclusive(ballSpeed.min, ballSpeed.max), {
                        radius: 30,
                        text: e,
                        arcColor: colors[getRandomIntInclusive(0, 6)],
                        fontColor: '#000'
                    });
                })
            );
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let len = letters.length - 1;
        while (len >= 0) {
            //如果字母球被击中 删除它
            if (letters[len].beenShot) {

                //随机产生爆炸散花
                let num = getRandomIntInclusive(7, 14);
                for (let i = 0; i < num; i++) {
                    dots.push(new Dot(ctx, {
                        x: letters[len].x,
                        y: letters[len].y,
                        r: letters[len].radius,
                        color: letters[len].arcColor
                    }));
                }
                score.value += score.sRate;
                letters.splice(len, 1);
            } else if (letters[len].hitTarget) { //如果字母球击中目标
                //生命值减少
                life.value -= life.lostRate;
                life.posy += life.posy;
                //删除字母球
                letters.splice(len, 1);
            } else {
                letters[len].draw();
            }
            len -= 1;
        }


        //检测散花并删除
        len = dots.length - 1;
        while (len >= 0) {
            if (dots[len].destroy) {
                dots.splice(len, 1);
            } else {
                dots[len].draw();
            }
            len -= 1;
        }

        //检测子弹

        len = bullets.length - 1;
        while (len >= 0) {

            if (bullets[len].bingo) { //击中目标
                bullets.splice(len, 1);
            } else {

                bullets[len].shoot();
            }
            len -= 1;
        }
        drawBackground();
        raf = window.requestAnimationFrame(startGame);
    }

    function drawBackground() {
        ctx.drawImage(img, 10, canvas.height / 2 - 25, 50, 50);
        ctx.fillStyle = life.color;
        ctx.fillRect(0, (canvas.height - life.value) / 2, 10, life.value);

        ctx.fillStyle = score.color;
        ctx.fillRect(0, canvas.height - 10, score.value, 10);

        ctx.strokeStyle = "#04ff00";
        ctx.lineWidth = 0.2;
        let lines = Math.round(canvas.height / unit);
        ctx.beginPath();
        for (let i = 0; i < lines; i++) {
            ctx.moveTo(0, i * unit);
            ctx.lineTo(canvas.width, i * unit);
        }

        let cols = Math.round(canvas.width / unit);
        for (let i = 0; i < cols; i++) {
            ctx.moveTo(i * unit, 0);
            ctx.lineTo(i * unit, canvas.height);
        }
        ctx.stroke();
    }

    var img = new Image();
    img.onload = function () {
        init();
        drawBackground();
    };
    img.src = './dapao.png';

    function init() {
        life = {
            color: 'red',
            lostRate: canvas.height / 30,
            value: canvas.height
        };
        score = {
            color: 'green',
            sRate: canvas.width / 50,
            value: 0
        };
    }
    start.addEventListener('click', (e) => {
        if (!life || !score) {
            init();
        } else {
            life.value = canvas.height;
            score.value = 0;
        }
        raf = window.requestAnimationFrame(startGame);
        hideMenu();
        let music = document.getElementById('bMuisc');
        music.play();
        //testDraw();
    });

    function hideMenu() {
        let menu = document.getElementById('menu');
        menu.style.display = 'none';
    }

    function showMenu() {
        let menu = document.getElementById('menu');
        menu.style.display = '';
    }
});
