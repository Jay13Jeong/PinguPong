import { Inject } from "@nestjs/common";
import { Socket } from "socket.io";

type msgs= {
    user:string,
    msg:string
}

class roomMsgDb{
    private userMsg : Set<msgs>;
    
    public constructor(){
        this.userMsg = new Set<msgs>();
    }

    public pushMsg(user:string, msg:string){
        this.userMsg.add({user:user, msg:msg});
    }

    public getMsg():Array<msgs>{
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

    public getUser():Array<number>{
        return Array.from(this.targetuserRoomnum.keys());
    }
}

export class dmClass{
    private userDmList:Map<number, userDmList>;//나의 디엠 리스트
    private roomNumber : number;//프라이머리키 및 룸 넘버 지정용
    private socketidUser : Map<string, number>;//디엠 접근시 사용할 소켓 커넥트
    private roomDB : Map<string, roomMsgDb>//룸 넘버에 해당하는 저장된 msg들

    public constructor(){
        this.userDmList = new Map<number, userDmList>();
        this.socketidUser = new Map<string, number>();
        this.roomDB = new Map<string, roomMsgDb>();
        this.roomNumber = 1;
    }

    public setUsers(socketid:string, userId:number){
        this.socketidUser.set(socketid, userId);
    }

    public getdmList(socketid:string):number[]{
        let userid = this.socketidUser.get(socketid)
        if (!this.userDmList.has(userid))
            this.userDmList.set(userid, new userDmList());
        return this.userDmList.get(userid).getUser();
    }

    public saveDmRoomdb(){

    }

    public connectDm(socket:Socket, targetId:number) {
        const myDmList = this.userDmList.get(this.socketidUser.get(socket.id));

        if (!myDmList.checkCreateDM(targetId)){
            myDmList.pushDm(targetId, 'dm'+this.roomNumber);
            if (!this.userDmList.has(targetId))
                this.userDmList.set(targetId, new userDmList());
            this.userDmList.get(targetId).pushDm(targetId, 'dm'+this.roomNumber);
            this.roomNumber++;
        }

    }

    public closeDm(socket:Socket, targetId:number){

    }
}