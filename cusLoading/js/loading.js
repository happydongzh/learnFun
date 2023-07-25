class Loading {
    constructor(target, text = 'Loading', options = {}) {
        this.target = typeof target === 'string' ? document.getElementById(target) : target;
        this.text = Array.from(text);
        this.options = options;
        this.init();
    };

    init() {
        this.target.classList.add('loading');
        this._renderDom();
    }
    _renderDom() {
        let charLength = this.text.length;
        this.text.forEach((e, i) => {
            let c = document.createElement('span');
            c.innerText = e;
            c.classList.add('char');
            c.style.animationDuration = 0.5 * charLength + 's';
            c.style.animationDelay =  i * 0.5 + 's';
            this.target.appendChild(c);
        });
    }
    changeText(newText) {
        if (newText === '') {
            return;
        }
        this.text = Array.from(newText);
        this.target.innerHTML = '';
        this._renderDom();
    }

    changeSpeed(newSpeed) {
        let chars = this.target.children,
        charLength = chars.length;;
        for (let i = 0; i < chars.length; i++) {
            chars[i].style.animationDuration = newSpeed * charLength + 's';
        }
    }
    changeBGColor(v) {
        this.target.parentElement.style.backgroundColor=v;

    }
    changeFontColor(v){
        Array.from(this.target.children).forEach(e => {
            e.style.color = v;
        });

    }
    changeShadowColor(v){
        Array.from(this.target.children).forEach(e => {
            let x = e.style.textShadow;
            if(x === ''){
                e.style.textShadow = '0px 0px 0px ' + v;
            }else{
                y = x.split(' ');
                y.splice(y.length-1, v);
                console.log(y.join(' '));
                e.style.textShadow = y.join(' ');
            }
        });
    }
    changeShowdowXTrans(v){
        Array.from(this.target.children).forEach(e => {
            let x = e.style.textShadow;
            if(x === ''){
                e.style.textShadow = '0px 0px 0px #FFF';
            }else{
                y = x.split(' ');
                y.splice(0, v+'px');
                console.log(y.join(' '));
                e.style.textShadow = y.join(' ');
            }
        });
    }

    changeShowdowYTrans(v){
        
    }
    changeShowdowBlurRadius(){

    }
}