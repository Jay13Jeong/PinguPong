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

    /* SECTION - 게임 매치 */

    /**
     * requestMatchMake / matchMakeSuccess
     * 게임 요청 받기
     * data: {
     *  difficulty: number, // easy: 0, normal: 1, hard: 2
     *  player: string      // 게임 요청한 플레이어 id
     * }
     */
    socket.on("requestMatchMake", (data) => {
        // 1. 같은 난이도를 요청한 플레이어가 큐에 있을 경우 게임 매치
        socket.emit("matchMakeSuccess", {p1: "매치된 플레이어 1", p2: "매치된 플레이어 2"});
        // 2. 같은 난이도를 요청한 플레이어가 큐에 없을 경우 해당 플레이어를 큐에 넣는다.
    })

    /* !SECTION - 게임 매치 */

    /* SECTION - 게임 플레이 */

    /**
     * requestStart/startGame
     * 게임 준비 확인
     */

    socket.on("requestStart", (data) => {
        socket.emit("startGame");
        gameStart();    //  게임 실행 함수 호출
    })

    /**
     * 게임 실행 함수들
     * - gameStart : 일정 시간마다 게임 동작 함수를 실행하는 함수
     * - gameRun : 게임 동작 함수. 공 움직이고, 공 움직임 보내주고, 종료 여부 확인하는 함수
     * - ballMove : 공의 방향 변화시키는 함수 (튕김, 점수 확인)
     */

    /* 게임에 필요한 상수들 */
    const sizes = {
        canvasWidth: 800,
        canvasHeight: 500,
        lineWidth: 12,
        paddleSize: 100
    };
    
    let counter; // clearInterval을 위해서 저장해둠. setInterval의 반환값
    const goal = 100;   // 게임 종료 조건. 한명이라도 goal과 동일한 점수를 따면 게임이 종료된다.
    const speed = 1;    // 공의 속도. 난이도에 따라서 변경해줘야 할 것 같음. (1, 1.5, 2) ?

    /** 
     * 게임마다 저장하고 있어야 할 변수들. 
     * (필요에 따라서 추가 가능 (삭제는 안됨)) 
     * counter와 함께 게임별로 관리해야 할 것 같습니다...
     */
    let game = {
        player1: sizes.canvasHeight / 2,    // p1의 y좌표
        player2: sizes.canvasHeight / 2,    // p2의 y좌표
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

    /* 일정 시간마다 게임 동작 함수 실행 */
    function gameStart () {
        counter = setInterval(gameRun, 1000 * 0.02);
    }

    /* 게임 동작 함수 */
    function gameRun() {
        // 1. 공 움직이고 (방향전환, 점수 검사)
        ballMove();
        // 2. 바뀐 게임 정보들 보내준다. (플레이어와 관전자 모두에게 보내주기)
        socket.emit("ballPos", game);
        // 3. 공 움직이기 (위치 변화)
        game.ball.y += game.ball.dy * speed;
        game.ball.x += game.ball.dx * speed;
        // 4. 게임 종료 여부도 확인해서 보내주기
        if (goal === game.score.player1 || goal === game.score.player2) {
            // 이긴 사람만 winner에 넣어서 보내줍니다.
            socket.emit("endGame", {winner: goal === game.score.player1 ? game.score.player1 : game.score.player2});
            // TODO - 🌟 전적 정보를 저장해야 한다면 여기서 저장하기 🌟
            clearInterval(counter); // 반복 종료
        }
    }

    /* 공 움직이는 함수 - 반사, 점수 획득 */
    function ballMove() {
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

    /**
     * player1Move - p1이 움직임
     * offset : 움직인 거리
     * 범위를 벗어나지 않는 경우에만 game 변수의 값을 업데이트합니다.
     */
    socket.on("player1Move", (offset) => {
        const newPos = game.player1 + offset;
        if (newPos >= 0 && newPos <= sizes.canvasHeight - sizes.paddleSize)
            game.player1 = newPos;
    })

    /**
     * player1Move - p2가 움직임
     * offset : 움직인 거리
     * 범위를 벗어나지 않는 경우에만 game 변수의 값을 업데이트합니다.
     */
    socket.on("player2Move", (offset) => {
        const newPos = game.player2 + offset;
        if (newPos >= 0 && newPos <= sizes.canvasHeight - sizes.paddleSize)
            game.player2 = newPos;
    })

    /**
     * TODO - p1/p2 중 하나라도 연결이 끊겼을 때 게임을 종료시켜야 합니다.
     * 따로 이벤트로 구분해주셔도 되고, endGame으로 한번에 처리해주셔도 됩니다.
     */

    /* !SECTION - 게임 플레이 */

    /* SECTION - 게임 관전 */
    
    /**
     * TODO - 참여할 수 있는 게임의 목록을 보내야 합니다.
     * - (필요한 정보: (필수)player1 ID, (필수)player2 ID, score?, 난이도?)
     */

    /**
     * TODO - 현재 진행중인 게임에 접속할 수 있어야 합니다.
     */

    /* !SECTION - 게임 관전 */

    /* SECTION - 게임 도전장 */

    /**
     * TODO - 방법 논의 필요....
     */

    /* !SECTION - 게임 도전장 */
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});