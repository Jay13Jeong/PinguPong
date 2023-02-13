import { Socket, Server } from 'socket.io';
import { Friend } from '../friend/friend.entity';

class roomClass {//유저 아이디와 고유 키값 둘다 있어야 함, primary key는 소켓 id이다.
    //유저의 키값을 어떤것으로 할 것인가? A:소켓이 계속 유지가 된다. 리액트 페이지 라우팅 때문? 리액트 기능이 있다.
    //방장 변수
    private master:number;//소켓id

    //비밀방 여부
    private secret:boolean;
    //비번용 변수
    private secretpw:string;

    //맵 유저 id: 소켓 id//이구조가 맞는가? 왜 필요했는가? 고민 이유 소켓 연결이 끊길 경우엔 유저 id를 받을 수가 없는데...
    //맵 소켓id:유저id로 변경하자, 음소거 때문에 ,둘다 가지자...
    //최종: 프라이머리 키는 디비의 유저 Id 값이다
    private userIds : Set<number>;


    //방장에게 음소거 당한 userid Set
    private muteuser : Set<number>;

    //방장에게 밴 당한 userid Set
    private banList : Set<number>;

    public constructor(socketId:string, userId:number, secretpw:string){
        console.log('new');
        this.master = userId;
        this.userIds = new Set<number>();
        this.userIds.add(userId);

        this.secret = true;
        this.secretpw = secretpw;
        if (this.secretpw == '')
            this.secret = false;

        this.muteuser = new Set<number>();
        this.banList = new Set<number>();
    }

    public userCount():number{
        return this.userIds.size;
    }

    public getMasterStatus(userId:number): boolean{
        if (this.master == userId)
            return true;
        return false;
    }

    //방장 위임 기능 함수
    public mandateMaster(master:number, userId:number):boolean{
        if ((master == this.master)&& this.userIds.has(userId) == true){
            this.master = userId;
            return true;
        }
        return false;
    }

    //방장 나갈 때 방장 위임 기능 함수 실행
    private newMaster(){
        const newMaster = Array.from(this.userIds.keys())
        console.log('before master', this.master, newMaster, newMaster[0]);
        this.master = newMaster[0];
        console.log('after master', this.master);
    }

    //추가 유저
    public addsocketuser(socketid:string, userid:number) {
        if (!this.userIds.has(userid))
            this.userIds.add(userid);
    }

    //나간 유저
    public delsocketuser(userId:number){
        if (this.userIds.has(userId))
            this.userIds.delete(userId);
        // if (this.blockuser.has(userId))
        //     this.blockuser.delete(userId);
        // this.muteuser.delete(userId);
        if (userId == this.master)
            this.newMaster();
    }

    //비번 변경 함수
    public setSecretpw(userId:number, newsecret:string):boolean{
        if (this.master == userId){
            this.secretpw = newsecret;
            if (this.secretpw == '')
                this.secret= false;
            else
                this.secret= true;
            return true;
        }
        return false;
    }

    //음소거를 하는 함수
    public addmuteuser(userId:number, targetId:number){
        if (this.master != userId)
            return ;
        if (!this.muteuser.has(targetId)){
            this.muteuser.add(targetId);
        }
    }

    //음소거를 해제하는 함수
    public freemuteuser(userId:number, targetId:number){
        if (this.master != userId)
            return ;
        this.muteuser.delete(targetId);
    }

    //음소거 여부를 확인 후 bool값을 리턴하는 함수
    public checkmuteuser(userId:number):boolean {
        return this.muteuser.has(userId);
    }

    //상대의 음소거 여부를 확인 후 bool값을 리턴하는 함수
    public checkmuteYou(targetId:number):boolean {
        return this.muteuser.has(targetId);
    }

    //방의 유저Id 리스트 반환
    public getUserIdList():IterableIterator<number> {
        return this.userIds.keys();
    }

    public checksecret():boolean {
        return !this.secret;//공개방이면 true, 비밀방이면 false 보내주기
    }

    public checksecretPw(secretPW:string):boolean {
        return this.secretpw == secretPW;
    }

