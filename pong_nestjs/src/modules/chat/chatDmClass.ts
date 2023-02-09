import { Inject } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { User } from "../users/user.entity";

type msg= {
    userId:number,
    msg:string
}

type receiveMsg={
    userName : string,
    msg : string
}

class roomMsgDb{
    private userMsg : Set<msg>;
    
    public constructor(){
        this.userMsg = new Set<msg>();
    }

    public pushMsg(userId:number, msg:string){
        this.userMsg.add({userId:userId, msg:msg});
    }

    public getMsg():Array<msg>{
        return Array.from(this.userMsg.keys());
    }
}

class userDmList{
    private targetuserRoomnum:Map<number,string>;

    public constructor(){
        this.targetuserRoomnum = new Map<number, string>();
    }

    public pushDm(target:number, roomNum:string){
        if (!this.targetuserRoomnum.has(target))
            this.targetuserRoomnum.set(target, roomNum);
    }

    public checkCreateDM(target:number):boolean {
        return this.targetuserRoomnum.has(target);
    }

    public getUsers():Array<number>{
        return Array.from(this.targetuserRoomnum.keys());
    }

    public getTargetRoom(targetid:number) {
        return this.targetuserRoomnum.get(targetid);
    }
}

export class dmClass{
    private userDmList:Map<number, userDmList>;//나의 디엠 리스트
    private roomNumber : number;//프라이머리키 및 룸 넘버 지정용
    private roomDB : Map<string, roomMsgDb>//룸 넘버에 해당하는 저장된 msg들

    public constructor(){
        this.userDmList = new Map<number, userDmList>();
        this.roomDB = new Map<string, roomMsgDb>();
        this.roomNumber = 1;
    }

    
    //디엠 리스트 주기, 처음 입장이거나 받은 디엠이 없으면 디엠 룸 만들어 주기
    public getdmList(userId:number):number[]{
        //console.log('dmList 초기', !this.userDmList.has(userId),  userId);
        if (!this.userDmList.has(userId))
            this.userDmList.set(userId, new userDmList());
        return this.userDmList.get(userId).getUsers();
    }

    public sendDm(server:Server, userId:number, userName:string, targetId:number, msg:string) {
        const myDmList = this.userDmList.get(userId);
        let roomName = myDmList.getTargetRoom(targetId)
        server.to(roomName).emit('receiveDm', userName, msg);
        //console.log('receiveDm', roomName, userName, msg);
        this.saveDmRoomdb(roomName, userId, msg);//메세지 저장
    }

    //보낸 대화 저장
    private saveDmRoomdb(roomName:string, userid:number, msg:string) {
        this.roomDB.get(roomName).pushMsg(userid, msg);
    }

    //1대1 대화방 입장, 단 상대방이 한번도 디엠방 이용이 없으면 만들어 주기.여태까지 주고받은 대화 반환
    //대화 저장을 위한 디비클래스도 만들기
    public connectDm(socket:Socket, userId:number, targetId:number) {
        if (this.userDmList.get(userId) == undefined)//userDmList 없으면 생성하기
            this.getdmList(userId);
        const myDmList = this.userDmList.get(userId);
        //console.log('유저아이디', userId, targetId);
        //console.log('디엠방 생성 여부체크', 'dm'+this.roomNumber, !myDmList.checkCreateDM(targetId))
        if (!myDmList.checkCreateDM(targetId)){
            //console.log('새로운 디엠방 생성', 'dm'+this.roomNumber);
            myDmList.pushDm(targetId, 'dm'+this.roomNumber);
            this.roomDB.set('dm'+this.roomNumber, new roomMsgDb());//디비 클래스 생성
            if (!this.userDmList.has(targetId))
                this.userDmList.set(targetId, new userDmList());
            this.userDmList.get(targetId).pushDm(userId, 'dm'+this.roomNumber);
            this.roomNumber++;
        }
        socket.join(myDmList.getTargetRoom(targetId));
    }

    public getMsgs(user:User, target:User): receiveMsg[] {
        const myDmList = this.userDmList.get(user.id);
        //console.log('getMsgs', user.id, target.id, this.userDmList)
        const roomName = myDmList.getTargetRoom(target.id);
        let msgs =  this.roomDB.get(roomName).getMsg();

        let receivemsg:receiveMsg[] = [];
        for(let msg of msgs){
            if (msg.userId == user.id)
                receivemsg.push({userName : user.username, msg : msg.msg})
            if (msg.userId == target.id)
                receivemsg.push({userName : target.username, msg : msg.msg})
        }
        return receivemsg;
    }

    //1대1 대화방 나가면 socket 룸 지우기
    public closeDm(socket:Socket, userId:number, targetId:number){
        const myDmList = this.userDmList.get(userId);

        socket.leave(myDmList.getTargetRoom(targetId));
        //console.log('closeDm roomName: ', myDmList.getTargetRoom(targetId), targetId);
    }
}