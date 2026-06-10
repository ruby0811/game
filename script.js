const genresData = [
    {
        title: "슈팅 게임 (Shooter)",
        icon: "🔫",
        image: "images/shooter_game_scene_1780276437263.png",
        core: "총기를 사용한 전투 중심, 플레이어의 순발력과 정확한 조준이 중요한 장르",
        subGenres: [
            {
                name: "FPS (First Person Shooter) - 1인칭 슈팅 🔫",
                image: "images/fps_highres_custom_1780881278743.png",
                def: "플레이어가 게임 속 캐릭터의 시점으로 게임을 진행하며 주로 총기류를 사용하여 적을 제거하는 장르입니다. 몰입감이 뛰어나며 순발력과 정확한 에임이 요구됩니다.",
                features: ["1인칭 시점에서 게임 진행", "주로 총기를 활용한 전투 중심", "정확한 에임과 빠른 반응 속도 필요", "협동 및 경쟁 기반 플레이"],
                examples: "카운터 스트라이크, 콜 오브 듀티, 오버워치, 발로란트, 배틀필드"
            },
            {
                name: "TPS (Third Person Shooter) - 3인칭 슈팅 👁️",
                image: "images/tps_highres_custom_1780881483501.png",
                def: "캐릭터의 뒤나 어깨 너머에서 바라보는 시점으로 진행됩니다. 전체적인 모습을 볼 수 있어 넓은 시야와 다양한 액션 활용이 가능합니다.",
                features: ["3인칭 시점으로 캐릭터 확인 가능", "넓은 시야로 주변 환경 관찰 유리", "커버 시스템/회피 액션 등 동작 구현", "캐릭터 커스터마이징 중요"],
                examples: "포트나이트, GTA 시리즈, 툼레이더, 기어스 오브 워, 언차티드"
            },
            {
                name: "루트 슈터 (Looter Shooter) 🎒",
                image: "images/looter_shooter_highres_custom_1780881608750.png",
                def: "슈팅 게임에 RPG의 아이템 파밍(루팅) 요소를 결합한 장르입니다.",
                features: ["반복적인 아이템 파밍", "캐릭터 스킬 트리 성장", "강력한 보스와 레이드"],
                examples: "데스티니 가디언즈, 보더랜드, 퍼스트 디센던트"
            },
            {
                name: "익스트랙션 슈터 (Extraction Shooter) 🚁",
                image: "images/extraction_shooter_highres_custom_1780881749297.png",
                def: "전장에 진입해 귀중한 아이템을 파밍하고 무사히 탈출해야 하는 하드코어 장르입니다.",
                features: ["탈출 실패 시 모든 아이템 상실", "극도의 긴장감", "PvPvE (유저+AI 복합 전투)"],
                examples: "이스케이프 프롬 타르코프, 다크 앤 다커"
            }
        ]
    },
    {
        title: "롤플레잉 및 오픈 월드",
        icon: "🧙‍♂️",
        image: "images/rpg_game_scene_1780276473071.png",
        core: "가상 세계에서 역할을 수행하며 캐릭터를 성장시키고 넓은 세계를 자유롭게 탐험하는 장르",
        subGenres: [
            {
                name: "RPG (Role Playing Game) - 롤플레잉 🧙‍♂️",
                image: "images/rpg_custom.jpg",
                def: "가상 세계 속 캐릭터의 역할을 맡아 모험을 즐기는 장르. 캐릭터 성장과 스토리 진행이 중심입니다. (JRPG, WRPG, ARPG 등 하위 장르 존재)",
                features: ["캐릭터 성장과 레벨업 시스템", "풍부한 스토리와 세계관", "다양한 퀘스트와 미션", "스킬 트리와 능력치 배분", "장비 수집/강화"],
                examples: "파이널 판타지(JRPG), 위처/스카이림(WRPG), 디아블로/다크소울(ARPG)"
            },
            {
                name: "MMORPG 🌍",
                image: "images/메이플.png",
                def: "수많은 플레이어가 동시에 접속하여 하나의 가상 세계에서 상호작용하는 대규모 온라인 롤플레잉 게임입니다.",
                features: ["대규모 다중 접속 서버", "지속적으로 업데이트되는 온라인 세계", "길드와 사회적 상호작용", "협동(레이드/던전) 및 경쟁(PvP)"],
                examples: "월드 오브 워크래프트, 파이널 판타지 14, 로스트아크, 메이플스토리"
            },
            {
                name: "오픈 월드 (Open World) 🗺️",
                image: "images/open_world_highres_custom_1780881766756.png",
                def: "플레이어가 광활한 게임 세계를 자유롭게 탐험하고 상호작용할 수 있는 장르입니다. 선형적 진행보다 자유도에 중점을 둡니다.",
                features: ["자유로운 탐험이 가능한 넓은 맵", "비선형적 스토리 진행", "다양한 사이드 콘텐츠", "높은 환경 상호작용"],
                examples: "젤다의 전설: 브레스 오브 더 와일드, 레드 데드 리뎀션 2, GTA 5, 엘든 링"
            },
            {
                name: "TRPG / CRPG 🎲",
                image: "images/trpg_custom.png",
                def: "초창기 탁상형 롤플레잉(TRPG)의 주사위 굴림과 룰을 컴퓨터로 옮겨온 깊이 있는 장르입니다.",
                features: ["자유도 높은 대화 선택지", "방대한 텍스트와 스토리 분기", "전략적인 턴제 전투 기반"],
                examples: "발더스 게이트 3, 디비니티: 오리지널 신 2, 던전 앤 드래곤"
            }
        ]
    },
    {
        title: "전략 및 생존",
        icon: "⚔️",
        image: "images/strategy_game_scene_1780276488358.png",
        core: "자원 관리와 전략적 판단, 실시간 멀티태스킹 또는 턴제 전술로 승리하거나 끝까지 생존하는 장르",
        subGenres: [
            {
                name: "RTS (Real-Time Strategy) - 실시간 전략 ⚔️",
                image: "images/RTS.jpg",
                def: "턴제가 아닌 실시간으로 진행되며, 자원 수집, 기지 건설, 병력 운용을 모두 실시간으로 관리합니다.",
                features: ["실시간 자원/기지 관리", "유닛 생산과 군대 지휘", "빠른 마우스 컨트롤(APM)과 멀티태스킹", "테크 트리 발전"],
                examples: "스타크래프트, 워크래프트, 에이지 오브 엠파이어"
            },
            {
                name: "턴제 전략 (Turn-based Strategy) 🎯",
                image: "images/턴제 전략.jpg",
                def: "차례대로 행동을 취하는 전략 게임으로, 시간 제한 없이 신중한 전술적 판단과 깊이 있는 구상이 특징입니다.",
                features: ["차례를 번갈아 가며 진행", "충분한 전략 구상 시간", "확률과 전술적 위치 선정", "외교/경제 등 다양한 승리 조건"],
                examples: "문명 시리즈, XCOM, 파이어 엠블렘, 토탈 워"
            },
            {
                name: "MOBA 🏆",
                image: "images/moba.jpg",
                def: "두 팀이 고유 능력을 가진 챔피언을 선택해 상대 본진을 파괴하는 팀 기반 전략 장르(AOS)입니다.",
                features: ["5v5 등 팀 기반 대전", "다양한 챔피언 라인업", "라인과 미니언, 성장 시스템", "팀워크 및 오브젝트 장악 필수"],
                examples: "리그 오브 레전드, 도타 2, 히어로즈 오브 더 스톰"
            },
            {
                name: "배틀로얄 (Battle Royale) 🎪",
                image: "images/배틀로얄.jpg",
                def: "다수의 플레이어가 좁아지는 맵에서 아이템을 파밍하며 마지막 생존자가 될 때까지 싸우는 장르입니다.",
                features: ["대규모 대전 및 생존", "장비 수집(파밍)", "시간에 따라 축소되는 안전 구역", "높은 긴장감과 전략적 판단"],
                examples: "배틀그라운드(PUBG), 포트나이트, 에이펙스 레전드"
            },
            {
                name: "4X 및 대전략 (Grand Strategy) 👑",
                image: "images/4X.jpg",
                def: "탐험, 확장, 개척, 섬멸을 테마로 제국이나 국가를 운영하는 거시적 전략 장르입니다.",
                features: ["거대한 스케일의 지도", "외교, 무역, 정치, 종교 시스템", "극도로 긴 플레이 타임"],
                examples: "문명 시리즈, 스텔라리스, 크루세이더 킹즈"
            },
            {
                name: "오토 배틀러 (Auto Battler) ♟️",
                image: "images/오토.jpg",
                def: "무작위로 뜨는 유닛을 구매해 배치하면, 유닛들이 시너지를 발휘하며 자동으로 전투하는 장르입니다.",
                features: ["자동 전투 시스템", "유닛 종족/직업 시너지 맞추기", "운과 전략의 밸런스"],
                examples: "전략적 팀 전투(롤토체스), 도타 언더로드"
            }
        ]
    },
    {
        title: "어드벤처 및 서사",
        icon: "🔍",
        image: "images/adventure_game_scene_1780276502969.png",
        core: "스토리텔링, 퍼즐, 탐험, 캐릭터 간의 대화를 중심으로 전개되는 서사 중심의 장르",
        subGenres: [
            {
                name: "어드벤처 (Adventure) 🔍",
                image: "images/어드벤처.jpg",
                def: "스토리텔링과 퍼즐 풀이에 중점을 두며, 탐험과 수수께끼 해결이 핵심입니다. 액션보다는 서사에 집중합니다.",
                features: ["스토리 중심 플레이", "퍼즐과 수수께끼", "캐릭터 간 대화와 선택지", "환경 탐험 중요"],
                examples: "워킹 데드, 라이프 이즈 스트레인지, 디트로이트: 비컴 휴먼"
            },
            {
                name: "액션 어드벤처 (Action Adventure) 🏃‍♂️",
                image: "images/action_adventure_highres_custom_1780881783410.png",
                def: "액션과 어드벤처 요소를 결합해 전투, 탐험, 퍼즐을 고루 제공하는 현대 최고 인기 장르입니다.",
                features: ["스토리와 전투의 조화", "환경 탐험과 퍼즐", "캐릭터 성장", "다양한 무기와 도구 활용"],
                examples: "젤다의 전설 시리즈, 언차티드, 라스트 오브 어스, 어쌔신 크리드"
            },
            {
                name: "비주얼 노벨 (Visual Novel) 📖",
                image: "images/두근두근.jpg",
                def: "텍스트 중심 스토리에 이미지/음악을 결합하여, 선택지에 따라 스토리가 분기하는 인터랙티브 소설 형태의 게임입니다.",
                features: ["텍스트 기반 스토리텔링", "일러스트 중심 연출", "선택지에 따른 스토리 분기/다중 엔딩", "캐릭터 관계 발전"],
                examples: "역전재판(에이스 어토니), 슈타인즈 게이트, 두근두근 문예부"
            },
            {
                name: "메트로이드배니아 (Metroidvania) 🦇",
                image: "images/오리.jpg",
                def: "거미줄처럼 얽힌 맵을 탐험하며, 새로운 능력을 얻어야 갈 수 없던 구역이 해금되는 구조의 탐험형 액션 어드벤처입니다.",
                features: ["비선형적 맵 탐험", "능력 획득을 통한 점진적 해금", "숨겨진 요소 찾기"],
                examples: "할로우 나이트, 오리와 눈먼 숲, 메트로이드 드레드"
            },
            {
                name: "워킹 시뮬레이터 & FMV 🚶‍♂️",
                image: "images/워크.jpg",
                def: "전투 없이 맵을 걷거나(워킹 시뮬), 실제 배우가 연기한 실사 영상(FMV)을 보며 스토리에만 몰입하는 예술적 장르입니다.",
                features: ["극도로 제한된 액션", "스토리와 연출 중심", "선택지에 따른 결과 변동"],
                examples: "에디스 핀치의 유산, 파이어워치, 허 스토리(Her Story)"
            }
        ]
    },
    {
        title: "현실 모사 및 스포츠",
        icon: "⚽",
        image: "images/sim_sports_scene_1780276524946.png",
        core: "현실 세계의 물리적 법칙, 생활, 경영, 스포츠 등을 게임 내에 정밀하게 시뮬레이션하는 장르",
        subGenres: [
            {
                name: "시뮬레이션 (Simulation) 🏙️",
                image: "images/심즈.jpg",
                def: "현실의 활동이나 시스템을 구현합니다. 생활, 건설, 경영, 비행 등 다양한 분야가 있습니다.",
                features: ["현실적 물리/시스템 구현", "장기적인 발전과 자원 최적화", "높은 자유도와 샌드박스적 관리"],
                examples: "심즈(생활), 심시티/플래닛 코스터(건설/경영), 스타듀 밸리(농업), 마이크로소프트 플라이트 시뮬레이터(비행)"
            },
            {
                name: "스포츠 (Sports) ⚽",
                image: "images/스포츠.jpg",
                def: "축구, 농구, 야구 등 실제 스포츠를 디지털로 구현하여 실제 팀과 선수를 기반으로 즐기는 장르입니다.",
                features: ["실제 룰과 물리 반영", "선수 능력치 및 전술", "커리어/시즌 모드", "매년 업데이트되는 시리즈 모델"],
                examples: "FIFA(FC), NBA 2K, MLB 더 쇼, 매든 NFL"
            },
            {
                name: "레이싱 (Racing) 🏎️",
                image: "images/레이싱.jpg",
                def: "다양한 차량을 운전해 경주를 즐깁니다. 가벼운 아케이드부터 정밀한 시뮬레이션까지 다양합니다.",
                features: ["차량 운전 및 경주", "커스터마이징 및 업그레이드", "물리 엔진과 주행 메커니즘", "아케이드, 카트, 시뮬레이션 등 세분화"],
                examples: "마리오 카트, 니드 포 스피드, 그란 투리스모, 포르자 호라이즌"
            },
            {
                name: "몰입형 시뮬레이션 (Immersive Sim) 🕵️‍♂️",
                image: "images/몰입.jpg",
                def: "시스템이 사실적으로 짜여 있어, 플레이어가 창의적이고 다양한 방법으로 문제를 해결할 수 있는 자유도 높은 장르입니다.",
                features: ["정답이 없는 문제 해결", "환경과의 상호작용 (해킹, 은신, 파괴 등)", "플레이어 선택의 존중"],
                examples: "디스아너드, 데이어스 엑스, 프레이(Prey)"
            }
        ]
    },
    {
        title: "조작 및 퍼즐, 기타",
        icon: "🧩",
        image: "images/platformer_game_scene_1780276538535.png",
        core: "정교한 조작(플랫포머, 격투, 리듬)이나 두뇌 플레이(퍼즐), 심리적 자극(공포)을 위주로 하는 장르들",
        subGenres: [
            {
                name: "파이팅 (Fighting) 👊",
                image: "images/철권.jpg",
                def: "두 캐릭터가 고유 기술과 콤보를 활용해 1:1 대결을 벌이는 격투 게임입니다.",
                features: ["콤보와 기술 연계", "타이밍과 카운터 중요", "토너먼트/랭킹 중심"],
                examples: "철권, 스트리트 파이터, 대난투(슈퍼 스매시 브라더스)"
            },
            {
                name: "플랫포머 (Platformer) 🏃‍♂️",
                image: "images/마리오.png",
                def: "발판(플랫폼)을 이용해 점프하고 장애물을 피하며 진행하는 고전적이고 인기 있는 장르입니다.",
                features: ["점프 및 이동 컨트롤", "장애물 회피", "퍼즐/수집 요소 결합"],
                examples: "슈퍼 마리오, 소닉, 할로우 나이트, 셀레스테"
            },
            {
                name: "퍼즐 (Puzzle) 🧩",
                image: "images/퍼즐.jpg",
                def: "논리적 사고와 문제 해결 능력을 요구하며, 캐주얼부터 하드코어까지 넓은 유저층을 가집니다.",
                features: ["문제 해결 중심", "점진적인 난이도 상승", "간단한 규칙 속 깊은 복잡성"],
                examples: "테트리스, 캔디크러쉬, 포탈, 더 위트니스"
            },
            {
                name: "공포 (Horror) 👻",
                image: "images/공포.jpg",
                def: "두려움과 긴장감을 제공하는 데 목적을 둔 장르로 생존 호러와 심리 호러로 나뉩니다.",
                features: ["제한된 자원과 은신", "어두운 환경, 점프 스케어", "심리적 긴장감 유도"],
                examples: "바이오하자드(레지던트 이블), 사일런트 힐, 아웃라스트"
            },
            {
                name: "리듬 (Rhythm) 🎵",
                image: "images/리듬.jpg",
                def: "음악의 비트에 맞춰 정확한 타이밍에 버튼을 누르거나 동작을 취하는 장르입니다.",
                features: ["음악 비트 동기화", "정확한 반응 속도", "점수 및 콤보 시스템"],
                examples: "비트 세이버, DJ맥스, 오스(osu!), 태고의 달인"
            },
            {
                name: "소울라이크 (Soulslike) 🗡️",
                image: "images/소울라이크.jpg",
                def: "어두운 분위기, 극악의 난이도, 불친절한 시스템 속에서 죽어가며 적의 패턴을 외워 극복하는 쾌감을 중시하는 하드코어 액션 장르입니다.",
                features: ["매우 높은 난이도", "스태미나 관리와 회피 중시", "사망 시 자원(소울) 페널티"],
                examples: "다크 소울, 엘든 링, P의 거짓, 블러드본"
            },
            {
                name: "탄막 슈팅 (Bullet Hell) 💥",
                image: "images/탄막슈팅.jpg",
                def: "화면을 빽빽하게 채울 정도로 수천 개의 적 총알이 쏟아지는 극악 난이도의 비행 슈팅 장르입니다.",
                features: ["극단적인 총알 회피", "아주 작은 피격 판정", "패턴 암기와 피지컬 요구"],
                examples: "동방 프로젝트, 텐가이, 엔터 더 건전(일부)"
            }
        ]
    },
    {
        title: "고유 시스템 장르",
        icon: "🎲",
        core: "높은 자유도와 창작(샌드박스), 무작위성과 영구적 죽음(로그라이크) 등 독특한 시스템을 기반으로 한 장르",
        subGenres: [
            {
                name: "샌드박스 (Sandbox) 🏝️",
                image: "images/마크.jpg",
                def: "정해진 목표 없이 높은 자유도를 바탕으로 가상 세계에서 원하는 대로 건설하고 탐험하는 장르입니다.",
                features: ["높은 자유도와 창의적 제작", "비선형적 플레이", "모드(Mod) 친화적 환경"],
                examples: "마인크래프트, 테라리아, 팩토리오, 게리스 모드"
            },
            {
                name: "로그라이크 (Roguelike) 🎲",
                image: "images/로드.jpg",
                def: "랜덤 생성 맵, 영구적 죽음(퍼머데스)을 특징으로 하며, 매 판 새로운 플레이 경험을 제공합니다.",
                features: ["랜덤 생성 레벨/아이템", "죽으면 처음부터(퍼머데스)", "높은 재도전 가치와 해금 요소"],
                examples: "하데스, 스펠렁키, 바인딩 오브 아이작, 데드 셀"
            }
        ]
    },
    {
        title: "하이브리드 및 트렌드",
        icon: "🚀",
        core: "기존 장르들의 융합을 통한 새로운 경험과 기술 발전(VR/AR/AI)이 이끄는 게임의 미래",
        subGenres: [
            {
                name: "하이브리드 (Hybrid) 장르 🔄",
                image: "images/결합.jpg",
                def: "현대 게임은 여러 장르를 결합하여 기존의 한계를 넘는 창의적인 플레이를 제공합니다.",
                features: ["다양한 장르 장점 결합", "새로운 메커니즘 창출", "폭넓은 유저층 만족"],
                examples: "디스아너드(FPS+스텔스), 데스 스트랜딩(오픈월드+시뮬), 컨트롤(TPS+메트로이드배니아)"
            },
            {
                name: "게임 장르의 미래 트렌드 🚀",
                image: "images/vr.jpg",
                def: "기술 발전으로 장르 경계가 모호해지며, 몰입형 기술 및 AI 적용으로 새로운 형태의 게임이 등장 중입니다.",
                features: ["VR/AR 기반 몰입 강화", "AI를 활용한 적응형 플레이", "클라우드 및 스트리밍 확산", "크로스 플랫폼 통합"],
                examples: "메타버스 플랫폼, AI 절차적 생성 게임, VR 전용 타이틀 등"
            }
        ]
    }
];

