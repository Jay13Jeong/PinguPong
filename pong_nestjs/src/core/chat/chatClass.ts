class roomClass {//유저 아이디와 고유 키값 둘다 있어야 함, primary key는 소켓 id이다.
    //유저의 키값을 어떤것으로 할 것인가? A:소켓이 계속 유지가 된다. 리액트 페이지 라우팅 때문? 리액트 기능이 있다.
    //방장 변수
    private master:string;
    
    //비밀방 여부
    private secret:boolean;
    //비번용 변수
    private secretpw:string;

    //맵 유저 id: 소켓 id//이구조가 맞는가? 왜 필요했는가? 고민 이유 소켓 연결이 끊길 경우엔 유저 id를 받을 수가 없는데...
    //맵 소켓id:유저id로 변경하자, 음소거 때문에 ,둘다 가지자...
    private socketuser : Map<string, string>;//소켓이 키
    private usersocket : Map<string, string>;//유저가 키
    
    //맵 보낸 소켓 id(A), A를 차단한 소켓 id들 벡터
    private blockuser : Map<string, string[]>;

    //방장에게 음소거 당한 소켓 io 벡터
    private muteuser : Set<string>;

    public constructor(master:string, userid:string, secretpw:string){
        console.log('new');
        this.socketuser = new Map<string, string>();
        this.master = master; 
        this.socketuser.set(master,userid);
        this.usersocket = new Map<string, string>();
        this.usersocket.set(userid, master);
        
        if (secretpw != undefined)
            this.secret = false;
        this.secret = true;

        this.blockuser = new Map<string, string[]>();
        this.muteuser = new Set<string>();
    }

    public userCount():number{
        return this.socketuser.size;
    }
    //방장 위임 기능 함수
    public mandateMaster(master:string, userid:string){
        if (master == this.master)
            this.master = this.usersocket.get(userid);
    }

    //방장 나갈 때 방장 위임 기능 함수 실행
    private newMaster(){
        this.master = Object.keys(this.socketuser)[0];
    }

    //추가 유저
    public addsocketuser(socketid:string, userid:string){
        console.log("123",this.socketuser.has(socketid));
        if (!this.socketuser.has(socketid))
            this.socketuser.set(socketid, userid);
        if (!this.usersocket.has(userid))
            this.usersocket.set(userid, socketid);
    }

    //나간 유저
    public delsocketuser(socketid:string){
        if (this.socketuser.has(socketid))
            this.usersocket.delete(this.socketuser.get(socketid));
        if (this.socketuser.has(socketid))
            this.socketuser.delete(socketid);
        if (this.blockuser.has(socketid))
            this.blockuser.delete(socketid);
        this.muteuser.delete(socketid);
        if (socketid == this.master)
            this.newMaster();
    }

    //비번 변경 함수
    public setSecretpw(secretpw:string, newsecret:string):boolean{
        if (!this.secret)
            return false;
        if (this.secretpw == secretpw){
            this.secretpw = newsecret;
            return true;
        }
        return false;
    }

    //차단의 경우 추가하는 함수
    public addblockuser(socketid:string, targetuserid:string){
        const targetsocketid:string = this.usersocket.get(targetuserid);
        if (!this.blockuser.has(targetsocketid)){
            this.blockuser.set(targetsocketid,[socketid]);
        }
        else{
            if(!this.blockuser.get(targetsocketid).includes(socketid)){
                this.blockuser.set(targetsocketid, [...this.blockuser.get(targetsocketid) ,socketid ]);
            }
        }
    }
    //차단을 해제하는 함수
    public freeblockuser(socketid:string, targetuserid:string){
        const targetsocketid:string = this.usersocket.get(targetuserid);
        if (this.blockuser.has(targetsocketid)){
            if(this.blockuser.get(targetsocketid).includes(socketid)){
                this.blockuser.set(targetsocketid, this.blockuser.get(targetsocketid).filter(function (data){
                    return data != socketid;
                }));
            }
        }
    }
    //A를 차단한 소켓 id들 리턴하는 함수
    public getblockuser(socketid:string):string[]{
        return this.blockuser.get(socketid);//key값이 없으면 undefined를 반환
    }

    //음소거를 하는 함수
    public addmuteuser(master:string, userid:string){
        if (this.master != master)
            return ;
        if (!this.muteuser.has(userid)){
            this.muteuser.add(userid);
        }
    }

    //음소거를 해제하는 함수
    public freemuteuser(master:string, userid:string){
        if (this.master != master)
            return ;
        this.muteuser.delete(userid);
    }

    //음소거 여부를 확인 후 bool값을 리턴하는 함수
    public checkmuteuser(socketid:string):boolean{
        return this.muteuser.has(this.socketuser.get(socketid));
    }

    //방의 소켓 리스트 반환
    public getSocketList():IterableIterator<string>{
        return this.socketuser.keys();
    }
}

