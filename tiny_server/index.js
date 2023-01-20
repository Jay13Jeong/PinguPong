const express = require("express");
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    let counter;
    const goal = 100;
    const speed = 2;

    /* 게임이 시작되면 게임 시작 메시지를 보내고 게임 함수를 시작한다. */
    function gameStart () {
        counter = setInterval(gameRun, 1000 * 0.02);
    }

    const sizes = {
        canvasWidth: 800,
        canvasHeight: 500,
        lineWidth: 12,
        paddleSize: 50
    };

    let game = {
        player1: sizes.canvasHeight / 2,
        player2: sizes.canvasHeight / 2,
        ball: {
            y: sizes.canvasHeight / 2,
            x: sizes.canvasWidth / 2,
            dy: 4,
            dx: Math.random() > 0.5 ? 4 : -4
        },
        score: {
            player1: 0,
            player2: 0
        }
    }

    function gameRun() {
        // 공 움직이고 (방향전환, 점수 검사)
        ballMove();
        // 공 움직임 보내준다.
        socket.emit("ballPos", game);
        // 공 움직이기
        game.ball.y += game.ball.dy * speed;
        game.ball.x += game.ball.dx * speed;
        // 게임 종료 여부도 확인해서 보내주기
        if (goal === game.score.player1 || goal === game.score.player2) {
            socket.emit("endGame", {winner: goal === game.score.player1 ? game.score.player1 : game.score.player2});
            // 전적 정보를 저장해야 한다면 여기서 저장하기
            clearInterval(counter);
        }
    }

    function ballMove() {
        // 반사, 점수 획득 여부만 확인함.
        const p1PaddleStart = game.player1;
        const p1PaddleEnd = game.player1 + sizes.paddleSize;
        const p2PaddleStart = game.player2;
        const p2PaddleEnd = game.player2 + sizes.paddleSize;
        if (game.ball.y < 0 || game.ball.y > sizes.canvasHeight) {  // 위아래 벽에 튕김
            game.ball.dy *= -1;
        }
        if (game.ball.x > sizes.canvasWidth - sizes.lineWidth) {    // 오른쪽(p2네) 벽으로 돌진
            if (game.ball.y < p2PaddleStart || game.ball.y > p2PaddleEnd) { // 패들 너머로 간 경우
                // 초기화
                game.ball.y = sizes.canvasHeight / 2;
                game.ball.x = sizes.canvasWidth / 2;
                game.ball.dy = 4;
                game.ball.dx = Math.random() > 0.5 ? 4 : -4;
                // p1의 점수를 올린다.
                game.score.player1++;
            }
            else {  // p2의 패들에 튕김
                game.ball.dx *= -1;
            }
        }
        else if (game.ball.x < sizes.lineWidth) {   // 왼쪽(p1네) 벽으로 돌진
            if (game.ball.y < p1PaddleStart || game.ball.y > p1PaddleEnd) { // 패들 너머로 간 경우
                // 초기화
                game.ball.y = sizes.canvasHeight / 2;
                game.ball.x = sizes.canvasWidth / 2;
                game.ball.dy = 4;
                game.ball.dx = Math.random() > 0.5 ? 4 : -4;
                // p2의 점수를 올린다.
                game.score.player2++;
            }
            else {  // p1의 패들에 튕김
                game.ball.dx *= -1;
            }
        }
    }

    socket.on("player1Move", (data) => {
        game.player1 = data.player1;
    })

    socket.on("player2Move", (data) => {
        game.player2 = data.player2;
    })

    socket.on("requestStart", (data) => {
        socket.emit("startGame");
        gameStart();
    })
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});