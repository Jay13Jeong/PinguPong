import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { REACT_APP_HOST } from "../../common/configData";
import { ContentBox } from "../../common/styles/ContentBox.style";
import { RoutePath } from "../../common/configData";

export default function FA2Page() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  useEffect(() => {
    //2단계인증이 켜져있는지 검사.
    const get2faStatus = async () => {
      try{
        const res = await axios.get('http://' + REACT_APP_HOST + ':3000/api/fa2/status', {withCredentials: true}) //쿠키와 함께 보내기 true.
        if (res.data.twofa === false){
          navigate(RoutePath.lobby); //2단계인증이 꺼져있으면 로비로 간다.
          return ;
        }
      }catch(err: any){
        navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
      }
      try{
        await axios.get('http://' + REACT_APP_HOST + ':3000/api/fa2',{withCredentials: true});
      } catch(err: any) {
        navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
      }
    }
    get2faStatus();
  }, []);

  function handleSubmit(event : any) {
    event.preventDefault();
    const submitCode = async () => {
      try{
        const res = await axios.post('http://' + REACT_APP_HOST + ':3000/api/fa2', {code : code}, {withCredentials: true})
        if (res.status === 200)
          navigate(RoutePath.lobby);
      }catch(err: any){
        alert('invalid code : check 42Email again');
      }
    }
    submitCode();
  };

    return (
      <ContentBox>
        <h1>CODE</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
          <button onClick={handleSubmit} className="confirmBtn">OK</button>
        </form>
      </ContentBox>
    );
  }