export class chatClass {
    //방이름:해당 방 정보 클래스
    private rooms : Map<string, roomClass>;

    public constructor(){
        this.rooms = new Map<string, roomClass>();
     }
    
    //방의 현재 인원들 소켓s 반환
    public getSocketList(roomName: string):IterableIterator<string>{
        const room:roomClass = this.rooms.get(roomName);
        return room.getSocketList();
    }

    // 새로운 채팅방 추가,일단 소켓으로 알려주고 추후 api로 변경 되면 소켓 부분 제거하기
    public newRoom(roomName: string, master:string, userid:string, secretpw:string){
        if (!(this.rooms.has(roomName)))
            this.rooms.set(roomName, new roomClass(master, userid, secretpw));
        else{
            this.addUser(roomName, master, userid);
        }
    }

    //방 리스트 보내주기
    public getRoomList():string[] | undefined{
        return Object.keys(this.rooms);
    }

    // 기존의 방이 있는지 확인, 브라우저에서 방이 있는지 보내주기
    public roomCheck(roomName: string):boolean {
        return this.rooms.has(roomName);
    }
    
    //방 인원 추가, api로 방 추가가 되면 소켓통신 
    public addUser(roomName: string, socketid:string, userid:string):void {
        const room:roomClass = this.rooms.get(roomName);
        room.addsocketuser(socketid, userid);
    }

    //방 인원 나감, 소켓 연결이 끊어지면 방에서 유저 삭제
    public delUser(roomName: string, socketid:string) {
        const room:roomClass = this.rooms.get(roomName);
        room.delsocketuser(socketid);

        this.roomDel(roomName);
    }

    //방 삭제, 소켓 연결이 해제될 때, 방에 아무도 없으면 방 삭제
    public roomDel(roomName: string) {
        const room:roomClass = this.rooms.get(roomName);

        if (room.userCount() == 0)
            this.rooms.delete(roomName);
    }

    //화면이 변경될 때 소켓 변경이 안된다. 리액트 페이지 라우팅 때문에.


    //방장 위임 기능 함수
    public mandateMaster(roomName: string, socketid:string, userid:string) {
        const room:roomClass = this.rooms.get(roomName);
        room.mandateMaster(socketid, userid);
    }

    //비번 변경 함수
    public setSecretpw(roomName: string, secretpw:string, newsecret:string) {
        const room:roomClass = this.rooms.get(roomName);
        room.setSecretpw(secretpw, newsecret);
    }

    //차단의 경우 추가하는 함수
    public addblockuser(roomName: string, socketid:string, targetuserid:string) {
        const room:roomClass = this.rooms.get(roomName);
        room.addblockuser(socketid, targetuserid);
    }

    //차단을 해제하는 함수
    public freeblockuser(roomName: string, socketid:string, targetuserid:string) {
        const room:roomClass = this.rooms.get(roomName);
        room.freeblockuser(socketid, targetuserid);
    }

    //A를 차단한 소켓 id들 리턴하는 함수
    public getblockuser(roomName: string, socketid:string):string[] {
        const room:roomClass = this.rooms.get(roomName);
        return room.getblockuser(socketid);
    }

    //음소거를 하는 함수
    public addmuteuser(roomName: string, socketid:string, userid:string) {
        const room:roomClass = this.rooms.get(roomName);
        room.addmuteuser(socketid, userid);
    }

    //음소거를 해제하는 함수
    public freemuteuser(roomName: string, socketid:string, userid:string) {
        const room:roomClass = this.rooms.get(roomName);
        room.freemuteuser(socketid, userid);
    }

    //음소거 여부를 확인 후 bool값을 리턴하는 함수
    public checkmuteuser(roomName: string, socketid:string) {
        const room:roomClass = this.rooms.get(roomName);
        return room.checkmuteuser(socketid);
    }

}