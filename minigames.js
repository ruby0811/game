// 미니게임 로직 모음

const MiniGames = {
    // 공통 유틸: 전체화면 오버레이 생성
    _createOverlay() {
        if (document.getElementById('minigame-fullscreen-overlay')) {
            document.getElementById('minigame-fullscreen-overlay').remove();
        }
        
        const overlay = document.createElement('div');
        overlay.id = 'minigame-fullscreen-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.backdropFilter = 'blur(10px)'; // 배경 블러 처리
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const gameContainer = document.createElement('div');
        gameContainer.style.position = 'relative';
        gameContainer.style.width = '800px';
        gameContainer.style.maxWidth = '90vw';
        gameContainer.style.height = '600px';
        gameContainer.style.maxHeight = '90vh';
        gameContainer.style.backgroundColor = '#1a1a2e';
        gameContainer.style.borderRadius = '20px';
        gameContainer.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        gameContainer.style.overflow = 'hidden';

        overlay.appendChild(gameContainer);
        document.body.appendChild(overlay);

        return { overlay, gameContainer };
    },

    platformer: {
        overlay: null,
        container: null,
        canvas: null,
        ctx: null,
        animationId: null,
        isPlaying: false,
        
        player: { x: 50, y: 150, width: 40, height: 40, dy: 0, gravity: 0.6, jumpPower: -12, isGrounded: true },
        obstacles: [],
        frames: 0,
        score: 0,

        init() {
            const { overlay, gameContainer } = MiniGames._createOverlay();
            this.overlay = overlay;
            this.container = gameContainer;
            
            // 캔버스 생성
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'minigame-canvas';
            this.canvas.width = this.container.clientWidth;
            this.canvas.height = this.container.clientHeight;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.backgroundColor = '#1a1a2e';
            
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);

            // 초기 UI 컨테이너
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
            uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';

            const title = document.createElement('h2');
            title.innerText = '🏃‍♂️ 플랫포머 점프 게임';
            title.style.color = '#fff';
            title.style.fontSize = '2rem';
            title.style.marginBottom = '30px';

            const startBtn = document.createElement('button');
            startBtn.innerText = '게임 시작 (Space바)';
            startBtn.className = 'play-game-btn'; 
            startBtn.style.padding = '15px 30px';
            startBtn.style.fontSize = '1.2rem';
            startBtn.style.cursor = 'pointer';
            startBtn.style.marginBottom = '15px';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.padding = '10px 20px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '1rem';

            uiDiv.appendChild(title);
            uiDiv.appendChild(startBtn);
            uiDiv.appendChild(closeBtn);
            this.container.appendChild(uiDiv);

            // 이벤트 리스너 바인딩
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
            this.player.y = this.canvas.height - this.player.height - 40; // 바닥 기준
            this.player.dy = 0;
            this.player.isGrounded = true;
            
            if (this.animationId) cancelAnimationFrame(this.animationId);
            this.loop();
        },

        stopGame() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            document.removeEventListener('keydown', this.handleInput);
            if(this.overlay) {
                this.overlay.remove();
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
            this.score += 1;

            this.player.dy += this.player.gravity;
            this.player.y += this.player.dy;

            const floor = this.canvas.height - 40;

            if (this.player.y + this.player.height >= floor) {
                this.player.y = floor - this.player.height;
                this.player.dy = 0;
                this.player.isGrounded = true;
            }

            let spawnRate = 120 - Math.floor(this.score / 100);
            if (spawnRate < 40) spawnRate = 40;

            if (this.frames % spawnRate === 0) {
                let obsHeight = 30 + Math.random() * 40;
                this.obstacles.push({
                    x: this.canvas.width,
                    y: floor - obsHeight,
                    width: 30,
                    height: obsHeight,
                    speed: 12 + (this.score / 300)
                });
            }

            for (let i = 0; i < this.obstacles.length; i++) {
                let obs = this.obstacles[i];
                obs.x -= obs.speed;

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

            this.obstacles = this.obstacles.filter(obs => obs.x + obs.width > 0);
        },

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const floor = this.canvas.height - 40;
            this.ctx.fillStyle = '#4a4e69';
            this.ctx.fillRect(0, floor, this.canvas.width, 40);

            this.ctx.fillStyle = '#e94560'; 
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(this.player.x + 25, this.player.y + 8, 8, 8);

            this.ctx.fillStyle = '#f9a826';
            for (let i = 0; i < this.obstacles.length; i++) {
                let obs = this.obstacles[i];
                this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            }

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px "Pretendard", sans-serif';
            this.ctx.fillText(`Score: ${Math.floor(this.score / 10)}`, 30, 40);
        },

        gameOver() {
            this.isPlaying = false;
            
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
            uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

            const title = document.createElement('h2');
            title.innerText = 'Game Over!';
            title.style.color = '#e94560';
            title.style.fontSize = '3rem';
            title.style.marginBottom = '20px';

            const scoreText = document.createElement('p');
            scoreText.innerText = `최종 점수: ${Math.floor(this.score / 10)}`;
            scoreText.style.color = '#fff';
            scoreText.style.marginBottom = '30px';
            scoreText.style.fontSize = '1.5rem';

            const restartBtn = document.createElement('button');
            restartBtn.innerText = '다시 하기 (Space바)';
            restartBtn.className = 'play-game-btn'; 
            restartBtn.style.padding = '15px 30px';
            restartBtn.style.fontSize = '1.2rem';
            restartBtn.style.cursor = 'pointer';
            restartBtn.style.marginBottom = '15px';

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.padding = '10px 20px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '1rem';

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
            
            const restartOnSpace = (e) => {
                if (e.code === 'Space') {
                    document.removeEventListener('keydown', restartOnSpace);
                    if(uiDiv) uiDiv.remove();
                    this.startGame();
                }
            };
            setTimeout(() => {
                document.addEventListener('keydown', restartOnSpace);
            }, 300);
        }
    },

    tetris: {
        overlay: null,
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
        speed: 400,
        isPlaying: false,

        init() {
            const { overlay, gameContainer } = MiniGames._createOverlay();
            this.overlay = overlay;
            this.container = gameContainer;

            // Make the game container taller for Tetris
            this.container.style.width = '400px'; // Tetris is vertical
            this.container.style.height = '800px';

            const containerHeight = this.container.clientHeight || 600;
            this.blockSize = Math.floor(containerHeight / this.rows);
            if (this.blockSize < 10) this.blockSize = 10;

            this.canvas = document.createElement('canvas');
            this.canvas.id = 'tetris-canvas';
            this.canvas.width = this.blockSize * this.cols;
            this.canvas.height = this.blockSize * this.rows;
            this.canvas.style.position = 'absolute';
            this.canvas.style.left = '50%';
            this.canvas.style.transform = 'translateX(-50%)';
            this.canvas.style.top = '0';
            this.canvas.style.backgroundColor = '#1a1a2e';
            this.canvas.style.border = '2px solid #333';
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');

            this._resetBoard();
            this._spawnPiece();
            this.isPlaying = true;
            this.speed = 400;
            
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
            uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

            const title = document.createElement('h2');
            title.innerText = '🧩 테트리스';
            title.style.color = '#fff';
            title.style.fontSize = '2.5rem';
            title.style.marginBottom = '30px';

            const startBtn = document.createElement('button');
            startBtn.innerText = '게임 시작 (Space바)';
            startBtn.className = 'play-game-btn'; 
            startBtn.style.padding = '15px 30px';
            startBtn.style.fontSize = '1.2rem';
            startBtn.style.cursor = 'pointer';
            startBtn.style.marginBottom = '15px';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.padding = '10px 20px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';

            uiDiv.appendChild(title);
            uiDiv.appendChild(startBtn);
            uiDiv.appendChild(closeBtn);
            this.container.appendChild(uiDiv);

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
                        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                        ctx.strokeRect(x*this.blockSize, y*this.blockSize,
                                     this.blockSize, this.blockSize);
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
                        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                        ctx.strokeRect((x+c)*this.blockSize, (y+r)*this.blockSize,
                                     this.blockSize, this.blockSize);
                    }
                }
            }
        },

        _keyHandler(e) {
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
                this._merge();
                this._clearLines();
                this._spawnPiece();
                if(this._collides(this.current)){
                    this._draw();
                    this._gameOver();
                    return;
                }
                clearTimeout(this.intervalId);
                this.intervalId = setTimeout(()=>this._loop(), this.speed);
            }
            this._draw();
        },

        _gameOver(){
            this.isPlaying=false;
            clearTimeout(this.intervalId);
            document.removeEventListener('keydown', this._keyHandler);
            
            const uiDiv = document.createElement('div');
            uiDiv.id = 'tetris-over';
            uiDiv.style.position='absolute';
            uiDiv.style.top='0';
            uiDiv.style.left='0';
            uiDiv.style.width='100%';
            uiDiv.style.height='100%';
            uiDiv.style.background='rgba(0,0,0,0.85)';
            uiDiv.style.display='flex';
            uiDiv.style.flexDirection='column';
            uiDiv.style.alignItems='center';
            uiDiv.style.justifyContent='center';
            uiDiv.style.zIndex='15';

            const title = document.createElement('h2');
            title.innerText = 'Game Over';
            title.style.color = '#fff';
            title.style.fontSize = '3rem';
            title.style.marginBottom = '20px';

            const restartBtn = document.createElement('button');
            restartBtn.innerText = '다시 시작';
            restartBtn.className = 'play-game-btn'; 
            restartBtn.style.padding = '15px 30px';
            restartBtn.style.fontSize = '1.2rem';
            restartBtn.style.cursor = 'pointer';
            restartBtn.style.marginBottom = '15px';
            restartBtn.onclick = () => this.restart();

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.padding = '10px 20px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => this.close();

            uiDiv.appendChild(title);
            uiDiv.appendChild(restartBtn);
            uiDiv.appendChild(closeBtn);
            this.container.appendChild(uiDiv);
        },

        restart(){
            const over=document.getElementById('tetris-over');
            if(over) over.remove();
            this._resetBoard();
            this._spawnPiece();
            this.speed=400;
            this.isPlaying=true;
            document.addEventListener('keydown', this._keyHandler);
            this._loop();
        },

        close(){
            const over=document.getElementById('tetris-over');
            if(over) over.remove();
            if(this.overlay) this.overlay.remove();
            this.isPlaying=false;
            clearTimeout(this.intervalId);
            document.removeEventListener('keydown', this._keyHandler);
        }
    },

    fps: {
        overlay: null,
        container: null,
        animationId: null,
        isPlaying: false,
        score: 0,
        timeLeft: 30, // 30 seconds for 3D version
        timerInterval: null,
        
        // Three.js specific
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        raycaster: null,
        targets: [],
        lastSpawnTime: 0,
        
        // Movement
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        velocity: null,
        direction: null,
        prevTime: performance.now(),

        init() {
            const { overlay, gameContainer } = MiniGames._createOverlay();
            this.overlay = overlay;
            this.container = gameContainer;

            this.container.style.width = '100vw'; 
            this.container.style.height = '100vh';
            this.container.style.maxWidth = '100vw';
            this.container.style.maxHeight = '100vh';
            this.container.style.borderRadius = '0'; // Fullscreen immersion

            if (!window.THREE) {
                alert("Three.js 로딩 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.");
                this.close();
                return;
            }

            // Init Three.js Scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0x87ceeb ); // Sky blue
            this.scene.fog = new THREE.Fog( 0x87ceeb, 0, 750 );

            const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
            light.position.set( 0.5, 1, 0.75 );
            this.scene.add( light );

            this.camera = new THREE.PerspectiveCamera( 75, this.container.clientWidth / this.container.clientHeight, 1, 1000 );
            
            this.controls = new THREE.PointerLockControls( this.camera, this.container );

            // Floor
            const floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
            floorGeometry.rotateX( - Math.PI / 2 );
            const floorMaterial = new THREE.MeshBasicMaterial( { color: 0x556655, wireframe: true } );
            const floor = new THREE.Mesh( floorGeometry, floorMaterial );
            this.scene.add( floor );

            this.raycaster = new THREE.Raycaster();
            this.velocity = new THREE.Vector3();
            this.direction = new THREE.Vector3();

            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
            this.container.appendChild( this.renderer.domElement );

            // UI
            const uiDiv = document.createElement('div');
            uiDiv.id = 'fps-start-ui';
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
            uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';

            const title = document.createElement('h2');
            title.innerText = '🎮 3D FPS 훈련장';
            title.style.color = '#fff';
            title.style.fontSize = '3rem';
            title.style.marginBottom = '20px';

            const desc = document.createElement('p');
            desc.innerText = 'WASD: 이동 | 마우스: 시선 변경 | 좌클릭: 사격\n화면을 클릭하면 마우스가 고정되며 게임이 시작됩니다.\n(마우스 고정을 해제하려면 ESC 키를 누르세요)\n제한시간: 30초';
            desc.style.color = '#ccc';
            desc.style.textAlign = 'center';
            desc.style.marginBottom = '40px';
            desc.style.lineHeight = '1.5';

            const startBtn = document.createElement('button');
            startBtn.innerText = '화면을 클릭하여 시작';
            startBtn.className = 'play-game-btn'; 
            startBtn.style.padding = '15px 30px';
            startBtn.style.fontSize = '1.2rem';
            startBtn.style.cursor = 'pointer';
            startBtn.style.marginBottom = '15px';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.padding = '10px 20px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => this.close();

            uiDiv.appendChild(title);
            uiDiv.appendChild(desc);
            uiDiv.appendChild(startBtn);
            uiDiv.appendChild(closeBtn);
            this.container.appendChild(uiDiv);

            // Crosshair
            const crosshair = document.createElement('div');
            crosshair.innerText = '+';
            crosshair.style.position = 'absolute';
            crosshair.style.top = '50%';
            crosshair.style.left = '50%';
            crosshair.style.transform = 'translate(-50%, -50%)';
            crosshair.style.color = 'lime';
            crosshair.style.fontSize = '30px';
            crosshair.style.pointerEvents = 'none';
            crosshair.style.zIndex = '10';
            this.container.appendChild(crosshair);

            // HUD
            const hud = document.createElement('div');
            hud.id = 'fps-hud';
            hud.style.position = 'absolute';
            hud.style.top = '20px';
            hud.style.left = '20px';
            hud.style.right = '20px';
            hud.style.display = 'flex';
            hud.style.justifyContent = 'space-between';
            hud.style.color = '#fff';
            hud.style.fontSize = '24px';
            hud.style.fontWeight = 'bold';
            hud.style.pointerEvents = 'none';
            hud.style.zIndex = '10';
            
            const scoreSpan = document.createElement('span');
            scoreSpan.id = 'fps-score';
            scoreSpan.innerText = '🎯 처치: 0';
            
            const timeSpan = document.createElement('span');
            timeSpan.id = 'fps-time';
            timeSpan.innerText = '⏱ 시간: 30초';

            hud.appendChild(scoreSpan);
            hud.appendChild(timeSpan);
            this.container.appendChild(hud);

            // Gun visual (simple HTML overlay)
            const gun = document.createElement('div');
            gun.id = 'fps-gun';
            gun.innerText = '🔫';
            gun.style.position = 'absolute';
            gun.style.bottom = '-20px';
            gun.style.right = '30%';
            gun.style.fontSize = '120px';
            gun.style.pointerEvents = 'none';
            gun.style.transition = 'transform 0.05s';
            gun.style.zIndex = '10';
            this.container.appendChild(gun);

            // Events
            this.onKeyDown = this.onKeyDown.bind(this);
            this.onKeyUp = this.onKeyUp.bind(this);
            this.onMouseClick = this.onMouseClick.bind(this);
            this.onWindowResize = this.onWindowResize.bind(this);

            document.addEventListener( 'keydown', this.onKeyDown );
            document.addEventListener( 'keyup', this.onKeyUp );
            window.addEventListener( 'resize', this.onWindowResize );

            uiDiv.addEventListener( 'click', () => {
                this.controls.lock();
            });

            this.controls.addEventListener( 'lock', () => {
                uiDiv.style.display = 'none';
                if (!this.isPlaying) this.startGame();
            });

            this.controls.addEventListener( 'unlock', () => {
                if (this.isPlaying) {
                    uiDiv.style.display = 'flex';
                    uiDiv.querySelector('h2').innerText = '일시 정지';
                    uiDiv.querySelector('p').innerText = '화면을 클릭하여 계속하기';
                }
            });

            document.addEventListener('mousedown', this.onMouseClick);
            
            this.animate = this.animate.bind(this);
        },

        startGame() {
            this.isPlaying = true;
            this.score = 0;
            this.timeLeft = 30;
            this.prevTime = performance.now();
            
            // Clear existing targets
            this.targets.forEach(t => this.scene.remove(t));
            this.targets = [];

            this.updateHUD();
            
            if (this.animationId) cancelAnimationFrame(this.animationId);
            if (this.timerInterval) clearInterval(this.timerInterval);

            this.timerInterval = setInterval(() => {
                if (this.controls.isLocked) {
                    this.timeLeft--;
                    this.updateHUD();
                    if (this.timeLeft <= 0) {
                        this.gameOver();
                    }
                }
            }, 1000);

            // Add initial targets
            for(let i=0; i<10; i++) this.spawnTarget();

            this.animate();
        },

        onKeyDown( event ) {
            switch ( event.code ) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
            }
        },

        onKeyUp( event ) {
            switch ( event.code ) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
            }
        },

        onMouseClick(event) {
            if (!this.controls.isLocked || !this.isPlaying) return;

            // Recoil animation
            const gun = document.getElementById('fps-gun');
            if(gun) {
                gun.style.transform = 'translateY(30px) rotate(-10deg)';
                setTimeout(() => {
                    gun.style.transform = 'translateY(0) rotate(0deg)';
                }, 100);
            }

            // Raycast
            this.raycaster.setFromCamera( new THREE.Vector2(0,0), this.camera ); // center of screen

            const intersects = this.raycaster.intersectObjects( this.targets );

            if ( intersects.length > 0 ) {
                const hitObj = intersects[ 0 ].object;
                this.score++;
                this.updateHUD();
                
                // Remove hit target
                this.scene.remove(hitObj);
                this.targets = this.targets.filter(t => t !== hitObj);
                
                // Spawn a new one
                this.spawnTarget();
            }
        },

        spawnTarget() {
            const geometry = new THREE.BoxGeometry( 10, 10, 10 );
            const material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } );
            const cube = new THREE.Mesh( geometry, material );

            cube.position.x = ( Math.random() - 0.5 ) * 200;
            cube.position.y = Math.random() * 50 + 10;
            cube.position.z = ( Math.random() - 0.5 ) * 200;
            
            // Keep targets away from start position (0,0,0)
            if (cube.position.length() < 30) {
                cube.position.z -= 40;
            }

            this.scene.add( cube );
            this.targets.push( cube );
        },

        updateHUD() {
            const s = document.getElementById('fps-score');
            const t = document.getElementById('fps-time');
            if (s) s.innerText = `🎯 처치: ${this.score}`;
            if (t) {
                t.innerText = `⏱ 시간: ${this.timeLeft}초`;
                t.style.color = this.timeLeft <= 5 ? '#ff4757' : '#fff';
            }
        },

        animate() {
            if (!this.isPlaying) return;
            this.animationId = requestAnimationFrame( this.animate );

            const time = performance.now();

            if ( this.controls.isLocked === true ) {
                const delta = ( time - this.prevTime ) / 1000;

                this.velocity.x -= this.velocity.x * 10.0 * delta;
                this.velocity.z -= this.velocity.z * 10.0 * delta;

                this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
                this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
                this.direction.normalize(); // consistent movements

                const moveSpeed = 800.0;
                if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * moveSpeed * delta;
                if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * moveSpeed * delta;

                this.controls.moveRight( - this.velocity.x * delta );
                this.controls.moveForward( - this.velocity.z * delta );
                
                // Keep camera above ground
                if (this.controls.getObject().position.y < 10) {
                    this.controls.getObject().position.y = 10;
                }
            }

            // Slowly rotate targets
            for (let t of this.targets) {
                t.rotation.x += 0.01;
                t.rotation.y += 0.02;
            }

            this.prevTime = time;
            this.renderer.render( this.scene, this.camera );
        },

        onWindowResize() {
            if (!this.camera || !this.renderer) return;
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
        },

        gameOver() {
            this.isPlaying = false;
            this.controls.unlock();
            cancelAnimationFrame(this.animationId);
            clearInterval(this.timerInterval);
            
            const startUi = document.getElementById('fps-start-ui');
            if(startUi) startUi.remove();

            const uiDiv = document.createElement('div');
            uiDiv.id = 'fps-over';
            uiDiv.style.position='absolute';
            uiDiv.style.top='0';
            uiDiv.style.left='0';
            uiDiv.style.width='100%';
            uiDiv.style.height='100%';
            uiDiv.style.background='rgba(0,0,0,0.85)';
            uiDiv.style.display='flex';
            uiDiv.style.flexDirection='column';
            uiDiv.style.alignItems='center';
            uiDiv.style.justifyContent='center';
            uiDiv.style.zIndex='15';

            const title = document.createElement('h2');
            title.innerText = '미션 종료!';
            title.style.color = '#e94560';
            title.style.fontSize = '3rem';
            title.style.marginBottom = '20px';

            const scoreText = document.createElement('p');
            scoreText.innerText = `최종 처치: ${this.score}개의 타겟`;
            scoreText.style.color = '#fff';
            scoreText.style.marginBottom = '30px';
            scoreText.style.fontSize = '1.5rem';

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '나가기';
            closeBtn.style.padding = '10px 20px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#fff';
            closeBtn.style.border = '1px solid #fff';
            closeBtn.style.borderRadius = '20px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => this.close();

            uiDiv.appendChild(title);
            uiDiv.appendChild(scoreText);
            uiDiv.appendChild(closeBtn);
            this.container.appendChild(uiDiv);
        },

        close() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            clearInterval(this.timerInterval);
            
            document.removeEventListener( 'keydown', this.onKeyDown );
            document.removeEventListener( 'keyup', this.onKeyUp );
            window.removeEventListener( 'resize', this.onWindowResize );
            document.removeEventListener('mousedown', this.onMouseClick);
            
            if(this.controls) this.controls.unlock();
            if(this.overlay) this.overlay.remove();
        }
    },

    tps: {
        overlay: null,
        container: null,
        animationId: null,
        isPlaying: false,
        score: 0,
        timeLeft: 30,
        timerInterval: null,

        // Three.js
        scene: null,
        camera: null,
        renderer: null,
        raycaster: null,
        player: null,       // Group (block character)
        targets: [],

        // Camera orbit
        cameraAngleH: 0,      // horizontal angle around player
        cameraAngleV: 0.3,    // vertical angle
        cameraDist: 40,
        isPointerDown: false,
        lastPointerX: 0,
        lastPointerY: 0,

        // Movement
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        isShooting: false,
        shootCooldown: 0,

        // Bullet trail
        bullets: [],

        init() {
            const { overlay, gameContainer } = MiniGames._createOverlay();
            this.overlay = overlay;
            this.container = gameContainer;

            this.container.style.width = '100vw';
            this.container.style.height = '100vh';
            this.container.style.maxWidth = '100vw';
            this.container.style.maxHeight = '100vh';
            this.container.style.borderRadius = '0';

            if (!window.THREE) {
                alert("Three.js 로딩 오류. 새로고침 후 다시 시도해주세요.");
                this.close(); return;
            }

            // ── Scene ──────────────────────────────────────────────
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x87ceeb);
            this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.005);

            // Lights
            const ambient = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambient);
            const dir = new THREE.DirectionalLight(0xffffff, 0.8);
            dir.position.set(50, 100, 50);
            this.scene.add(dir);

            // Floor (grass)
            const floorGeo = new THREE.PlaneGeometry(400, 400, 20, 20);
            floorGeo.rotateX(-Math.PI / 2);
            const floorMat = new THREE.MeshLambertMaterial({ color: 0x4a7c4e });
            this.scene.add(new THREE.Mesh(floorGeo, floorMat));

            // Floor grid lines
            const gridHelper = new THREE.GridHelper(400, 40, 0x2a5c2e, 0x2a5c2e);
            this.scene.add(gridHelper);

            // Some cover boxes for environment feel
            const wallMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
            const wallPositions = [
                [30, 0, -20], [-25, 0, 30], [50, 0, 50], [-50, 0, -40],
                [0, 0, 60], [-60, 0, 10], [70, 0, -50], [-10, 0, -70]
            ];
            wallPositions.forEach(([x, y, z]) => {
                const w = 8 + Math.random() * 8;
                const h = 8 + Math.random() * 10;
                const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), wallMat);
                box.position.set(x, h / 2, z);
                this.scene.add(box);
            });

            // ── Player (block character) ───────────────────────────
            this.player = this._buildBlockMan();
            this.player.position.set(0, 0, 0);
            this.scene.add(this.player);

            // ── Camera ────────────────────────────────────────────
            this.camera = new THREE.PerspectiveCamera(
                70, this.container.clientWidth / this.container.clientHeight, 0.1, 1000
            );

            // ── Renderer ──────────────────────────────────────────
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.renderer.shadowMap.enabled = true;
            this.container.appendChild(this.renderer.domElement);

            this.raycaster = new THREE.Raycaster();

            // ── Spawn enemies ──────────────────────────────────────
            for (let i = 0; i < 10; i++) this._spawnEnemy();

            // ── HUD ───────────────────────────────────────────────
            this._buildHUD();

            // ── Start Screen ──────────────────────────────────────
            const uiDiv = this._buildStartUI();
            this.container.appendChild(uiDiv);

            // ── Events ────────────────────────────────────────────
            this._onKeyDown = this._onKeyDown.bind(this);
            this._onKeyUp   = this._onKeyUp.bind(this);
            this._onPD      = this._onPD.bind(this);
            this._onPM      = this._onPM.bind(this);
            this._onPU      = this._onPU.bind(this);
            this._onResize  = this._onResize.bind(this);
            this._onClick   = this._onClick.bind(this);

            document.addEventListener('keydown', this._onKeyDown);
            document.addEventListener('keyup',   this._onKeyUp);
            this.renderer.domElement.addEventListener('mousedown', this._onPD);
            this.renderer.domElement.addEventListener('mousemove', this._onPM);
            window.addEventListener('mouseup',  this._onPU);
            window.addEventListener('resize',   this._onResize);
            this.renderer.domElement.addEventListener('click', this._onClick);

            this._animate = this._animate.bind(this);
        },

        // ── Block Man Builder ─────────────────────────────────────
        _buildBlockMan() {
            const group = new THREE.Group();

            const skin  = new THREE.MeshLambertMaterial({ color: 0xffe0bd });
            const shirt = new THREE.MeshLambertMaterial({ color: 0x1565c0 });
            const pants = new THREE.MeshLambertMaterial({ color: 0x37474f });
            const shoe  = new THREE.MeshLambertMaterial({ color: 0x212121 });
            const hair  = new THREE.MeshLambertMaterial({ color: 0x3e2723 });
            const gunM  = new THREE.MeshLambertMaterial({ color: 0x333333 });

            const add = (geo, mat, x, y, z, parent) => {
                const m = new THREE.Mesh(geo, mat);
                m.position.set(x, y, z);
                (parent || group).add(m);
                return m;
            };

            // Head
            add(new THREE.BoxGeometry(4, 4, 4), skin,  0, 15.5, 0);
            add(new THREE.BoxGeometry(4.1, 1.2, 4.2), hair, 0, 17.4, 0); // hair top
            add(new THREE.BoxGeometry(4.2, 1, 0.3), hair, 0, 15.8, -2.1); // hair back

            // Body
            add(new THREE.BoxGeometry(5, 6, 3), shirt, 0, 10.5, 0);

            // Arms
            const leftArm  = add(new THREE.BoxGeometry(1.8, 5, 1.8), shirt, -3.4, 10.5, 0);
            const rightArm = add(new THREE.BoxGeometry(1.8, 5, 1.8), shirt,  3.4, 10.5, 0);

            // Gun in right hand
            add(new THREE.BoxGeometry(0.8, 0.8, 3.5), gunM, 0, -2.5, 1.8, rightArm);
            add(new THREE.BoxGeometry(0.6, 1.8, 0.6), gunM, 0, -1.8, 0.5, rightArm); // grip

            // Legs
            const leftLeg  = add(new THREE.BoxGeometry(2, 5.5, 2), pants, -1.2, 4.5, 0);
            const rightLeg = add(new THREE.BoxGeometry(2, 5.5, 2), pants,  1.2, 4.5, 0);

            // Shoes
            add(new THREE.BoxGeometry(2.2, 1, 3),   shoe, -1.2, 1.2, 0.4);
            add(new THREE.BoxGeometry(2.2, 1, 3),   shoe,  1.2, 1.2, 0.4);

            // Store limb refs for walk animation
            group.userData.leftArm  = leftArm;
            group.userData.rightArm = rightArm;
            group.userData.leftLeg  = leftLeg;
            group.userData.rightLeg = rightLeg;
            group.userData.walkTime = 0;

            return group;
        },

        // ── Enemy Builder ─────────────────────────────────────────
        _spawnEnemy() {
            const group = new THREE.Group();
            const mat = new THREE.MeshLambertMaterial({ color: 0xc62828 });
            const dark = new THREE.MeshLambertMaterial({ color: 0x7f0000 });

            const add = (geo, m, x, y, z) => {
                const mesh = new THREE.Mesh(geo, m);
                mesh.position.set(x, y, z);
                group.add(mesh);
            };

            add(new THREE.BoxGeometry(4, 4, 4), mat, 0, 15.5, 0);   // head
            add(new THREE.BoxGeometry(5, 6, 3), mat, 0, 10.5, 0);   // body
            add(new THREE.BoxGeometry(1.8, 5, 1.8), dark, -3.4, 10.5, 0); // left arm
            add(new THREE.BoxGeometry(1.8, 5, 1.8), dark,  3.4, 10.5, 0); // right arm
            add(new THREE.BoxGeometry(2, 5.5, 2), dark, -1.2, 4.5, 0);    // left leg
            add(new THREE.BoxGeometry(2, 5.5, 2), dark,  1.2, 4.5, 0);    // right leg

            // Place enemy randomly but away from player
            let ex, ez;
            do {
                ex = (Math.random() - 0.5) * 300;
                ez = (Math.random() - 0.5) * 300;
            } while (Math.hypot(ex, ez) < 40);

            group.position.set(ex, 0, ez);
            group.userData.isEnemy = true;
            group.userData.hp = 1;
            group.userData.walkTime = Math.random() * Math.PI * 2;

            this.scene.add(group);
            this.targets.push(group);
        },

        // ── HUD ───────────────────────────────────────────────────
        _buildHUD() {
            // Crosshair
            const ch = document.createElement('div');
            ch.id = 'tps-crosshair';
            ch.innerHTML = '<span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:lime;font-size:28px;font-weight:bold;pointer-events:none;z-index:10;">⊕</span>';
            ch.style.position = 'absolute';
            ch.style.top = '0'; ch.style.left = '0';
            ch.style.width = '100%'; ch.style.height = '100%';
            ch.style.pointerEvents = 'none';
            ch.style.zIndex = '10';
            this.container.appendChild(ch);

            // Stats bar
            const hud = document.createElement('div');
            hud.style.cssText = 'position:absolute;top:20px;left:20px;right:20px;display:flex;justify-content:space-between;color:#fff;font-size:22px;font-weight:bold;pointer-events:none;z-index:10;text-shadow:0 2px 4px #000;';
            hud.innerHTML = '<span id="tps-score">🎯 처치: 0</span><span id="tps-time">⏱ 시간: 30초</span>';
            this.container.appendChild(hud);

            // Controls guide
            const guide = document.createElement('div');
            guide.style.cssText = 'position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#fff;font-size:13px;text-align:center;pointer-events:none;z-index:10;text-shadow:0 1px 3px #000;background:rgba(0,0,0,0.4);padding:8px 18px;border-radius:12px;';
            guide.innerHTML = '🕹️ <b>WASD</b> 이동 &nbsp;|&nbsp; 🖱️ 마우스 드래그로 카메라 회전 &nbsp;|&nbsp; 🖱️ 클릭으로 사격';
            this.container.appendChild(guide);
        },

        _buildStartUI() {
            const ui = document.createElement('div');
            ui.id = 'tps-start-ui';
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.65);';

            ui.innerHTML = `
                <h2 style="color:#fff;font-size:3rem;margin-bottom:15px;">🎮 3인칭 슈팅 (TPS)</h2>
                <p style="color:#ccc;text-align:center;line-height:1.7;margin-bottom:30px;">
                    WASD: 이동 &nbsp;|&nbsp; 마우스 드래그: 카메라 회전<br>
                    클릭: 사격 (화면 중앙 기준 레이캐스트)<br>
                    30초 안에 최대한 많은 적을 처치하세요!
                </p>
            `;

            const startBtn = document.createElement('button');
            startBtn.innerText = '게임 시작';
            startBtn.className = 'play-game-btn';
            startBtn.style.cssText = 'padding:15px 35px;font-size:1.2rem;cursor:pointer;margin-bottom:12px;';
            startBtn.onclick = () => { ui.remove(); this._startGame(); };

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '닫기';
            closeBtn.style.cssText = 'padding:10px 22px;background:transparent;color:#fff;border:1px solid #fff;border-radius:20px;cursor:pointer;';
            closeBtn.onclick = () => this.close();

            ui.appendChild(startBtn);
            ui.appendChild(closeBtn);
            return ui;
        },

        // ── Game Flow ─────────────────────────────────────────────
        _startGame() {
            this.isPlaying = true;
            this.score = 0;
            this.timeLeft = 30;
            this._updateHUD();

            if (this.timerInterval) clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this._updateHUD();
                if (this.timeLeft <= 0) this._gameOver();
            }, 1000);

            if (this.animationId) cancelAnimationFrame(this.animationId);
            this._animate();
        },

        _updateHUD() {
            const s = document.getElementById('tps-score');
            const t = document.getElementById('tps-time');
            if (s) s.innerText = `🎯 처치: ${this.score}`;
            if (t) {
                t.innerText = `⏱ 시간: ${this.timeLeft}초`;
                t.style.color = this.timeLeft <= 5 ? '#ff4757' : '#fff';
            }
        },

        // ── Input ─────────────────────────────────────────────────
        _onKeyDown(e) {
            switch(e.code) {
                case 'KeyW': case 'ArrowUp':    this.moveForward  = true; break;
                case 'KeyS': case 'ArrowDown':  this.moveBackward = true; break;
                case 'KeyA': case 'ArrowLeft':  this.moveLeft     = true; break;
                case 'KeyD': case 'ArrowRight': this.moveRight    = true; break;
            }
        },
        _onKeyUp(e) {
            switch(e.code) {
                case 'KeyW': case 'ArrowUp':    this.moveForward  = false; break;
                case 'KeyS': case 'ArrowDown':  this.moveBackward = false; break;
                case 'KeyA': case 'ArrowLeft':  this.moveLeft     = false; break;
                case 'KeyD': case 'ArrowRight': this.moveRight    = false; break;
            }
        },
        _onPD(e) { this.isPointerDown = true; this.lastPointerX = e.clientX; this.lastPointerY = e.clientY; },
        _onPU()  { this.isPointerDown = false; },
        _onPM(e) {
            if (!this.isPointerDown) return;
            const dx = e.clientX - this.lastPointerX;
            const dy = e.clientY - this.lastPointerY;
            this.cameraAngleH -= dx * 0.005;
            this.cameraAngleV  = Math.max(0.1, Math.min(1.0, this.cameraAngleV + dy * 0.004));
            this.lastPointerX = e.clientX;
            this.lastPointerY = e.clientY;
        },
        _onClick() {
            if (!this.isPlaying) return;
            this._shoot();
        },
        _onResize() {
            if (!this.camera || !this.renderer) return;
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        },

        // ── Shooting ──────────────────────────────────────────────
        _shoot() {
            // Shoot from center screen (NDC 0,0) using camera direction
            this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

            // Use recursive intersect on all enemy groups (easier to hit)
            const hits = this.raycaster.intersectObjects(this.targets, true);
            if (hits.length > 0) {
                // Find parent group
                let obj = hits[0].object;
                while (obj.parent && !obj.parent.userData.isEnemy) obj = obj.parent;
                const group = obj.parent;
                if (group && group.userData.isEnemy) {
                    // Flash red then remove
                    group.traverse(c => { if (c.isMesh) c.material = new THREE.MeshLambertMaterial({ color: 0xff6600 }); });
                    setTimeout(() => {
                        this.scene.remove(group);
                        this.targets = this.targets.filter(t => t !== group);
                        this._spawnEnemy(); // replenish
                    }, 150);
                    this.score++;
                    this._updateHUD();
                }
            }

            // Muzzle flash effect (brief bright pulse)
            const flash = document.createElement('div');
            flash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,200,50,0.15);pointer-events:none;z-index:9;';
            this.container.appendChild(flash);
            setTimeout(() => flash.remove(), 60);
        },

        // ── Animation Loop ────────────────────────────────────────
        _animate() {
            if (!this.isPlaying) return;
            this.animationId = requestAnimationFrame(this._animate);

            const speed = 1.30; // faster movement

            // Movement direction based on camera horizontal angle
            if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
                const fwd = new THREE.Vector3(
                    -Math.sin(this.cameraAngleH),
                    0,
                    -Math.cos(this.cameraAngleH)
                );
                const right = new THREE.Vector3(
                    Math.cos(this.cameraAngleH),
                    0,
                    -Math.sin(this.cameraAngleH)
                );

                let moveDir = new THREE.Vector3();
                if (this.moveForward)  moveDir.add(fwd);
                if (this.moveBackward) moveDir.sub(fwd);
                if (this.moveLeft)     moveDir.sub(right);
                if (this.moveRight)    moveDir.add(right);

                moveDir.normalize().multiplyScalar(speed);
                this.player.position.add(moveDir);

                // Clamp to arena
                this.player.position.x = Math.max(-190, Math.min(190, this.player.position.x));
                this.player.position.z = Math.max(-190, Math.min(190, this.player.position.z));

                // Rotate player to face movement direction
                if (moveDir.length() > 0.001) {
                    const angle = Math.atan2(moveDir.x, moveDir.z);
                    this.player.rotation.y = angle;
                }

                // Walk animation
                const ud = this.player.userData;
                ud.walkTime += 0.18;
                const sw = Math.sin(ud.walkTime) * 0.5;
                ud.leftArm.rotation.x  =  sw;
                ud.rightArm.rotation.x = -sw;
                ud.leftLeg.rotation.x  = -sw;
                ud.rightLeg.rotation.x =  sw;
            } else {
                // Idle – reset limbs
                const ud = this.player.userData;
                ud.leftArm.rotation.x  = 0;
                ud.rightArm.rotation.x = 0;
                ud.leftLeg.rotation.x  = 0;
                ud.rightLeg.rotation.x = 0;
            }

            // Enemy AI: walk toward player (slower & stop further away → easier to shoot)
            this.targets.forEach(g => {
                const toPlayer = new THREE.Vector3().subVectors(this.player.position, g.position);
                toPlayer.y = 0;
                const dist = toPlayer.length();
                if (dist > 20) {
                    toPlayer.normalize().multiplyScalar(0.04); // slower enemy
                    g.position.add(toPlayer);
                    g.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
                }
                // Gentle bob animation
                g.userData.walkTime += 0.06;
                g.position.y = Math.sin(g.userData.walkTime) * 0.3;
            });

            // Third-person camera: orbit around player
            const px = this.player.position.x;
            const py = this.player.position.y + 12; // target height
            const pz = this.player.position.z;

            const camX = px + this.cameraDist * Math.sin(this.cameraAngleH) * Math.cos(this.cameraAngleV);
            const camY = py + this.cameraDist * Math.sin(this.cameraAngleV);
            const camZ = pz + this.cameraDist * Math.cos(this.cameraAngleH) * Math.cos(this.cameraAngleV);

            this.camera.position.set(camX, camY, camZ);
            this.camera.lookAt(px, py, pz);

            this.renderer.render(this.scene, this.camera);
        },

        // ── Game Over ─────────────────────────────────────────────
        _gameOver() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            clearInterval(this.timerInterval);

            const ui = document.createElement('div');
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;';

            ui.innerHTML = `
                <h2 style="color:#e94560;font-size:3.5rem;margin-bottom:15px;">미션 종료!</h2>
                <p style="color:#fff;font-size:1.8rem;margin-bottom:30px;">최종 처치: ${this.score}명의 적</p>
            `;

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '나가기';
            closeBtn.style.cssText = 'padding:12px 26px;background:transparent;color:#fff;border:1px solid #fff;border-radius:22px;cursor:pointer;font-size:1rem;';
            closeBtn.onclick = () => this.close();
            ui.appendChild(closeBtn);

            this.container.appendChild(ui);
        },

        // ── Cleanup ───────────────────────────────────────────────
        close() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            clearInterval(this.timerInterval);

            document.removeEventListener('keydown', this._onKeyDown);
            document.removeEventListener('keyup',   this._onKeyUp);
            window.removeEventListener('mouseup',   this._onPU);
            window.removeEventListener('resize',    this._onResize);

            if (this.renderer) {
                this.renderer.domElement.removeEventListener('mousedown', this._onPD);
                this.renderer.domElement.removeEventListener('mousemove', this._onPM);
                this.renderer.domElement.removeEventListener('click',     this._onClick);
                this.renderer.dispose();
            }
            if (this.overlay) this.overlay.remove();
        }
    },

    fighting: {
        overlay: null,
        canvas: null,
        ctx: null,
        animationId: null,
        isPlaying: false,
        timeLeft: 60,
        timerInterval: null,
        keys: {},

        player: null,
        enemy: null,

        // Settings
        gravity: 0.7,
        floorY: 0,

        init() {
            const { overlay, gameContainer } = MiniGames._createOverlay();
            this.overlay = overlay;
            
            gameContainer.style.background = 'url("https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=1000") center/cover';
            gameContainer.style.position = 'relative';

            this.canvas = document.createElement('canvas');
            this.canvas.width = 800;
            this.canvas.height = 450;
            this.canvas.style.backgroundColor = 'rgba(0,0,0,0.5)';
            this.canvas.style.borderRadius = '10px';
            this.canvas.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
            gameContainer.appendChild(this.canvas);

            this.ctx = this.canvas.getContext('2d');
            this.floorY = this.canvas.height - 50;

            this._buildHUD(gameContainer);
            this._buildStartUI(gameContainer);

            this._onKeyDown = this._onKeyDown.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this);
            window.addEventListener('keydown', this._onKeyDown);
            window.addEventListener('keyup', this._onKeyUp);
            
            this._animate = this._animate.bind(this);
        },

        _buildHUD(container) {
            const hud = document.createElement('div');
            hud.style.cssText = 'position:absolute;top:20px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:flex-start;pointer-events:none;z-index:10;';
            
            const hpStyle = 'width:300px;height:30px;background:#333;border:3px solid #fff;border-radius:15px;overflow:hidden;position:relative;';
            const barStyle = 'height:100%;transition:width 0.1s;';

            hud.innerHTML = `
                <div style="text-align:left;">
                    <div style="color:#fff;font-size:20px;font-weight:bold;margin-bottom:5px;text-shadow:1px 1px 2px #000;">PLAYER (P1)</div>
                    <div style="${hpStyle}"><div id="fight-p1-hp" style="${barStyle}background:#00d2d3;width:100%;"></div></div>
                </div>
                <div id="fight-timer" style="color:#feca57;font-size:40px;font-weight:900;text-shadow:2px 2px 4px #000;margin:0 20px;">60</div>
                <div style="text-align:right;">
                    <div style="color:#fff;font-size:20px;font-weight:bold;margin-bottom:5px;text-shadow:1px 1px 2px #000;">CPU</div>
                    <div style="${hpStyle}"><div id="fight-p2-hp" style="${barStyle}background:#ff6b6b;width:100%;float:right;"></div></div>
                </div>
            `;

            const guide = document.createElement('div');
            guide.style.cssText = 'position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#fff;font-size:14px;background:rgba(0,0,0,0.6);padding:10px 20px;border-radius:20px;pointer-events:none;text-align:center;line-height:1.5;';
            guide.innerHTML = '<b>A/D</b>: 이동 &nbsp;|&nbsp; <b>W</b>: 점프<br><b>J</b>: 펀치 (약공격) &nbsp;|&nbsp; <b>K</b>: 킥 (강공격) &nbsp;|&nbsp; <b>S</b>: 가드';
            
            container.appendChild(hud);
            container.appendChild(guide);
        },

        _buildStartUI(container) {
            const ui = document.createElement('div');
            ui.id = 'fight-start-ui';
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;';
            
            ui.innerHTML = `
                <h1 style="color:#ff4757;font-size:4rem;text-shadow:3px 3px 0 #fff;margin-bottom:20px;font-style:italic;">FIGHT!</h1>
                <p style="color:#ccc;font-size:1.2rem;text-align:center;margin-bottom:30px;line-height:1.6;">
                    상대방의 체력을 먼저 0으로 만드세요!<br>J(펀치)는 빠르고, K(킥)는 느리지만 데미지가 큽니다.
                </p>
                <button id="fight-start-btn" style="padding:15px 40px;font-size:1.5rem;font-weight:bold;background:#ff4757;color:#fff;border:none;border-radius:30px;cursor:pointer;box-shadow:0 5px 15px rgba(255,71,87,0.4);transition:transform 0.1s;">START</button>
            `;
            
            container.appendChild(ui);
            
            document.getElementById('fight-start-btn').onclick = () => {
                ui.remove();
                this._startGame();
            };
        },

        _startGame() {
            this.isPlaying = true;
            this.timeLeft = 60;
            
            // Create Fighter class inline
            class Fighter {
                constructor(x, y, color, isPlayer) {
                    this.x = x;
                    this.y = y;
                    this.width = 50;
                    this.height = 120;
                    this.color = color;
                    this.isPlayer = isPlayer;
                    
                    this.hp = 100;
                    this.speed = 9;
                    this.velY = 0;
                    
                    this.isJumping = false;
                    this.isAttacking = false;
                    this.isBlocking = false;
                    this.attackType = null; // 'punch' or 'kick'
                    this.attackTimer = 0;
                    this.attackDuration = 0;
                    this.attackCooldown = 0;
                    this.facingRight = isPlayer;
                    
                    this.hitbox = { x: 0, y: 0, w: 0, h: 0, active: false };
                }

                draw(ctx) {
                    ctx.save();
                    
                    // Body
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    
                    // Head
                    ctx.fillStyle = '#f1c40f'; // yellow head
                    ctx.beginPath();
                    ctx.arc(this.x + this.width/2, this.y - 15, 20, 0, Math.PI * 2);
                    ctx.fill();

                    // Block shield
                    if (this.isBlocking) {
                        ctx.strokeStyle = 'rgba(52, 152, 219, 0.8)';
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        if (this.facingRight) {
                            ctx.moveTo(this.x + this.width + 10, this.y - 20);
                            ctx.lineTo(this.x + this.width + 10, this.y + this.height);
                        } else {
                            ctx.moveTo(this.x - 10, this.y - 20);
                            ctx.lineTo(this.x - 10, this.y + this.height);
                        }
                        ctx.stroke();
                    }

                    // Hitbox (Attack)
                    if (this.hitbox.active) {
                        ctx.fillStyle = this.attackType === 'kick' ? 'rgba(231, 76, 60, 0.7)' : 'rgba(241, 196, 15, 0.7)';
                        ctx.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);
                    }

                    ctx.restore();
                }

                attack(type) {
                    if (this.isAttacking || this.attackCooldown > 0 || this.isBlocking) return;
                    
                    this.isAttacking = true;
                    this.attackType = type;
                    this.attackTimer = 0;
                    
                    if (type === 'punch') {
                        this.attackDuration = 15; // fast
                        this.attackCooldown = 10;
                        this.hitbox.w = 60;
                        this.hitbox.h = 20;
                    } else if (type === 'kick') {
                        this.attackDuration = 25; // slow
                        this.attackCooldown = 20;
                        this.hitbox.w = 80;
                        this.hitbox.h = 30;
                    }
                }

                update(gravity, floorY) {
                    // Physics
                    this.velY += gravity;
                    this.y += this.velY;
                    
                    if (this.y + this.height >= floorY) {
                        this.y = floorY - this.height;
                        this.velY = 0;
                        this.isJumping = false;
                    }

                    // Cooldowns
                    if (this.attackCooldown > 0 && !this.isAttacking) {
                        this.attackCooldown--;
                    }

                    // Attack logic
                    if (this.isAttacking) {
                        this.attackTimer++;
                        
                        // Activate hitbox in the middle of the animation
                        if (this.attackTimer > this.attackDuration * 0.2 && this.attackTimer < this.attackDuration * 0.8) {
                            this.hitbox.active = true;
                            if (this.attackType === 'punch') {
                                this.hitbox.x = this.facingRight ? this.x + this.width : this.x - this.hitbox.w;
                                this.hitbox.y = this.y + 20;
                            } else {
                                this.hitbox.x = this.facingRight ? this.x + this.width : this.x - this.hitbox.w;
                                this.hitbox.y = this.y + 60;
                            }
                        } else {
                            this.hitbox.active = false;
                        }

                        if (this.attackTimer >= this.attackDuration) {
                            this.isAttacking = false;
                            this.hitbox.active = false;
                        }
                    } else {
                        this.hitbox.active = false;
                    }

                    // Screen bounds
                    this.x = Math.max(0, Math.min(800 - this.width, this.x));
                }
            }

            this.player = new Fighter(150, 0, '#3498db', true);
            this.enemy = new Fighter(600, 0, '#e74c3c', false);

            this._updateHUD();

            if (this.timerInterval) clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                document.getElementById('fight-timer').innerText = this.timeLeft;
                if (this.timeLeft <= 0) this._endGame(this.player.hp > this.enemy.hp ? 'player' : (this.player.hp < this.enemy.hp ? 'enemy' : 'draw'));
            }, 1000);

            if (this.animationId) cancelAnimationFrame(this.animationId);
            this._animate();
        },

        _onKeyDown(e) { this.keys[e.code] = true; },
        _onKeyUp(e) { this.keys[e.code] = false; },

        _animate() {
            if (!this.isPlaying) return;
            this.animationId = requestAnimationFrame(this._animate);

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw floor line
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.floorY);
            this.ctx.lineTo(this.canvas.width, this.floorY);
            this.ctx.stroke();

            // Handle Input (Player)
            this.player.isBlocking = this.keys['KeyS'];
            
            if (!this.player.isAttacking && !this.player.isBlocking) {
                if (this.keys['KeyA']) this.player.x -= this.player.speed;
                if (this.keys['KeyD']) this.player.x += this.player.speed;
                if (this.keys['KeyW'] && !this.player.isJumping) {
                    this.player.velY = -20;
                    this.player.isJumping = true;
                }
            }
            if (this.keys['KeyJ']) this.player.attack('punch');
            if (this.keys['KeyK']) this.player.attack('kick');

            // Handle AI (Enemy)
            this._updateAI();

            // Update facing direction
            if (this.player.x < this.enemy.x) {
                this.player.facingRight = true;
                this.enemy.facingRight = false;
            } else {
                this.player.facingRight = false;
                this.enemy.facingRight = true;
            }

            // Update physics & attacks
            this.player.update(this.gravity, this.floorY);
            this.enemy.update(this.gravity, this.floorY);

            // Collision Detection (Hitboxes)
            this._checkHit(this.player, this.enemy);
            this._checkHit(this.enemy, this.player);

            // Draw
            this.player.draw(this.ctx);
            this.enemy.draw(this.ctx);
        },

        _updateAI() {
            const dist = this.enemy.x - this.player.x;
            const absDist = Math.abs(dist);

            this.enemy.isBlocking = false;

            if (this.enemy.isAttacking) return;

            // Simple state machine
            const r = Math.random();

            if (absDist > 100) {
                // Move towards player
                if (dist > 0) this.enemy.x -= this.enemy.speed * 0.8;
                else this.enemy.x += this.enemy.speed * 0.8;
            } else {
                // Close range: attack or block
                if (this.player.isAttacking && r < 0.3) {
                    this.enemy.isBlocking = true;
                } else if (r < 0.05) {
                    this.enemy.attack('punch');
                } else if (r < 0.08) {
                    this.enemy.attack('kick');
                } else {
                    // Slight retreat to maintain distance
                    if (dist > 0) this.enemy.x += this.enemy.speed * 0.4;
                    else this.enemy.x -= this.enemy.speed * 0.4;
                }
            }
        },

        _checkHit(attacker, defender) {
            if (!attacker.hitbox.active || defender.hp <= 0) return;

            // Simple AABB collision
            const r1 = attacker.hitbox;
            const r2 = { x: defender.x, y: defender.y, w: defender.width, h: defender.height };

            if (r1.x < r2.x + r2.w &&
                r1.x + r1.w > r2.x &&
                r1.y < r2.y + r2.h &&
                r1.y + r1.h > r2.y) {
                
                // Hit registered!
                attacker.hitbox.active = false; // Prevent multiple hits from one attack

                // Calculate damage
                let damage = attacker.attackType === 'punch' ? 5 : 12;
                
                if (defender.isBlocking) {
                    damage = Math.floor(damage / 4); // Block reduces damage significantly
                    
                    // Visual block effect
                    this.ctx.fillStyle = 'blue';
                    this.ctx.font = '20px Arial';
                    this.ctx.fillText('BLOCK', defender.x, defender.y - 40);
                } else {
                    // Knockback
                    defender.x += attacker.facingRight ? 30 : -30;
                    defender.y -= 10;
                    defender.isAttacking = false; // Interrupt attack
                    
                    // Visual hit effect
                    this.ctx.fillStyle = 'red';
                    this.ctx.font = '30px Arial';
                    this.ctx.fillText('HIT!', defender.x, defender.y - 40);
                }

                defender.hp = Math.max(0, defender.hp - damage);
                this._updateHUD();

                if (defender.hp <= 0) {
                    this._endGame(attacker.isPlayer ? 'player' : 'enemy');
                }
            }
        },

        _updateHUD() {
            const p1 = document.getElementById('fight-p1-hp');
            const p2 = document.getElementById('fight-p2-hp');
            if (p1 && this.player) p1.style.width = `${this.player.hp}%`;
            if (p2 && this.enemy) p2.style.width = `${this.enemy.hp}%`;
        },

        _endGame(winner) {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            clearInterval(this.timerInterval);

            const ui = document.createElement('div');
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;';
            
            let resultText = winner === 'player' ? 'YOU WIN!' : (winner === 'enemy' ? 'YOU LOSE...' : 'DRAW');
            let resultColor = winner === 'player' ? '#00d2d3' : (winner === 'enemy' ? '#ff6b6b' : '#feca57');

            ui.innerHTML = `
                <h2 style="color:${resultColor};font-size:5rem;margin-bottom:15px;text-shadow:4px 4px 0 #000;">K.O.</h2>
                <h3 style="color:#fff;font-size:2.5rem;margin-bottom:40px;">${resultText}</h3>
            `;

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '나가기';
            closeBtn.style.cssText = 'padding:12px 30px;background:transparent;color:#fff;border:2px solid #fff;border-radius:25px;cursor:pointer;font-size:1.2rem;transition:all 0.2s;';
            closeBtn.onmouseover = () => { closeBtn.style.background = '#fff'; closeBtn.style.color = '#000'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = 'transparent'; closeBtn.style.color = '#fff'; };
            closeBtn.onclick = () => { ui.remove(); this.close(); };
            
            ui.appendChild(closeBtn);
            
            // Append to gameContainer (canvas.parentElement) instead of HUD to allow pointer events
            this.canvas.parentElement.appendChild(ui);
        },

        close() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            clearInterval(this.timerInterval);
            window.removeEventListener('keydown', this._onKeyDown);
            window.removeEventListener('keyup', this._onKeyUp);
            if (this.overlay) this.overlay.remove();
        }
    },

    horror: {
        overlay: null,
        container: null,
        animationId: null,
        isPlaying: false,

        // Three.js
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        raycaster: null,
        
        // Lighting
        flashlight: null,
        flickerTimer: 0,

        // Entities
        notes: [],
        collectedNotes: 0,
        totalNotes: 5,
        enemy: null,

        // Movement
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        velocity: null,
        direction: null,
        prevTime: 0,
        
        // Maze collision
        walls: [],

        init() {
            const { overlay, gameContainer } = MiniGames._createOverlay();
            this.overlay = overlay;
            this.container = gameContainer;

            this.container.style.width = '100vw';
            this.container.style.height = '100vh';
            this.container.style.maxWidth = '100vw';
            this.container.style.maxHeight = '100vh';
            this.container.style.borderRadius = '0';
            this.container.style.backgroundColor = '#000';

            if (!window.THREE || !THREE.PointerLockControls) {
                alert("Three.js 로딩 오류. 새로고침 후 다시 시도해주세요.");
                this.close(); return;
            }

            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x050505);
            this.scene.fog = new THREE.FogExp2(0x000000, 0.025); // Thinner fog so we can see a bit

            this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
            this.camera.position.y = 5;

            // Flashlight (PointLight is more reliable when attached to camera)
            this.flashlight = new THREE.PointLight(0xffeedd, 2.0, 50);
            this.camera.add(this.flashlight);
            this.scene.add(this.camera);

            // Ambient light
            this.scene.add(new THREE.AmbientLight(0x222222));

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.container.appendChild(this.renderer.domElement);

            this.controls = new THREE.PointerLockControls(this.camera, document.body);
            this.raycaster = new THREE.Raycaster();

            this.velocity = new THREE.Vector3();
            this.direction = new THREE.Vector3();

            this._buildMaze();
            this._spawnEnemy();
            this._buildHUD();

            const uiDiv = this._buildStartUI();
            this.container.appendChild(uiDiv);

            this._onKeyDown = this._onKeyDown.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this);
            this._onClick = this._onClick.bind(this);
            this._onResize = this._onResize.bind(this);

            document.addEventListener('keydown', this._onKeyDown);
            document.addEventListener('keyup', this._onKeyUp);
            document.addEventListener('mousedown', this._onClick);
            window.addEventListener('resize', this._onResize);

            this._animate = this._animate.bind(this);
        },

        _buildMaze() {
            const floorGeo = new THREE.PlaneGeometry(200, 200);
            const floorMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.rotation.x = -Math.PI / 2;
            this.scene.add(floor);

            // Simple procedurally generated maze (grid based)
            const wallGeo = new THREE.BoxGeometry(10, 15, 10);
            const textureLoader = new THREE.TextureLoader();
            const wallTex = textureLoader.load('images/horror_wall.png');
            wallTex.wrapS = THREE.RepeatWrapping;
            wallTex.wrapT = THREE.RepeatWrapping;
            wallTex.repeat.set(1, 1);
            const wallMat = new THREE.MeshLambertMaterial({ map: wallTex, color: 0x555555 }); // Textured Dark walls
            
            const gridSize = 10;
            const mazeMap = [];
            
            // Random scatter walls
            for (let i = 0; i < 60; i++) {
                const x = (Math.floor(Math.random() * gridSize) - gridSize/2) * 10;
                const z = (Math.floor(Math.random() * gridSize) - gridSize/2) * 10;
                
                // Keep center clear for spawn
                if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;
                
                const wall = new THREE.Mesh(wallGeo, wallMat);
                wall.position.set(x, 7.5, z);
                this.scene.add(wall);
                this.walls.push(wall);
                
                mazeMap.push({x, z});
            }

            // Spawn Notes (glowing floating cubes)
            const noteGeo = new THREE.BoxGeometry(1, 1, 1);
            const noteMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Glows in dark
            
            let notesSpawned = 0;
            while(notesSpawned < this.totalNotes) {
                const nx = (Math.floor(Math.random() * gridSize) - gridSize/2) * 10;
                const nz = (Math.floor(Math.random() * gridSize) - gridSize/2) * 10;
                
                // Avoid placing exactly inside a wall
                if (mazeMap.some(w => w.x === nx && w.z === nz)) continue;
                
                const note = new THREE.Mesh(noteGeo, noteMat);
                note.position.set(nx, 4, nz);
                note.userData.isNote = true;
                this.scene.add(note);
                this.notes.push(note);
                notesSpawned++;
            }
        },

        _spawnEnemy() {
            const enemyGroup = new THREE.Group();
            
            // Tall dark figure
            const bodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 8);
            const bodyMat = new THREE.MeshBasicMaterial({ color: 0x050505 }); // very dark, unaffected by light
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 6;
            enemyGroup.add(body);
            
            // Glowing red eyes
            const eyeGeo = new THREE.SphereGeometry(0.3, 8, 8);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            
            const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
            eye1.position.set(-0.5, 11, 1.4);
            enemyGroup.add(eye1);
            
            const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
            eye2.position.set(0.5, 11, 1.4);
            enemyGroup.add(eye2);

            // Spawn far away
            enemyGroup.position.set(60, 0, 60);
            this.scene.add(enemyGroup);
            this.enemy = enemyGroup;
        },

        _buildHUD() {
            const hud = document.createElement('div');
            hud.id = 'horror-hud';
            hud.style.cssText = 'position:absolute;top:20px;left:20px;color:#fff;font-size:24px;font-family:monospace;pointer-events:none;z-index:10;text-shadow:0 0 5px #fff;';
            hud.innerHTML = `쪽지: <span id="horror-score">0</span> / 5`;
            
            const crosshair = document.createElement('div');
            crosshair.style.cssText = 'position:absolute;top:50%;left:50%;width:4px;height:4px;background:rgba(255,255,255,0.5);border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:10;';
            
            this.container.appendChild(hud);
            this.container.appendChild(crosshair);
        },

        _buildStartUI() {
            const ui = document.createElement('div');
            ui.id = 'horror-start-ui';
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;';
            
            ui.innerHTML = `
                <h1 style="color:#aa0000;font-size:4rem;font-family:serif;letter-spacing:5px;margin-bottom:20px;">어둠 속에서</h1>
                <p style="color:#666;font-size:1.2rem;text-align:center;line-height:1.8;margin-bottom:40px;font-family:monospace;">
                    이곳을 빠져나가려면 빛나는 쪽지 5장이 필요하다.<br>
                    절대 뒤를 돌아보지 마라.<br><br>
                    WASD: 이동 | 마우스: 손전등 | 좌클릭: 쪽지 획득
                </p>
            `;

            const btnDiv = document.createElement('div');
            btnDiv.style.display = 'flex';
            btnDiv.style.gap = '20px';

            const startBtn = document.createElement('button');
            startBtn.innerText = '어둠 속으로';
            startBtn.style.cssText = 'padding:15px 30px;background:transparent;color:#aa0000;border:1px solid #aa0000;font-size:1.2rem;cursor:pointer;font-family:serif;';
            startBtn.onmouseover = () => { startBtn.style.background = '#aa0000'; startBtn.style.color = '#000'; };
            startBtn.onmouseout = () => { startBtn.style.background = 'transparent'; startBtn.style.color = '#aa0000'; };
            startBtn.onclick = () => {
                ui.remove();
                this.controls.lock();
            };

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '포기하기';
            closeBtn.style.cssText = 'padding:15px 30px;background:transparent;color:#444;border:1px solid #444;font-size:1.2rem;cursor:pointer;font-family:serif;';
            closeBtn.onclick = () => this.close();

            btnDiv.appendChild(startBtn);
            btnDiv.appendChild(closeBtn);
            ui.appendChild(btnDiv);

            // Pointer lock events
            this.controls.addEventListener('lock', () => {
                this.isPlaying = true;
                this.prevTime = performance.now();
                if (!this.animationId) this._animate();
            });

            this.controls.addEventListener('unlock', () => {
                this.isPlaying = false;
                if(this.collectedNotes < this.totalNotes) {
                    this.container.appendChild(ui); // Show pause/start screen again
                }
            });

            return ui;
        },

        _onKeyDown(e) {
            switch (e.code) {
                case 'ArrowUp': case 'KeyW': this.moveForward = true; break;
                case 'ArrowLeft': case 'KeyA': this.moveLeft = true; break;
                case 'ArrowDown': case 'KeyS': this.moveBackward = true; break;
                case 'ArrowRight': case 'KeyD': this.moveRight = true; break;
                case 'KeyE': this._onClick(); break;
            }
        },

        _onKeyUp(e) {
            switch (e.code) {
                case 'ArrowUp': case 'KeyW': this.moveForward = false; break;
                case 'ArrowLeft': case 'KeyA': this.moveLeft = false; break;
                case 'ArrowDown': case 'KeyS': this.moveBackward = false; break;
                case 'ArrowRight': case 'KeyD': this.moveRight = false; break;
            }
        },

        _onClick() {
            if (!this.isPlaying) return;
            
            // Collect note
            this.raycaster.setFromCamera(new THREE.Vector2(0,0), this.camera);
            const intersects = this.raycaster.intersectObjects(this.notes);
            
            if (intersects.length > 0 && intersects[0].distance < 30) {
                const note = intersects[0].object;
                this.scene.remove(note);
                this.notes = this.notes.filter(n => n !== note);
                this.collectedNotes++;
                
                document.getElementById('horror-score').innerText = this.collectedNotes;
                
                if (this.collectedNotes >= this.totalNotes) {
                    this._winGame();
                }
            }
        },

        _onResize() {
            if (!this.camera || !this.renderer) return;
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        },

        _animate() {
            if (!this.isPlaying) return;
            this.animationId = requestAnimationFrame(this._animate);

            const time = performance.now();
            const delta = (time - this.prevTime) / 1000;
            this.prevTime = time;

            // Player Movement
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;

            this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
            this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
            this.direction.normalize();

            const moveSpeed = 80.0; // Walk speed
            if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * moveSpeed * delta;
            if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * moveSpeed * delta;

            // Simple wall collision check (Raycaster)
            const oldPos = this.camera.position.clone();
            this.controls.moveRight(-this.velocity.x * delta);
            this.controls.moveForward(-this.velocity.z * delta);
            
            // If out of bounds or inside wall, revert (crude collision)
            let collided = false;
            for(let w of this.walls) {
                const box = new THREE.Box3().setFromObject(w);
                // expand box slightly for player radius
                box.min.x -= 2; box.min.z -= 2;
                box.max.x += 2; box.max.z += 2;
                
                if(box.containsPoint(new THREE.Vector3(this.camera.position.x, 7.5, this.camera.position.z))) {
                    collided = true;
                    break;
                }
            }
            if(collided) {
                this.camera.position.copy(oldPos);
            }

            // Note floating animation
            this.notes.forEach(note => {
                note.position.y = 4 + Math.sin(time * 0.003 + note.position.x) * 0.5;
                note.rotation.y += 0.02;
                note.rotation.x += 0.01;
            });

            // Flashlight flicker effect
            if (Math.random() < 0.02) {
                this.flashlight.intensity = Math.random() > 0.5 ? 0 : 1.5;
            } else {
                this.flashlight.intensity = 1.5;
            }

            // Enemy AI
            const dist = this.camera.position.distanceTo(this.enemy.position);
            if (dist < 40) {
                // Enemy moves towards player
                const toPlayer = new THREE.Vector3().subVectors(this.camera.position, this.enemy.position);
                toPlayer.y = 0;
                toPlayer.normalize();
                
                // Moves faster when player has more notes
                const enemySpeed = 5 + (this.collectedNotes * 4);
                this.enemy.position.addScaledVector(toPlayer, enemySpeed * delta);
                this.enemy.lookAt(this.camera.position);
                
                // Jump Scare
                if (dist < 3) {
                    this._jumpScare();
                    return; // stop animating
                }
            }

            this.renderer.render(this.scene, this.camera);
        },

        _jumpScare() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            this.controls.unlock();

            const ui = document.createElement('div');
            // Terrifying jump scare styling with screen shake
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;overflow:hidden;';
            
            // Generate a scary face with CSS and random bloody text
            ui.innerHTML = `
                <style>
                    @keyframes shake {
                        0% { transform: translate(20px, 20px) rotate(0deg); }
                        10% { transform: translate(-20px, -30px) rotate(-2deg); }
                        20% { transform: translate(-40px, 0px) rotate(2deg); }
                        30% { transform: translate(40px, 30px) rotate(0deg); }
                        40% { transform: translate(20px, -20px) rotate(2deg); }
                        50% { transform: translate(-20px, 30px) rotate(-2deg); }
                        60% { transform: translate(-40px, 20px) rotate(0deg); }
                        70% { transform: translate(40px, -20px) rotate(-2deg); }
                        80% { transform: translate(-20px, -20px) rotate(2deg); }
                        90% { transform: translate(20px, 30px) rotate(0deg); }
                        100% { transform: translate(0px, 0px) rotate(0deg); }
                    }
                    @keyframes flash {
                        0%, 50%, 100% { background-color: #8a0303; }
                        25%, 75% { background-color: #000; }
                    }
                    .scare-container {
                        animation: flash 0.1s infinite, shake 0.1s infinite;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        background-color: #000;
                        background-image: url('images/horror_face.png');
                        background-size: cover;
                        background-position: center;
                        background-blend-mode: hard-light;
                    }
                </style>
                <div class="scare-container">
                    <h1 style="color:#fff;font-size:8rem;font-family:serif;margin-top:50px;text-shadow:0 0 20px #ff0000;background:rgba(0,0,0,0.5);padding:20px;">잡 혔 다</h1>
                </div>
            `;

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '비명 지르며 나가기';
            closeBtn.style.cssText = 'position:absolute;bottom:50px;padding:20px 50px;background:#000;color:#ff0000;border:3px solid #ff0000;font-size:2rem;cursor:pointer;font-weight:bold;z-index:10000;';
            closeBtn.onmouseover = () => { closeBtn.style.background = '#ff0000'; closeBtn.style.color = '#000'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = '#000'; closeBtn.style.color = '#ff0000'; };
            closeBtn.onclick = () => this.close();
            ui.appendChild(closeBtn);

            this.container.appendChild(ui);
        },

        _winGame() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            this.controls.unlock();

            const ui = document.createElement('div');
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;';
            
            ui.innerHTML = `
                <h1 style="color:#000;font-size:4rem;font-family:serif;margin-bottom:20px;">생존</h1>
                <p style="color:#333;font-size:1.5rem;">무사히 모든 쪽지를 찾아 탈출했습니다.</p>
            `;

            const closeBtn = document.createElement('button');
            closeBtn.innerText = '나가기';
            closeBtn.style.cssText = 'margin-top:50px;padding:15px 40px;background:#000;color:#fff;border:none;font-size:1.5rem;cursor:pointer;';
            closeBtn.onclick = () => this.close();
            ui.appendChild(closeBtn);

            this.container.appendChild(ui);
        },

        close() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            
            document.removeEventListener('keydown', this._onKeyDown);
            document.removeEventListener('keyup', this._onKeyUp);
            window.removeEventListener('resize', this._onResize);
            
            if (this.renderer) {
                document.removeEventListener('mousedown', this._onClick);
                this.renderer.dispose();
            }
            if (this.controls) this.controls.unlock();
            
            if (this.overlay) this.overlay.remove();
        }
    },

    rhythm: {
        overlay: null,
        container: null,
        canvas: null,
        ctx: null,
        animationId: null,
        isPlaying: false,

        audio: null,
        notes: [], // { lane: 0~3, y: float, hit: boolean }
        keys: { 'd': false, 'f': false, 'j': false, 'k': false },
        laneKeys: ['d', 'f', 'j', 'k'],
        
        score: 0,
        combo: 0,
        maxCombo: 0,
        
        hitLineY: 500, // y coordinate of the judgment line
        noteSpeed: 8,
        lastSpawnTime: 0,
        spawnInterval: 400, // ms between notes
        
        effects: [], // floating text like "PERFECT", "MISS"

        init() {
            const { overlay, gameContainer } = MiniGames._createOverlay();
            this.overlay = overlay;
            this.container = gameContainer;

            this.canvas = document.createElement('canvas');
            this.canvas.width = 800;
            this.canvas.height = 600;
            this.canvas.style.display = 'block';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');

            this.audio = new Audio('sounds/track.mp3');
            this.audio.loop = false;
            
            this.notes = [];
            this.effects = [];
            this.score = 0;
            this.combo = 0;
            this.maxCombo = 0;
            this.lastSpawnTime = 0;

            const uiDiv = this._buildStartUI();
            this.container.appendChild(uiDiv);

            this._onKeyDown = this._onKeyDown.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this);
            window.addEventListener('keydown', this._onKeyDown);
            window.addEventListener('keyup', this._onKeyUp);

            this._loop = this._loop.bind(this);
        },

        _buildStartUI() {
            const ui = document.createElement('div');
            ui.id = 'rhythm-start-ui';
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(10,10,20,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;';
            
            ui.innerHTML = `
                <h1 style="color:#00ffff;font-size:4rem;font-family:sans-serif;letter-spacing:3px;margin-bottom:20px;text-shadow:0 0 10px #00ffff;">NEON BEAT</h1>
                <p style="color:#fff;font-size:1.2rem;text-align:center;line-height:1.8;margin-bottom:40px;">
                    떨어지는 노트를 판정선에 맞춰 누르세요!<br><br>
                    <b style="color:#00ffff;font-size:1.5rem;">[ D ] [ F ] [ J ] [ K ]</b>
                </p>
            `;

            const btnDiv = document.createElement('div');
            btnDiv.style.display = 'flex';
            btnDiv.style.gap = '20px';

            const startBtn = document.createElement('button');
            startBtn.innerText = 'START';
            startBtn.style.cssText = 'padding:15px 40px;background:transparent;color:#00ffff;border:2px solid #00ffff;border-radius:25px;font-size:1.5rem;cursor:pointer;font-weight:bold;box-shadow:0 0 15px rgba(0,255,255,0.5);transition:all 0.2s;';
            startBtn.onmouseover = () => { startBtn.style.background = '#00ffff'; startBtn.style.color = '#000'; };
            startBtn.onmouseout = () => { startBtn.style.background = 'transparent'; startBtn.style.color = '#00ffff'; };
            startBtn.onclick = () => {
                ui.remove();
                this._startGame();
            };

            const closeBtn = document.createElement('button');
            closeBtn.innerText = 'EXIT';
            closeBtn.style.cssText = 'padding:15px 40px;background:transparent;color:#fff;border:2px solid #fff;border-radius:25px;font-size:1.5rem;cursor:pointer;font-weight:bold;transition:all 0.2s;';
            closeBtn.onmouseover = () => { closeBtn.style.background = '#fff'; closeBtn.style.color = '#000'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = 'transparent'; closeBtn.style.color = '#fff'; };
            closeBtn.onclick = () => this.close();

            btnDiv.appendChild(startBtn);
            btnDiv.appendChild(closeBtn);
            ui.appendChild(btnDiv);

            return ui;
        },

        _startGame() {
            this.isPlaying = true;
            this.audio.currentTime = 0;
            this.audio.play().catch(e => console.error("Audio play failed:", e));
            
            // Audio end listener
            this.audio.onended = () => {
                this._endGame();
            };

            this.lastSpawnTime = performance.now();
            this._loop();
        },

        _onKeyDown(e) {
            const key = e.key.toLowerCase();
            if (this.laneKeys.includes(key) && !this.keys[key]) {
                this.keys[key] = true;
                if (this.isPlaying) this._checkHit(this.laneKeys.indexOf(key));
            }
        },

        _onKeyUp(e) {
            const key = e.key.toLowerCase();
            if (this.laneKeys.includes(key)) {
                this.keys[key] = false;
            }
        },

        _checkHit(laneIndex) {
            // Find the lowest note in this lane that hasn't been hit yet
            let targetNote = null;
            let targetIdx = -1;
            
            for (let i = 0; i < this.notes.length; i++) {
                const note = this.notes[i];
                if (!note.hit && note.lane === laneIndex && note.y > this.hitLineY - 150) {
                    if (!targetNote || note.y > targetNote.y) {
                        targetNote = note;
                        targetIdx = i;
                    }
                }
            }

            if (targetNote) {
                const diff = Math.abs(targetNote.y + 10 - this.hitLineY); // 10 is half note height
                let result = '';
                let color = '';
                
                if (diff < 20) {
                    result = 'PERFECT'; color = '#ffff00';
                    this.score += 100;
                    this.combo++;
                } else if (diff < 50) {
                    result = 'GREAT'; color = '#00ff00';
                    this.score += 50;
                    this.combo++;
                } else if (diff < 100) {
                    result = 'GOOD'; color = '#00ffff';
                    this.score += 10;
                    this.combo = 0;
                } else {
                    result = 'MISS'; color = '#ff0000';
                    this.combo = 0;
                }
                
                targetNote.hit = true;
                if (this.combo > this.maxCombo) this.maxCombo = this.combo;
                
                // Add effect
                this.effects.push({ text: result, color: color, y: this.hitLineY - 50, life: 1.0 });
                if(this.combo >= 2) {
                    this.effects.push({ text: this.combo + ' COMBO', color: '#fff', y: this.hitLineY - 80, life: 1.0 });
                }
                
                // Remove note
                this.notes.splice(targetIdx, 1);
            }
        },

        _spawnNotes(time) {
            // Simple procedural generation based on time
            if (time - this.lastSpawnTime > this.spawnInterval) {
                this.lastSpawnTime = time;
                
                // Determine pattern
                const rand = Math.random();
                if (rand < 0.7) {
                    // Single note
                    const lane = Math.floor(Math.random() * 4);
                    this.notes.push({ lane, y: -20, hit: false });
                } else if (rand < 0.9) {
                    // Double note
                    let l1 = Math.floor(Math.random() * 4);
                    let l2 = (l1 + 1 + Math.floor(Math.random() * 3)) % 4;
                    this.notes.push({ lane: l1, y: -20, hit: false });
                    this.notes.push({ lane: l2, y: -20, hit: false });
                }
                // Vary interval slightly for rhythm feel
                this.spawnInterval = 300 + Math.random() * 300; 
            }
        },

        _loop(time) {
            if (!this.isPlaying) return;
            this.animationId = requestAnimationFrame(this._loop);

            if (time) this._spawnNotes(time);

            // Update Notes
            for (let i = this.notes.length - 1; i >= 0; i--) {
                const note = this.notes[i];
                note.y += this.noteSpeed;

                // Missed note
                if (note.y > this.hitLineY + 50) {
                    this.combo = 0;
                    this.effects.push({ text: 'MISS', color: '#ff0000', y: this.hitLineY, life: 1.0 });
                    this.notes.splice(i, 1);
                }
            }

            // Update Effects
            for (let i = this.effects.length - 1; i >= 0; i--) {
                this.effects[i].life -= 0.02;
                this.effects[i].y -= 1;
                if (this.effects[i].life <= 0) {
                    this.effects.splice(i, 1);
                }
            }

            this._draw();
        },

        _draw() {
            this.ctx.fillStyle = '#0a0a14';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const laneWidth = 80;
            const startX = (this.canvas.width - (laneWidth * 4)) / 2;

            // Draw lanes
            this.ctx.strokeStyle = '#222';
            this.ctx.lineWidth = 2;
            for (let i = 0; i <= 4; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(startX + i * laneWidth, 0);
                this.ctx.lineTo(startX + i * laneWidth, this.canvas.height);
                this.ctx.stroke();
            }

            // Draw Hit Line
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.fillStyle = '#00ffff';
            this.ctx.fillRect(startX, this.hitLineY - 2, laneWidth * 4, 4);
            this.ctx.shadowBlur = 0;

            // Draw Key Presses
            const colors = ['#ff0055', '#00ffcc', '#00ffcc', '#ff0055'];
            for (let i = 0; i < 4; i++) {
                if (this.keys[this.laneKeys[i]]) {
                    const gradient = this.ctx.createLinearGradient(0, this.hitLineY, 0, this.canvas.height);
                    gradient.addColorStop(0, colors[i] + 'aa');
                    gradient.addColorStop(1, 'transparent');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(startX + i * laneWidth + 2, this.hitLineY, laneWidth - 4, this.canvas.height - this.hitLineY);
                    
                    // Pressed button effect
                    this.ctx.fillStyle = colors[i];
                    this.ctx.fillRect(startX + i * laneWidth + 2, this.hitLineY - 5, laneWidth - 4, 10);
                }
            }

            // Draw Notes
            for (const note of this.notes) {
                this.ctx.fillStyle = colors[note.lane];
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = colors[note.lane];
                // Note shape
                this.ctx.fillRect(startX + note.lane * laneWidth + 10, note.y, laneWidth - 20, 20);
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(startX + note.lane * laneWidth + 25, note.y + 5, laneWidth - 50, 10);
                this.ctx.shadowBlur = 0;
            }

            // Draw UI (Score & Combo)
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`SCORE: ${this.score}`, 20, 40);
            
            // Draw Key Labels
            this.ctx.font = 'bold 20px sans-serif';
            this.ctx.textAlign = 'center';
            for (let i = 0; i < 4; i++) {
                this.ctx.fillStyle = this.keys[this.laneKeys[i]] ? '#fff' : '#666';
                this.ctx.fillText(this.laneKeys[i].toUpperCase(), startX + i * laneWidth + laneWidth/2, this.hitLineY + 40);
            }

            // Draw Effects
            for (const eff of this.effects) {
                this.ctx.fillStyle = eff.color;
                this.ctx.globalAlpha = eff.life;
                this.ctx.font = eff.text.includes('COMBO') ? 'italic bold 36px sans-serif' : 'bold 40px sans-serif';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = eff.color;
                this.ctx.fillText(eff.text, this.canvas.width / 2, eff.y);
                this.ctx.shadowBlur = 0;
                this.ctx.globalAlpha = 1.0;
            }
        },

        _endGame() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);

            const ui = document.createElement('div');
            ui.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:30;';
            
            ui.innerHTML = `
                <h1 style="color:#00ffff;font-size:5rem;margin-bottom:10px;text-shadow:0 0 20px #00ffff;">STAGE CLEAR</h1>
                <h2 style="color:#fff;font-size:3rem;margin-bottom:10px;">SCORE: ${this.score}</h2>
                <h3 style="color:#00ffcc;font-size:2rem;margin-bottom:50px;">MAX COMBO: ${this.maxCombo}</h3>
            `;

            const closeBtn = document.createElement('button');
            closeBtn.innerText = 'FINISH';
            closeBtn.style.cssText = 'padding:15px 50px;background:#00ffff;color:#000;border:none;border-radius:30px;font-size:1.5rem;font-weight:bold;cursor:pointer;box-shadow:0 0 20px rgba(0,255,255,0.6);';
            closeBtn.onclick = () => this.close();
            ui.appendChild(closeBtn);

            this.container.appendChild(ui);
        },

        close() {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
            }

            window.removeEventListener('keydown', this._onKeyDown);
            window.removeEventListener('keyup', this._onKeyUp);
            
            if (this.overlay) this.overlay.remove();
        }
    }
};
