import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket, Server } from "socket.io";
import { Repository } from 'typeorm';
import { Users } from "../users/user.entity";
import { DmList } from './dmList.entity';
import { DmMsgDb } from './dmMsgDb.entity';
import { receiveMsg } from "./receiveMsgType";

@Injectable()
export class ChatDmService {
    private roomNumber : number;//프라이머리키 및 룸 넘버 지정용


    public constructor(
        @InjectRepository(DmList) private dmRepository: Repository<DmList>,
        @InjectRepository(DmMsgDb) private msgRepository: Repository<DmMsgDb>,
    ){
        this.roomNumber = 1;
    }

    //도전기능에서 해당 유저의 타겟 방이름을 가져오기 위한 함수, 유저상태를 나타내기 위한 방이름
    public async getTargetDmRoom(userId:number, targetId:number):Promise<string>{
        const myDmList = await this.dmRepository.findOneBy({userid:userId, targetid:targetId});
        return myDmList.dmRoomName;
    }

    //디엠 리스트 주기, 처음 입장이거나 받은 디엠이 없으면 디엠 룸 만들어 주기
    public async getdmList(userId:number):Promise<number[]>{
        let myDmList = await this.dmRepository.findBy({userid:userId});
        let ret:number[] = [];
        // console.log(myDmList);
        for (let dm of myDmList){
            ret.push(dm.targetid);
        }
        return ret;
    }

    public async sendDm(server:Server, userId:number, userName:string, targetId:number, msg:string) {
        let myDm = await this.dmRepository.findOneBy({userid:userId, targetid:targetId});
        let roomName = myDm.dmRoomName;

        server.to(roomName).emit('receiveDm', userName, msg);
        this.saveDmRoomdb(roomName, userId, msg);//메세지 저장
    }

    //보낸 대화 저장
    private async saveDmRoomdb(roomName:string, userid:number, msg:string) {
        let msgdb = new DmMsgDb();

        msgdb.dmRoomName = roomName;
        msgdb.userid = userid;
        msgdb.msg = msg;
        await this.msgRepository.save(msgdb);
    }

    //1대1 대화방 입장, 단 상대방이 한번도 디엠방 이용이 없으면 디비 만들어 주기.
    public async connectDm(socket:Socket, userId:number, targetId:number) {
        let myDm = await this.dmRepository.findOneBy({userid:userId, targetid:targetId});
        if (myDm == null){
            myDm = new DmList();
            myDm.userid = userId;
            myDm.targetid = targetId;
            myDm.dmRoomName = 'dm'+this.roomNumber++;
            await this.dmRepository.save(myDm);
            let targetDm = new DmList();
            targetDm.userid = targetId;
            targetDm.targetid = userId;
            targetDm.dmRoomName = myDm.dmRoomName;
            await this.dmRepository.save(targetDm);
        }
        socket.join(myDm.dmRoomName);
    }

    //그동안 대화한 메세지 가져오기
    public async getMsgs(user:Users, target:Users): Promise<receiveMsg[]> {
        const myDm = await this.dmRepository.findOneBy({userid:user.id, targetid:target.id});
        let msgs =  await this.msgRepository.findBy({dmRoomName:myDm.dmRoomName});

        let receivemsg:receiveMsg[] = [];
        for(let msg of msgs){
            if (msg.userid == user.id)
                receivemsg.push({userName : user.username, msg : msg.msg})
            if (msg.userid == target.id)
                receivemsg.push({userName : target.username, msg : msg.msg})
        }
        return receivemsg;
    }

    //1대1 대화방 나가면 socket 룸 지우기
    public async closeDm(socket:Socket, userId:number, targetId:number){
        const myDm = await this.dmRepository.findOneBy({userid:userId, targetid:targetId});

        socket.leave(myDm.dmRoomName);
    }
}