    public kickUser(userId:number, targetId:number):boolean {
        if (userId != this.master)
            return false;
        if (this.userIds.has(targetId)) {
            this.delsocketuser(targetId);
            return true;
        }
        return false;

    }

    public banUser(userId:number, targetId:number){
        if (userId != this.master)
            return ;
        if (!this.userIds.has(targetId))
            this.banList.add(targetId);
    }

    //내가 밴인지 체크
    public banCheck(userId:number):boolean {
        return this.banList.has(userId);
    }

}




















export class chatClass {
    //방이름:해당 방 정보 클래스
    private rooms : Map<string, roomClass>;
    private userIdRooms : Map<number, Set<string>>;//usertid : 방이름들
    private userIdsocketId : Map<number, Set<string>>;//소켓통신을 하고 있는 유저들

    public constructor() {
        this.rooms = new Map<string, roomClass>();
        this.userIdRooms = new Map<number, Set<string>>();
        this.userIdsocketId =new Map<number, Set<string>>();
    }

    public getsocketIdByuserId(userId:number):Set<string> {
        return this.userIdsocketId.get(userId);
    }

    public socketSave(userId:number, socketId:string) {
        if (this.userIdsocketId.has(userId)=== false)
            this.userIdsocketId.set(userId, new Set<string>());
        this.userIdsocketId.get(userId).add(socketId);
    }

    public socketDelete(userId:number, socketId:string) {
        this.userIdsocketId.get(userId).delete(socketId);
    }

    public checkRoomInUser(userId:number, roomName:string):boolean {
        return this.userIdRooms.get(userId).has(roomName);
    }

    //방의 현재 인원들 소켓s 반환
    public getSocketList(roomName: string, BlockedMe:Friend[]):Array<string>{
        const room:roomClass = this.rooms.get(roomName);
        let userIds = room.getUserIdList();
        let sockets:string[] = [];

        let block:number[] = [];//날 차단한 사람들 id 만 추출
        for (let id of BlockedMe) {
            block.push(id.sender.id);
            // console.log("id.sender.username: ", id.sender.username);
        }


        let sendId:number[] = [];//날 차단하지 않은 사람들의 id
        for (let id of userIds){
            if (!block.includes(id)) //id 값이 포함되어 있으면.
                sendId.push(id);
        }

        for(let id of sendId){//방 인원 중 현재 접속한 사람들 소켓리스트만 반환
            if (this.userIdsocketId.has(id)){
                let targetSocketIds:Set<string> = this.userIdsocketId.get(id);
                for(let targetSocketId of targetSocketIds)
                sockets.push(targetSocketId);
            }
        }
        return sockets;
    }

    public getMasterStatus(roomName:string, userid:number):boolean{//내가 마스터 이면 true, 아니면 false
        const room:roomClass = this.rooms.get(roomName);

        return room.getMasterStatus(userid);
    }

    // 새로운 채팅방 추가,일단 소켓으로 알려주고 추후 api로 변경 되면 소켓 부분 제거하기
    public newRoom(roomName: string, socketId:string, userId:number, secretpw:string=''){
        if (!(this.rooms.has(roomName))){
            this.rooms.set(roomName, new roomClass(socketId, userId, secretpw));
            if (!this.userIdRooms.has(userId))
                this.userIdRooms.set(userId, new Set<string>());
            // console.log(userId);
            // console.log(this.userIdRooms.get(userId));
            this.userIdRooms.get(userId).add(roomName);
        }
        else{
            //비번 확인하는 구조 넣기//게이트웨이 단에서 비번 확인할 때 체크함
            this.addUser(roomName, socketId, userId);
            if (!this.userIdRooms.has(userId))
                this.userIdRooms.set(userId, new Set<string>());
            this.userIdRooms.get(userId).add(roomName);
        }
    }

    //방 리스트 보내주기
    public getRoomList():IterableIterator<string>{
        return this.rooms.keys();
    }

    // 방이름 체크 및 기존의 방이 있는지 확인, 브라우저에서 방이 있는지 보내주기
    public roomCheck(roomName: string):boolean {
        //문자열에 공백이 있는 경우
        let blank_pattern = /[\s]/g;
        if( blank_pattern.test(roomName) == true)
            return true;
        //특수문자가 있는 경우
        let special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
        if(special_pattern.test(roomName) == true)
            return true;
        //공백 혹은 특수문자가 있는 경우
        if(roomName.search(/\W|\s/g) > -1)
            return true;

        return this.rooms.has(roomName);
    }

