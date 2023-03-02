import { msg } from "./msgType";

export class roomMsgDb{
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