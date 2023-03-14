import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Friend } from '../friend/friend.entity';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomUserId } from './room.entity';
import { Mute } from './mute.entity';
import { Ban } from './ban.entity';
import { Msgs } from './msg.entity';

@Injectable()
export class ChatService {
    //방이름:해당 방 정보 클래스
    private userIdsocketId : Map<number, Set<string>>;//소켓통신을 하고 있는 유저들

    public constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,) {
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
    public async getRoomList():Promise<string[]>{
        let rooms = await this.chatRepository.find();

        let retRooms:string[] = [];
        for(let room of rooms)
            retRooms.push(room.roomName);
        return retRooms;
    }

    // 방이름 체크 및 기존의 방이 있는지 확인, 브라우저에서 방이 있는지 보내주기
    public async roomCheck(roomName: string):Promise<boolean> {
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
        //이미 있는지 없는지 확인
        let room = await this.chatRepository.findOneBy({roomName: roomName});
        if (room != null)
            return true;
        return false
    }

    //방 인원 추가, api로 방 추가가 되면 소켓통신
    private async addUser(roomName: string, userId:number) {
        let room = await this.chatRepository.findOneBy({roomName: roomName});

        for (let id of room.userIds)
            if (id.userid == userId)
                return ;

        let addUser = new RoomUserId();
        addUser.userid = userId;
        room.userIds.push(addUser);
        await this.chatRepository.save(room);
    }

    public async saveMsg(roomName: string, userId:number, msg:string){
        let room = await this.chatRepository.findOneBy({roomName: roomName});

        let saveMsg:Msgs = new Msgs();
        saveMsg.userid = userId;
        saveMsg.msg = msg;

        room.msgs.push(saveMsg);
        await this.chatRepository.save(room);
    }

    public async sendMsg(roomName):Promise<Msgs[]>{
        let room = await this.chatRepository.findOneBy({roomName: roomName});
        let Msgs = room.msgs;
        let sendMsgs:Msgs[] = [];

        for (let msg of Msgs){
            sendMsgs.push(msg);
        }
        return sendMsgs;
    }
    //방 인원 나감,
    public async delUser(roomName:string, userId:number, server:Server) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});
        let roomUser = room.userIds;

        for(let i = 0; i < roomUser.length; i++) {//해당 유저 룸에서 제거
            if(roomUser[i].userid === userId)  {
                roomUser.splice(i, 1);
                break ;
            }
        }

        if (room.userIds.length == 0){//방 삭제, 방에 아무도 없으면 방 삭제
            await this.chatRepository.remove(room);
            return ;
        }

        if (room.adminId == userId){//나간 사람이 방장이면 새로운 방장 임명 후  당사자에게 메세지 전송
            room.adminId = roomUser[0].userid;
            let targetSocketIds:Set<string> = this.userIdsocketId.get(room.adminId);
            if (targetSocketIds != undefined){
                let targetSocketIdsArray:string[] = Array.from(targetSocketIds.keys());
                for (let id of targetSocketIdsArray){
                    server.to(id).emit('youMaster');
                }
            }
        }
        await this.chatRepository.save(room);
    }


    //방장 위임 기능 함수
    public async mandateMaster(server:Server, roomName: string, userid:number, targetid:number) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        for (let id of room.userIds){
            if (id.userid == targetid && room.adminId == userid){
                room.adminId = targetid;
                let targetSocketIds:Set<string> = this.userIdsocketId.get(room.adminId);
                for (let id of targetSocketIds)
                    server.to(id).emit('youMaster');
                //방장 이였던 사람에게 메세지 전송 'youExMaster'
                let userSocketIds:Set<string> = this.userIdsocketId.get(userid);
                for (let id of userSocketIds)
                    server.to(id).emit('youExMaster');
                await this.chatRepository.save(room);
                break ;
            }
        }
    }
    //비번 변경 함수
    public async setSecretpw(roomName:string, userId:number, newsecret:string) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        if (room.adminId == userId){
            room.password = newsecret;
            if (newsecret == '')
                room.secret = false;
            else
                room.secret = true;
            await this.chatRepository.save(room);
        }
    }
    //음소거를 하는 함수
    public async addmuteuser(roomName: string, userId:number, targetId:number) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        if (room.adminId != userId)
            return ;

        for (let id of room.muted)
            if (id.userid == targetId)
                return ;
        let muteUser = new Mute();
        muteUser.userid = targetId;
        room.muted.push(muteUser);
        await this.chatRepository.save(room);
    }
    //음소거를 해제하는 함수
    public async freemuteuser(roomName: string, userId:number, targetId:number) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});
        let roomMute = room.muted;
        if (room.adminId != userId)
            return ;
        for(let i = 0; i < roomMute.length; i++) {//해당 유저 룸에서 제거
            if(roomMute[i].userid === targetId)  {
                roomMute.splice(i, 1);
                break ;
            }
        }
        await this.chatRepository.save(room);
    }

    //음소거 여부를 확인 후 bool값을 리턴하는 함수
    public async checkMuteUser(roomName:string, userId:number) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        if (room.muted == null)
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
    public async checksecret(roomName:string):Promise<boolean>{
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        if (room == null)
            return true;//방이 없지만 목록리스트에서 방이 있어 접근하는 경우. 뒤에서 방 입장시에 fail을 던지자
        return !(room.secret);
    }

    //비밀방의 비밀번호가 맞는지 확인하기 맞으면 ture, 틀리면 false
    public async checksecretPw(roomName:string, secretPW:string){
        let room = await this.chatRepository.findOneBy({roomName:roomName});

        return room.password == secretPW;
    }

    //채팅방에서 추방
    public async kickUser(server:Server, roomName:string, userId:number, targetId:number) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});
        let roomUsers = room.userIds;

        if (room.adminId != userId)
            return ;
        for(let i = 0; i < roomUsers.length; i++) {//해당 유저 킥메세지 보내기
            if(roomUsers[i].userid === targetId)  {
                let targetSocketIds:Set<string> = this.userIdsocketId.get(targetId);
                for (let id of targetSocketIds)
                    server.to(id).emit('youKick');
                break ;
            }
        }
    }
    //유저 채팅방에서 영구 밴
    public async banUser(server:Server, roomName:string, userId:number, targetId:number) {
        let room = await this.chatRepository.findOneBy({roomName:roomName});
        let roomUsers = room.userIds;

        this.kickUser(server, roomName, userId, targetId);
        if (room.adminId != userId)
            return ;
        for(let i = 0; i < roomUsers.length; i++) {//해당 유저 영구 밴 및 메시지 보내기
            if(roomUsers[i].userid === targetId)  {
                roomUsers.splice(i, 1);//유저 목록에서 제거
                let targetSocketIds:Set<string> = this.userIdsocketId.get(targetId);
                for (let id of targetSocketIds)
                    server.to(id).emit('youKick');
                break ;
            }
        }
        let banUser = new Ban();//벤리스트에 추가
        banUser.userid = targetId;
        room.banned.push(banUser);
        await this.chatRepository.save(room);
    }
    //밴 당한 방인지 체크할 때 사용
    public async banCheck(roomName:string, userId:number):Promise<boolean>{
        let room = await this.chatRepository.findOneBy({roomName:roomName});
        let banlist = room.banned;
        for (let banUser of banlist)
            if (banUser.userid == userId)
                return true;
        return false;
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
        chat.msgs = [];
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
}
