import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Friend } from '../friend/friend.entity';
import { roomClass } from './roomClass';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomUserId } from './room.entity';

@Injectable()
export class ChatService {
    //방이름:해당 방 정보 클래스
    private rooms : Map<string, roomClass>;
    private userIdRooms : Map<number, Set<string>>;//usertid : 방이름들
    private userIdsocketId : Map<number, Set<string>>;//소켓통신을 하고 있는 유저들

    public constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,) {
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

    public async checkRoomInUser(userId:number, roomName:string):Promise<boolean> {
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        if (room.userIds == undefined)
             return false;
        for (let user of room.userIds){
            if (user.userid == userId)
                return true;
        }
        return false;
    }

    //방의 현재 인원들 소켓s 반환
    public async getSocketList(roomName: string, BlockedMe:Friend[]):Promise<Array<string>>{
        const room = await this.chatRepository.findOneBy({roomName: roomName});
        let userIds: RoomUserId[] = room.userIds;
        let sockets:string[] = [];

        let block:number[] = [];//날 차단한 사람들 id 만 추출
        for (let id of BlockedMe) {
            block.push(id.sender.id);
        }

        let sendId:number[] = [];//날 차단하지 않은 사람들의 id
        for (let id of userIds){
            if (!block.includes(id.userid)) //id 값이 포함되어 있으면.
                sendId.push(id.userid);
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

    public async getMasterStatus(roomName:string, userid:number):Promise<boolean>{//내가 마스터 이면 true, 아니면 false
        let room = await this.chatRepository.findOneBy({roomName: roomName});

        return room.adminId == userid;
    }

    // 새로운 채팅방 추가,일단 소켓으로 알려주고 추후 api로 변경 되면 소켓 부분 제거하기
    public async newRoom(roomName: string, userId:number, secretpw:string=''){
        if (!(await this.roomDbHas(roomName))){
            await this.roomDbCreate(roomName, userId, secretpw);
        }
        else{
            //비번 확인하는 구조 넣기//게이트웨이 단에서 비번 확인할 때 체크함
            this.addUser(roomName, userId);
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
    private async addUser(roomName: string, userId:number) {
        let room = await this.chatRepository.findOneBy({roomName: roomName});

        let addUser = new RoomUserId();
        addUser.userid = userId;
        room.userIds.push(addUser);
        await this.chatRepository.save(room);
    }
    //방 인원 나감,
    public delUser(roomName:string, userId:number, server:Server) {
        const room:roomClass = this.rooms.get(roomName);
        if (room.getMasterStatus(userId) == true){//나간 사람이 방장이면 새로운 방장 임명 후  당사자에게 메세지 전송
            let targetId:number = room.newMaster(userId);
            let targetSocketIds:Set<string> = this.userIdsocketId.get(targetId);
            if (targetSocketIds != undefined){
                let targetSocketIdsArray:string[] = Array.from(targetSocketIds.keys());
                for (let id of targetSocketIdsArray){
                    server.to(id).emit('youMaster');
                }
            }
        }
        room.delsocketuser(userId)
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
        room.setSecretpw(userId, newsecret);
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
    public async checkMuteUser(roomName:string, userId:number) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        if (room.muted == undefined)
             return false;
        for (let user of room.muted){
            if (user.userid == userId)
                return true;
        }
        return false;
    }
    //음소거 여부를 확인 후 bool값을 리턴하는 함수
    public async checkMuteYou(roomName:string, targetId:number):Promise<boolean> {
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        if (room.muted == undefined)
            return false;
        for (let mute of room.muted){
            if (mute.userid == targetId)
                return true;
        }
        return false;
    }

    //방이 비밀방 여부 확인, 비밀방이면 false
    public checksecret(roomName:string):boolean{
        const room:roomClass = this.rooms.get(roomName);
        if (room == undefined)
            return true;//방이 없지만 목록리스트에서 방이 있어 접근하는 경우. 뒤에서 방 입장시에 fail을 던지자
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
            let targetSocketIds:Set<string> = this.userIdsocketId.get(targetId);
            for (let id of targetSocketIds)
                server.to(id).emit('youKick');
            this.userIdRooms.get(targetId).delete(roomName);
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

    private async roomDbCreate(roomName: string, userId:number, secretpw:string){
        let secret:boolean = true;
        if (secretpw == '')
            secret = false;

        let chat:Chat = new Chat();
        chat.roomName = roomName;
        chat.adminId = userId;
        chat.secret = secret;
        chat.password = secretpw;
        chat.banned = [];
        chat.muted = [];
        let roomNewUserId : RoomUserId = new RoomUserId();
        roomNewUserId.userid = userId;
        chat.userIds = [roomNewUserId];
        await this.chatRepository.save(chat);
    }

    private async roomDbHas(roomName):Promise<boolean>{
        let temp = await this.chatRepository.findOneBy({roomName: roomName});
        if (temp == null)
            return false;
        return true;
    }
//룸 유저 체크, 마스터 체크, 방장 위임,, 유저 추가 제거, 비번 변경, 음소거추가/해제, 벤 추가


}
