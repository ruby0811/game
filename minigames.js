// 미니게임 로직 모음

const MiniGames = {
    platformer: {
        container: null,
        canvas: null,
        ctx: null,
        animationId: null,
        isPlaying: false,
        
        player: { x: 50, y: 150, width: 30, height: 30, dy: 0, gravity: 0.6, jumpPower: -10, isGrounded: true },
        obstacles: [],
        frames: 0,
        score: 0,

        init(parentElement) {
            this.container = parentElement;
            this.container.style.position = 'relative'; // 부모 요소 기준 위치
            
            // 기존 캔버스가 있다면 제거
            if (document.getElementById('minigame-canvas')) {
                document.getElementById('minigame-canvas').remove();
            }
            if (document.getElementById('minigame-ui')) {
                document.getElementById('minigame-ui').remove();
            }

            // 캔버스 생성
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'minigame-canvas';
            this.canvas.width = this.container.clientWidth || 400;
            this.canvas.height = this.container.clientHeight || 250;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.backgroundColor = '#1a1a2e'; // 다크 테마 배경
            this.canvas.style.borderRadius = '15px';
            this.canvas.style.zIndex = '10';
            
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);

            // UI 컨테이너 (점수, 시작/재시작 버튼 등)
            const uiDiv = document.createElement('div');
            uiDiv.id = 'minigame-ui';
            uiDiv.style.position = 'absolute';
            uiDiv.style.top = '0';
            uiDiv.style.left = '0';
            uiDiv.style.width = '100%';
            uiDiv.style.height = '100%';
            uiDiv.style.zIndex = '11';
            uiDiv.style.display = 'flex';
            uiDiv.style.flexDirection = 'column';
            uiDiv.style.alignItems = 'center';
            uiDiv.style.justifyContent = 'center';
            uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            uiDiv.style.borderRadius = '15px';

            const title = document.createElement('h3');
            title.innerText = '플랫포머 점프 게임';
            title.style.color = '#fff';
            title.style.marginBottom = '20px';

            const startBtn = document.createElement('button');
            startBtn.innerText = '게임 시작 (Space바)';
            startBtn.className = 'play-game-btn'; // 기존 스타일 재활용
            startBtn.style.padding = '10px 20px';
            startBtn.style.fontSize = '16px';
            startBtn.style.cursor = 'pointer';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.marginTop = '10px';
            closeBtn.style.padding = '5px 15px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';

            uiDiv.appendChild(title);
            uiDiv.appendChild(startBtn);
            uiDiv.appendChild(closeBtn);
            this.container.appendChild(uiDiv);

            // 이벤트 리스너 바인딩 (bind를 사용하여 this 컨텍스트 유지)
            this.handleInput = this.handleInput.bind(this);
            document.addEventListener('keydown', this.handleInput);
            this.canvas.addEventListener('mousedown', this.handleInput);
            this.canvas.addEventListener('touchstart', this.handleInput);

            startBtn.onclick = () => {
                uiDiv.style.display = 'none';
                this.startGame();
            };

            closeBtn.onclick = () => {
                this.stopGame();
            };
        },

        startGame() {
            this.isPlaying = true;
            this.frames = 0;
            this.score = 0;
            this.obstacles = [];
            this.player.y = this.canvas.height - this.player.height - 20; // 바닥 기준
            this.player.dy = 0;
            this.player.isGrounded = true;
            
            if (this.animationId) cancelAnimationFrame(this.animationId);
            this.loop();
        },

        stopGame() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            document.removeEventListener('keydown', this.handleInput);
            if(this.canvas) {
                this.canvas.removeEventListener('mousedown', this.handleInput);
                this.canvas.removeEventListener('touchstart', this.handleInput);
                this.canvas.remove();
            }
            if(document.getElementById('minigame-ui')) {
                document.getElementById('minigame-ui').remove();
            }
        },

        handleInput(e) {
            if (!this.isPlaying) return;
            if (e.type === 'keydown' && e.code !== 'Space' && e.code !== 'ArrowUp') return;
            
            if (e.type === 'keydown') e.preventDefault(); // 스페이스바 스크롤 방지

            if (this.player.isGrounded) {
                this.player.dy = this.player.jumpPower;
                this.player.isGrounded = false;
            }
        },

        loop() {
            if (!this.isPlaying) return;

            this.update();
            this.draw();
            this.animationId = requestAnimationFrame(this.loop.bind(this));
        },

        update() {
            this.frames++;
            this.score += 1; // 점수 증가

            // 플레이어 물리
            this.player.dy += this.player.gravity;
            this.player.y += this.player.dy;

            const floor = this.canvas.height - 20;

            if (this.player.y + this.player.height >= floor) {
                this.player.y = floor - this.player.height;
                this.player.dy = 0;
                this.player.isGrounded = true;
            }

            // 장애물 생성 (점점 빠르게)
            let spawnRate = 120 - Math.floor(this.score / 100);
            if (spawnRate < 40) spawnRate = 40;

            if (this.frames % spawnRate === 0) {
                let obsHeight = 20 + Math.random() * 30;
                this.obstacles.push({
                    x: this.canvas.width,
                    y: floor - obsHeight,
                    width: 20,
                    height: obsHeight,
                    speed: 5 + (this.score / 500)
                });
            }

            // 장애물 이동 및 충돌 체크
            for (let i = 0; i < this.obstacles.length; i++) {
                let obs = this.obstacles[i];
                obs.x -= obs.speed;

                // 충돌 판정 (AABB)
                if (
                    this.player.x < obs.x + obs.width &&
                    this.player.x + this.player.width > obs.x &&
                    this.player.y < obs.y + obs.height &&
                    this.player.y + this.player.height > obs.y
                ) {
                    this.gameOver();
                    return;
                }
            }

            // 화면 밖 장애물 제거
            this.obstacles = this.obstacles.filter(obs => obs.x + obs.width > 0);
        },

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 바닥 그리기
            const floor = this.canvas.height - 20;
            this.ctx.fillStyle = '#4a4e69';
            this.ctx.fillRect(0, floor, this.canvas.width, 20);

            // 플레이어 그리기
            this.ctx.fillStyle = '#e94560'; // 주인공 색상 (레드계열)
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            // 눈 그리기 (포인트)
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(this.player.x + 20, this.player.y + 5, 5, 5);

            // 장애물 그리기
            this.ctx.fillStyle = '#f9a826'; // 장애물 색상 (오렌지/옐로우)
            for (let i = 0; i < this.obstacles.length; i++) {
                let obs = this.obstacles[i];
                this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            }

            // 점수 그리기
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px "Pretendard", sans-serif';
            this.ctx.fillText(`Score: ${Math.floor(this.score / 10)}`, 20, 30);
        },

        gameOver() {
            this.isPlaying = false;
            
            // 오버레이 생성
            const uiDiv = document.createElement('div');
            uiDiv.id = 'minigame-ui';
            uiDiv.style.position = 'absolute';
            uiDiv.style.top = '0';
            uiDiv.style.left = '0';
            uiDiv.style.width = '100%';
            uiDiv.style.height = '100%';
            uiDiv.style.zIndex = '11';
            uiDiv.style.display = 'flex';
            uiDiv.style.flexDirection = 'column';
            uiDiv.style.alignItems = 'center';
            uiDiv.style.justifyContent = 'center';
            uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            uiDiv.style.borderRadius = '15px';

            const title = document.createElement('h2');
            title.innerText = 'Game Over!';
            title.style.color = '#e94560';
            title.style.marginBottom = '10px';

            const scoreText = document.createElement('p');
            scoreText.innerText = `최종 점수: ${Math.floor(this.score / 10)}`;
            scoreText.style.color = '#fff';
            scoreText.style.marginBottom = '20px';
            scoreText.style.fontSize = '18px';

            const restartBtn = document.createElement('button');
            restartBtn.innerText = '다시 하기 (Space바)';
            restartBtn.className = 'play-game-btn'; 
            restartBtn.style.padding = '10px 20px';
            restartBtn.style.fontSize = '16px';
            restartBtn.style.cursor = 'pointer';
            restartBtn.style.marginBottom = '10px';

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.padding = '5px 15px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';

            uiDiv.appendChild(title);
            uiDiv.appendChild(scoreText);
            uiDiv.appendChild(restartBtn);
            uiDiv.appendChild(closeBtn);
            this.container.appendChild(uiDiv);

            restartBtn.onclick = () => {
                uiDiv.remove();
                this.startGame();
            };

            closeBtn.onclick = () => {
                this.stopGame();
            };
            
            // 스페이스바로 재시작 지원
            const restartOnSpace = (e) => {
                if (e.code === 'Space') {
                    document.removeEventListener('keydown', restartOnSpace);
                    if(uiDiv) uiDiv.remove();
                    this.startGame();
                }
            };
            setTimeout(() => {
                document.addEventListener('keydown', restartOnSpace);
            }, 300); // 0.3초 딜레이 (죽자마자 눌리는 것 방지)
        }
    },
    tetris: {
        container: null,
        canvas: null,
        ctx: null,
        blockSize: 30,
        cols: 10,
        rows: 20,
        board: [],
        current: null,
        next: null,
        intervalId: null,
        speed: 800,
        isPlaying: false,

        init(parent) {
            this.container = parent;
            this.container.style.position = 'relative';

            if (document.getElementById('tetris-canvas')) document.getElementById('tetris-canvas').remove();
            if (document.getElementById('tetris-over')) document.getElementById('tetris-over').remove();

            // Calculate responsive block size based on container height
            const containerHeight = this.container.clientHeight || 250;
            this.blockSize = Math.floor(containerHeight / this.rows);
            if (this.blockSize < 10) this.blockSize = 10;

            this.canvas = document.createElement('canvas');
            this.canvas.id = 'tetris-canvas';
            this.canvas.width = this.blockSize * this.cols;
            this.canvas.height = this.blockSize * this.rows;
            this.canvas.style.position = 'absolute';
            // Center the canvas horizontally
            this.canvas.style.left = '50%';
            this.canvas.style.transform = 'translateX(-50%)';
            this.canvas.style.top = '0';
            this.canvas.style.backgroundColor = '#1a1a2e';
            this.canvas.style.zIndex = '12';
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');

            this._resetBoard();
            this._spawnPiece();
            this.isPlaying = true;
            this.speed = 800;
            
            // Add initial UI overlay
            const uiDiv = document.createElement('div');
            uiDiv.id = 'tetris-start-ui';
            uiDiv.style.position = 'absolute';
            uiDiv.style.top = '0';
            uiDiv.style.left = '0';
            uiDiv.style.width = '100%';
            uiDiv.style.height = '100%';
            uiDiv.style.zIndex = '13';
            uiDiv.style.display = 'flex';
            uiDiv.style.flexDirection = 'column';
            uiDiv.style.alignItems = 'center';
            uiDiv.style.justifyContent = 'center';
            uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            uiDiv.style.borderRadius = '15px';

            const title = document.createElement('h3');
            title.innerText = '테트리스';
            title.style.color = '#fff';
            title.style.marginBottom = '20px';

            const startBtn = document.createElement('button');
            startBtn.innerText = '게임 시작 (Space바)';
            startBtn.className = 'play-game-btn'; 
            startBtn.style.padding = '10px 20px';
            startBtn.style.fontSize = '16px';
            startBtn.style.cursor = 'pointer';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.marginTop = '10px';
            closeBtn.style.padding = '5px 15px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';

            uiDiv.appendChild(title);
            uiDiv.appendChild(startBtn);
            uiDiv.appendChild(closeBtn);
            this.container.appendChild(uiDiv);

            // Bind keys, keeping reference for removal later
            this._keyHandler = this._keyHandler.bind(this);
            document.addEventListener('keydown', this._keyHandler);

            startBtn.onclick = () => {
                uiDiv.remove();
                this._loop();
            };

            closeBtn.onclick = () => {
                uiDiv.remove();
                this.close();
            };
        },

        _resetBoard() {
            this.board = Array.from({length: this.rows}, () => Array(this.cols).fill(0));
        },

        _pieces() {
            const colors = ['#00f0f0','#f0a000','#a000f0','#00f000','#f00000','#0000f0','#f0f000'];
            return [
                {shape:[[1,1,1,1]],          color:colors[0]}, // I
                {shape:[[1,1],[1,1]],        color:colors[1]}, // O
                {shape:[[0,1,0],[1,1,1]],    color:colors[2]}, // T
                {shape:[[0,1,1],[1,1,0]],    color:colors[3]}, // S
                {shape:[[1,1,0],[0,1,1]],    color:colors[4]}, // Z
                {shape:[[1,0,0],[1,1,1]],    color:colors[5]}, // J
                {shape:[[0,0,1],[1,1,1]],    color:colors[6]}, // L
            ];
        },

        _spawnPiece() {
            const pieces = this._pieces();
            const idx = Math.floor(Math.random()*pieces.length);
            const piece = pieces[idx];
            this.current = {
                shape: piece.shape,
                color: piece.color,
                x: Math.floor(this.cols/2) - Math.ceil(piece.shape[0].length/2),
                y: 0
            };
        },

        _rotate(shape) {
            const h = shape.length, w = shape[0].length;
            const rot = Array.from({length:w},()=>Array(h).fill(0));
            for(let y=0;y<h;y++){
                for(let x=0;x<w;x++){
                    rot[x][h-1-y]=shape[y][x];
                }
            }
            return rot;
        },

        _collides(piece) {
            const {shape,x,y}=piece;
            for(let r=0;r<shape.length;r++){
                for(let c=0;c<shape[r].length;c++){
                    if(shape[r][c]){
                        const nx=x+c, ny=y+r;
                        if(nx<0||nx>=this.cols||ny>=this.rows) return true;
                        if(this.board[ny][nx]) return true;
                    }
                }
            }
            return false;
        },

        _merge() {
            const {shape,x,y,color}=this.current;
            for(let r=0;r<shape.length;r++){
                for(let c=0;c<shape[r].length;c++){
                    if(shape[r][c]){
                        this.board[y+r][x+c]=color;
                    }
                }
            }
        },

        _clearLines() {
            let cleared=0;
            this.board = this.board.filter(row=> {
                if(row.every(v=>v)) { cleared++; return false; }
                return true;
            });
            while(this.board.length<this.rows){
                this.board.unshift(Array(this.cols).fill(0));
            }
            if(cleared) this.speed = Math.max(100, this.speed - 50);
        },

        _loop() {
            if(!this.isPlaying) return;
            this.current.y++;
            if(this._collides(this.current)){
                this.current.y--;
                this._merge();
                this._clearLines();
                this._spawnPiece();
                if(this._collides(this.current)){
                    this._gameOver();
                    return;
                }
            }
            this._draw();
            this.intervalId = setTimeout(()=>this._loop(), this.speed);
        },

        _draw() {
            if(!this.ctx) return;
            const ctx=this.ctx;
            ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            for(let y=0;y<this.rows;y++){
                for(let x=0;x<this.cols;x++){
                    const col=this.board[y][x];
                    if(col){
                        ctx.fillStyle=col;
                        ctx.fillRect(x*this.blockSize, y*this.blockSize,
                                     this.blockSize-1, this.blockSize-1);
                    }
                }
            }
            const {shape,x,y,color}=this.current;
            ctx.fillStyle=color;
            for(let r=0;r<shape.length;r++){
                for(let c=0;c<shape[r].length;c++){
                    if(shape[r][c]){
                        ctx.fillRect((x+c)*this.blockSize,
                                     (y+r)*this.blockSize,
                                     this.blockSize-1, this.blockSize-1);
                    }
                }
            }
        },

        _keyHandler(e) {
            // Prevent scrolling space when UI is active
            if(document.getElementById('tetris-start-ui')) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    document.getElementById('tetris-start-ui').remove();
                    this._loop();
                }
                return;
            }

            if(!this.isPlaying) return;

            if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.code)) {
                e.preventDefault();
            }

            if(e.code==='ArrowLeft'){
                this.current.x--;
                if(this._collides(this.current)) this.current.x++;
            }
            else if(e.code==='ArrowRight'){
                this.current.x++;
                if(this._collides(this.current)) this.current.x--;
            }
            else if(e.code==='ArrowDown'){
                this.current.y++;
                if(this._collides(this.current)){
                    this.current.y--;
                }
            }
            else if(e.code==='ArrowUp'){
                const rot=this._rotate(this.current.shape);
                const saved=this.current.shape;
                this.current.shape=rot;
                if(this._collides(this.current)) this.current.shape=saved;
            }
            else if(e.code==='Space'){
                while(!this._collides(this.current)){
                    this.current.y++;
                }
                this.current.y--;
                // Immediately merge and clear
                this._merge();
                this._clearLines();
                this._spawnPiece();
                if(this._collides(this.current)){
                    this._draw();
                    this._gameOver();
                    return;
                }
                // Reset interval so it doesn't immediately drop the next piece
                clearTimeout(this.intervalId);
                this.intervalId = setTimeout(()=>this._loop(), this.speed);
            }
            this._draw();
        },

        _gameOver(){
            this.isPlaying=false;
            clearTimeout(this.intervalId);
            document.removeEventListener('keydown', this._keyHandler);
            
            const overlay=document.createElement('div');
            overlay.id='tetris-over';
            overlay.style.position='absolute';
            overlay.style.top='0';
            overlay.style.left='0';
            overlay.style.width='100%';
            overlay.style.height='100%';
            overlay.style.background='rgba(0,0,0,0.8)';
            overlay.style.display='flex';
            overlay.style.flexDirection='column';
            overlay.style.alignItems='center';
            overlay.style.justifyContent='center';
            overlay.style.zIndex='15';
            overlay.style.borderRadius='15px';

            const title = document.createElement('h2');
            title.innerText = 'Game Over';
            title.style.color = '#fff';
            title.style.marginBottom = '10px';

            const restartBtn = document.createElement('button');
            restartBtn.innerText = '다시 시작';
            restartBtn.className = 'play-game-btn'; 
            restartBtn.style.padding = '10px 20px';
            restartBtn.style.fontSize = '16px';
            restartBtn.style.cursor = 'pointer';
            restartBtn.style.marginBottom = '10px';
            restartBtn.onclick = () => this.restart();

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.padding = '5px 15px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => this.close();

            overlay.appendChild(title);
            overlay.appendChild(restartBtn);
            overlay.appendChild(closeBtn);
            this.container.appendChild(overlay);
        },

        restart(){
            const over=document.getElementById('tetris-over');
            if(over) over.remove();
            this._resetBoard();
            this._spawnPiece();
            this.speed=800;
            this.isPlaying=true;
            document.addEventListener('keydown', this._keyHandler);
            this._loop();
        },

        close(){
            const over=document.getElementById('tetris-over');
            if(over) over.remove();
            if(this.canvas) this.canvas.remove();
            this.isPlaying=false;
            clearTimeout(this.intervalId);
            document.removeEventListener('keydown', this._keyHandler);
        }
    }
};
