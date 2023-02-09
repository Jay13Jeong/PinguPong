function randomNum(){
  const max = 8; //마지막 이미지 번호.
  const min = 1; //최초 이미지 번호.
  return Math.floor(Math.random() * (max - min) + min);
}

function BackGroundPingu() {
  return (
    <img 
      src={require("../../assets/pingu" + randomNum() + ".gif")}
      className='background-pinga'
    />
  );
}
export default BackGroundPingu;
