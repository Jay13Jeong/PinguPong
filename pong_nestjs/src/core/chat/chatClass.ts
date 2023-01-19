class roomClass {//유저 아이디와 고유 키값 둘다 있어야 함
    //유저의 키값을 어떤것으로 할 것인가?소켓이 계속 유지가 된다.
}

export class chatClass {
    private room : Map<string, roomClass>;

    public constructor(){ }
    
    // 새로운 채팅방 추가,일단 소켓으로 알려주고 추후 api로 변경 되면 소켓 부분 제거하기
    public newRoom(){

    }

    //방 리스트 보내주기
    public getRoomList(){

    }

    // 기존의 방이 있는지 확인, 브라우저에서 방이 있는지 보내주기
    public roomCheck(){

    }
    
    //방 삭제, 소켓 연결이 해제될 때, 방에 아무도 없으면 방 삭제
    public roomDel() {

    }

    //방 인원 추가, api로 방 추가가 되면 소켓통신 
    public addUser() {

    }

    //방 인원 나감, 소켓 연결이 끊어지면 방에서 유저 삭제
    public delUser() {

    }
    
    //화면이 변경될 때 소켓 변경, 
}