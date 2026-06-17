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
                    speed: 6 + (this.score / 500)
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
        speed: 800,
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
            this.speed = 800;
            
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
            this.speed=800;
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

                const moveSpeed = 400.0;
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
    }
};