function createGenreCard(genre, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`;
    card.style.opacity = '0'; // For animation
    card.style.cursor = 'pointer';

    const imageHtml = genre.image ? `<div class="card-image" style="background-image: url('${genre.image}')"></div>` : `<div class="card-image placeholder-image"></div>`;

    card.innerHTML = `
        ${imageHtml}
        <div class="card-content">
            <div class="card-header">
                <div class="card-icon">${genre.icon}</div>
                <h3>${genre.title}</h3>
            </div>
            <p class="core-concept" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">${genre.core}</p>
            <div style="margin-top: 20px; font-size: 0.95rem; color: var(--accent-primary); font-weight: 600; text-align: right;">세부 장르 보기 &rarr;</div>
        </div>
    `;

    card.addEventListener('click', () => {
        openGenreModal(genre);
    });

    return card;
}

function openGenreModal(genre) {
    const modal = document.getElementById('genre-modal');
    const modalBody = document.getElementById('modal-body');

    let sidebarHtml = '<ul>';
    genre.subGenres.forEach((sub, index) => {
        // Use a cleaner name for sidebar if possible, or just the full name
        let shortName = sub.name;
        if (shortName.includes(' - ')) {
            shortName = shortName.split(' - ')[0] + ' ' + (shortName.match(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g) || '');
        }
        sidebarHtml += `<li class="sub-tab" data-index="${index}">${sub.name}</li>`;
    });
    sidebarHtml += '</ul>';

    modalBody.innerHTML = `
        <div class="modal-header" style="margin-bottom: 0; padding-bottom: 15px; border-bottom: none;">
            <span class="icon">${genre.icon}</span>
            <h2>${genre.title}</h2>
        </div>
        <p class="modal-core" style="padding-bottom: 20px; border-bottom: 1px solid var(--card-border);">${genre.core}</p>
        <div class="modal-layout">
            <div class="modal-sidebar">
                ${sidebarHtml}
            </div>
            <div class="modal-content-pane" id="modal-content-pane">
                <!-- Details injected here -->
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    const tabs = modalBody.querySelectorAll('.sub-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const idx = e.currentTarget.getAttribute('data-index');
            renderSubGenreDetails(genre.subGenres[idx], genre.image);
        });
    });

    if (tabs.length > 0) {
        tabs[0].click();
    }
}

