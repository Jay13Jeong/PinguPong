export class userDmList{
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