    //방 인원 추가, api로 방 추가가 되면 소켓통신
    private addUser(roomName: string, socketId:string, userId:number):void {
        const room:roomClass = this.rooms.get(roomName);
        room.addsocketuser(socketId, userId);
    }

    //방 인원 나감,
    public delUser(roomName:string, userId:number) {
        const room:roomClass = this.rooms.get(roomName);

        room.delsocketuser(userId);
        this.roomDel(roomName);
        this.userIdRooms.get(userId).delete(roomName);
    }

    //방 삭제, 소켓 연결이 해제될 때, 방에 아무도 없으면 방 삭제
    public roomDel(roomName: string) {
        const room:roomClass = this.rooms.get(roomName);

        if (room.userCount() == 0)
            this.rooms.delete(roomName);
    }

    //방장 위임 기능 함수
    public mandateMaster(server:Server, roomName: string, userid:number, targetid:number) {
        const room:roomClass = this.rooms.get(roomName);
        if (room.mandateMaster(userid, targetid)){
            let targetSocketIds:Set<string> = this.userIdsocketId.get(targetid);
            for (let id of targetSocketIds)
                server.to(id).emit('youMaster');
            //방장 이였던 사람에게 메세지 전송 'youExMaster'
            let userSocketIds:Set<string> = this.userIdsocketId.get(userid);
            for (let id of userSocketIds)
                server.to(id).emit('youExMaster');
        }
    }

    //비번 변경 함수
    public setSecretpw(roomName:string, userId:number, newsecret:string) {
        const room:roomClass = this.rooms.get(roomName);
        console.log(room.setSecretpw(userId, newsecret));
    }

    //음소거를 하는 함수
    public addmuteuser(roomName: string, userId:number, targetId:number) {
        const room:roomClass = this.rooms.get(roomName);
        room.addmuteuser(userId, targetId);
    }

    //음소거를 해제하는 함수
    public freemuteuser(roomName: string, userId:number, targetId:number) {
        const room:roomClass = this.rooms.get(roomName);
        room.freemuteuser(userId, targetId);
    }

    //음소거 여부를 확인 후 bool값을 리턴하는 함수
    public checkMuteUser(roomName:string, userId:number) {
        const room:roomClass = this.rooms.get(roomName);
        return room.checkmuteuser(userId);
    }

    //음소거 여부를 확인 후 bool값을 리턴하는 함수
    public checkMuteYou(roomName:string, targetId:number):boolean {
        const room:roomClass = this.rooms.get(roomName);
        return room.checkmuteYou(targetId);
    }


    //방이 비밀방 여부 확인, 비밀방이면 false
    public checksecret(roomName:string):boolean{
        const room:roomClass = this.rooms.get(roomName);
        console.log(room.checksecret());
        return room.checksecret();
    }

    //비밀방의 비밀번호가 맞는지 확인하기 맞으면 ture, 틀리면 false
    public checksecretPw(roomName:string, secretPW:string){
        const room:roomClass = this.rooms.get(roomName);
        return room.checksecretPw(secretPW);
    }

    public kickUser(server:Server, roomName:string, userId:number, targetId:number) {
        const room:roomClass = this.rooms.get(roomName);
        if (room.kickUser(userId, targetId)) {
            // console.log("kick");
            let targetSocketIds:Set<string> = this.userIdsocketId.get(targetId);
            for (let id of targetSocketIds)
                server.to(id).emit('youKick');
            this.userIdRooms.get(userId).delete(roomName);
        }
    }

    public banUser(server:Server, roomName:string, userId:number, targetId:number) {
        const room:roomClass = this.rooms.get(roomName);
        this.kickUser(server, roomName, userId, targetId);
        room.banUser(userId, targetId);
    }

    //밴 당한 방인지 체크할 때 사용
    public banCheck(roomName:string, userId:number):boolean{
        const room:roomClass = this.rooms.get(roomName);
        return room.banCheck(userId);
    }

}