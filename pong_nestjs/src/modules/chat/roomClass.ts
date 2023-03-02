export class roomClass {//유저 아이디와 고유 키값 둘다 있어야 함, primary key는 소켓 id이다.
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
    public newMaster(userId: number):number{
        if (this.userIds.has(userId))
            this.userIds.delete(userId);
        const newMaster = Array.from(this.userIds.keys())
        this.master = newMaster[0];
        return this.master;
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
        if (userId == this.master)
            this.newMaster(userId);
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