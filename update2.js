const fs = require('fs');
let content = fs.readFileSync('script.js', 'utf8');

const replacements = [
    { target: 'name: "턴제 전략 (Turn-based Strategy) 🎯"', img: 'images/턴제 전략.jpg' },
    { target: 'name: "배틀로얄 (Battle Royale) 🎪"', img: 'images/배틀로얄.jpg' },
    { target: 'name: "오토 배틀러 (Auto Battler) ♟️"', img: 'images/오토.jpg' },
    { target: 'name: "어드벤처 (Adventure) 🔍"', img: 'images/어드벤처.jpg' },
    { target: 'name: "비주얼 노벨 (Visual Novel) 📖"', img: 'images/두근두근.jpg' },
    { target: 'name: "메트로이드배니아 (Metroidvania) 🦇"', img: 'images/오리.jpg' },
    { target: 'name: "워킹 시뮬레이터 & FMV 🚶‍♂️"', img: 'images/로드.jpg' },
    { target: 'name: "시뮬레이션 (Simulation) 🏙️"', img: 'images/심즈.jpg' },
    { target: 'name: "스포츠 (Sports) ⚽"', img: 'images/스포츠.jpg' },
    { target: 'name: "레이싱 (Racing) 🏎️"', img: 'images/레이싱.jpg' },
    { target: 'name: "몰입형 시뮬레이션 (Immersive Sim) 🕵️‍♂️"', img: 'images/몰입.jpg' },
    { target: 'name: "파이팅 (Fighting) 👊"', img: 'images/철권.jpg' },
    { target: 'name: "플랫포머 (Platformer) 🏃‍♂️"', img: 'images/마리오.png' },
    { target: 'name: "퍼즐 (Puzzle) 🧩"', img: 'images/퍼즐.jpg' },
    { target: 'name: "공포 (Horror) 👻"', img: 'images/공포.jpg' },
    { target: 'name: "리듬 (Rhythm) 🎵"', img: 'images/리듬.jpg' },
    { target: 'name: "소울라이크 (Soulslike) 🗡️"', img: 'images/소울라이크.jpg' },
    { target: 'name: "탄막 슈팅 (Bullet Hell) 💥"', img: 'images/탄막슈팅.jpg' },
    { target: 'name: "샌드박스 (Sandbox) 🏝️"', img: 'images/마크.jpg' },
    { target: 'name: "로그라이크 (Roguelike) 🎲"', img: 'images/로그라이크.jpg' },
    { target: 'name: "하이브리드 (Hybrid) 장르 🔄"', img: 'images/결합.jpg' },
    { target: 'name: "MMORPG 🌍"', img: 'images/메이플.png' }
];

for (const {target, img} of replacements) {
    const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(' + escapedTarget + '",\\s*image: ")[^"]*(")', 'g');
    content = content.replace(regex, (match, p1, p2) => p1 + img + p2);
}

fs.writeFileSync('script.js', content, 'utf8');
