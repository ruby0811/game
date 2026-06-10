import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'(name: "턴제 전략 \(Turn-based Strategy\) 🎯",\s*image: ")[^"]*(")', r'\g<1>images/턴제 전략.jpg\g<2>'),
    (r'(name: "배틀로얄 \(Battle Royale\) 🎪",\s*image: ")[^"]*(")', r'\g<1>images/배틀로얄.jpg\g<2>'),
    (r'(name: "오토 배틀러 \(Auto Battler\) ♟️",\s*image: ")[^"]*(")', r'\g<1>images/오토.jpg\g<2>'),
    (r'(name: "어드벤처 \(Adventure\) 🔍",\s*image: ")[^"]*(")', r'\g<1>images/어드벤처.jpg\g<2>'),
    (r'(name: "비주얼 노벨 \(Visual Novel\) 📖",\s*image: ")[^"]*(")', r'\g<1>images/두근두근.jpg\g<2>'),
    (r'(name: "메트로이드배니아 \(Metroidvania\) 🦇",\s*image: ")[^"]*(")', r'\g<1>images/오리.jpg\g<2>'),
    (r'(name: "워킹 시뮬레이터 & FMV 🚶‍♂️",\s*image: ")[^"]*(")', r'\g<1>images/로드.jpg\g<2>'),
    (r'(name: "시뮬레이션 \(Simulation\) 🏙️",\s*image: ")[^"]*(")', r'\g<1>images/심즈.jpg\g<2>'),
    (r'(name: "스포츠 \(Sports\) ⚽",\s*image: ")[^"]*(")', r'\g<1>images/스포츠.jpg\g<2>'),
    (r'(name: "레이싱 \(Racing\) 🏎️",\s*image: ")[^"]*(")', r'\g<1>images/레이싱.jpg\g<2>'),
    (r'(name: "몰입형 시뮬레이션 \(Immersive Sim\) 🕵️‍♂️",\s*image: ")[^"]*(")', r'\g<1>images/몰입.jpg\g<2>'),
    (r'(name: "파이팅 \(Fighting\) 👊",\s*image: ")[^"]*(")', r'\g<1>images/철권.jpg\g<2>'),
    (r'(name: "플랫포머 \(Platformer\) 🏃‍♂️",\s*image: ")[^"]*(")', r'\g<1>images/마리오.png\g<2>'),
    (r'(name: "퍼즐 \(Puzzle\) 🧩",\s*image: ")[^"]*(")', r'\g<1>images/퍼즐.jpg\g<2>'),
    (r'(name: "공포 \(Horror\) 👻",\s*image: ")[^"]*(")', r'\g<1>images/공포.jpg\g<2>'),
    (r'(name: "리듬 \(Rhythm\) 🎵",\s*image: ")[^"]*(")', r'\g<1>images/리듬.jpg\g<2>'),
    (r'(name: "소울라이크 \(Soulslike\) 🗡️",\s*image: ")[^"]*(")', r'\g<1>images/소울라이크.jpg\g<2>'),
    (r'(name: "탄막 슈팅 \(Bullet Hell\) 💥",\s*image: ")[^"]*(")', r'\g<1>images/탄막슈팅.jpg\g<2>'),
    (r'(name: "샌드박스 \(Sandbox\) 🏝️",\s*image: ")[^"]*(")', r'\g<1>images/마크.jpg\g<2>'),
    (r'(name: "로그라이크 \(Roguelike\) 🎲",\s*image: ")[^"]*(")', r'\g<1>images/로그라이크.jpg\g<2>'),
    (r'(name: "하이브리드 \(Hybrid\) 장르 🔄",\s*image: ")[^"]*(")', r'\g<1>images/결합.jpg\g<2>'),
    (r'(name: "MMORPG 🌍",\s*image: ")[^"]*(")', r'\g<1>images/메이플.png\g<2>')
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)