function renderSubGenreDetails(sub, parentImage) {
    const pane = document.getElementById('modal-content-pane');

    let imageHtml = '';
    if (sub.image) {
        imageHtml = `<div class="modal-sub-image" style="background-image: url('${sub.image}')"></div>`;
    } else if (parentImage) {
        // Inherit parent image as a fallback
        imageHtml = `<div class="modal-sub-image" style="background-image: url('${parentImage}')"></div>`;
    } else {
        imageHtml = `<div class="modal-sub-image placeholder-image"></div>`;
    }

    pane.innerHTML = `
        <div class="pane-content">
            ${imageHtml}
            <h4 class="sub-name">${sub.name}</h4>
            <p class="sub-def">${sub.def}</p>
            <div class="sub-features">
                <strong>주요 특징:</strong>
                <ul>
                    ${sub.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
            <div class="sub-examples">
                <strong>대표 게임:</strong> ${sub.examples}
            </div>
        </div>
    `;
}

function init() {
    const grid = document.getElementById('genre-grid');
    grid.innerHTML = ''; // Clear existing

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    genresData.forEach((genre, index) => {
        const card = createGenreCard(genre, index);
        grid.appendChild(card);
        observer.observe(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    init();

    const hero = document.getElementById('hero-section');
    const contentWrapper = document.getElementById('content-wrapper');
    const sections = document.querySelectorAll('.content-section');
    const menuBtns = document.querySelectorAll('.menu-btn');
    const backBtn = document.getElementById('back-btn');

    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = btn.getAttribute('data-target');

            sections.forEach(sec => sec.style.display = 'none');
            document.getElementById(targetId).style.display = 'block';

            hero.classList.add('fade-out');
            setTimeout(() => {
                hero.style.display = 'none';
                contentWrapper.style.display = 'block';
                window.scrollTo(0, 0);
            }, 800);
        });
    });

    backBtn.addEventListener('click', () => {
        contentWrapper.style.display = 'none';
        hero.style.display = 'flex';

        setTimeout(() => {
            hero.classList.remove('fade-out');
        }, 50);
    });

    const modal = document.getElementById('genre-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
