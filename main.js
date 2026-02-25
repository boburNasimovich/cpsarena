        // =====================
        // FIREBASE CONFIG
        // Replace with your own config
        // =====================
        const firebaseConfig = {
            apiKey: "AIzaSyCJCC9l84h1vxbluC8F6zWVY5Vjkyi3aY0",
            authDomain: "cpsarena.firebaseapp.com",
            databaseURL: "https://cpsarena-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "cpsarena",
            storageBucket: "cpsarena.firebasestorage.app",
            messagingSenderId: "1084317735432",
            appId: "1:1084317735432:web:c5230bfdbae6022213cfbd",
            measurementId: "G-N3SJV0CDVS"
        };

        firebase.initializeApp(firebaseConfig);
        // Load saved nickname
        const nicknameInput = document.getElementById("nickname");

        let savedName = localStorage.getItem("nickname");
        if (savedName) {
            nicknameInput.value = savedName;
        }

        // Save nickname when changed
        nicknameInput.addEventListener("input", function () {
            localStorage.setItem("nickname", nicknameInput.value);
        });
        const database = firebase.database();

        // =====================
        // GAME LOGIC
        // =====================
        let time = 10;
        let score = 0;
        let active = false;
        let interval;

        const timerText = document.getElementById("timer");
        const scoreText = document.getElementById("score");
        const btn = document.getElementById("tapBtn");

        btn.onclick = function () {
            if (!active) {
                startGame();
            }
            if (active) {
                score++;
                scoreText.innerText = "Score: " + score;
            }
        }

        function startGame() {
            active = true;
            score = 0;
            time = 10;
            scoreText.innerText = "Score: 0";
            timerText.innerText = "Time: 10";

            interval = setInterval(() => {
                time--;
                timerText.innerText = "Time: " + time;

                if (time <= 0) {
                    clearInterval(interval);
                    active = false;
                    saveScore();
                    alert("Game Over! Your Score: " + score);
                    const cpsText = document.getElementById("cps");
                    cpsText.innerText = "CPS: " + (score / 10).toFixed(2);
                }
            }, 1000);
        }

        // =====================
        // SAVE SCORE
        // =====================
        function saveScore() {
            const name = localStorage.getItem("nickname") || "Anonymous";
            database.ref("scores").push({
                name: name,
                score: score,
                timestamp: Date.now()
            });
        }

        // =====================
        // LOAD LEADERBOARD
        // =====================
        database.ref("scores")
            .orderByChild("score")
            .limitToLast(10)
            .on("value", snapshot => {
                const list = document.getElementById("topList");
                list.innerHTML = "";
                let data = [];
                snapshot.forEach(child => {
                    data.push(child.val());
                });
                data.reverse();
                data.forEach((item, index) => {
                    let medal = "";
                    if (index === 0) medal = "🥇";
                    if (index === 1) medal = "🥈";
                    if (index === 2) medal = "🥉";

                    list.innerHTML += `
    <li>
      <span class="player-name">${medal} ${item.name}</span>
      <span class="player-score">${item.score}</span>
    </li>
  `;
                });
            });