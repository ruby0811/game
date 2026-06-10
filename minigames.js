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
    }
};
