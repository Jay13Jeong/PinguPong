import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { REACT_APP_HOST } from "../../common/configData";
import { RoutePath } from "../../common/configData";

import { Typography, Stack, TextField } from "@mui/material";
import { DefaultBox, DefaultButton } from "../../components/common";

export default function FA2Page() {
  const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState<boolean>(false);
    const [helperText, setHelperText] = useState<string>("메일로 전송된 코드를 입력하세요.");

    useEffect(() => {
      //2단계인증이 켜져있는지 검사.
      const get2faStatus = async () => {
        try{
          const res = await axios.get('http://' + REACT_APP_HOST + '/api/fa2/status', {withCredentials: true}) //쿠키와 함께 보내기 true.
          if (res.data.twofa === false){
            navigate(RoutePath.lobby); //2단계인증이 꺼져있으면 로비로 간다.
            return ;
          }
          try{
            await axios.get('http://' + REACT_APP_HOST + '/api/fa2',{withCredentials: true});
          } catch {
            navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
          }
        }catch(err: any){
          // alert(err.response.data.message);
          navigate(RoutePath.root); //로그인 안되어 있다면 로그인페이지로 돌아간다.
        }
      }
      get2faStatus();
    }, []);
  
    function handleSubmit(event : any) {
      event.preventDefault();
      const submitCode = async () => {
        try{
          const res = await axios.post('http://' + REACT_APP_HOST + '/api/fa2', {code : code}, {withCredentials: true})
          if (res.status === 200)
            navigate('/lobby');
        }catch(err: any){
          setError(true);
          setHelperText("인증코드가 일치하지 않습니다.");
        }
      }
      submitCode();
    };

    return (
      <DefaultBox>
        <Stack>
          <Typography variant="h2" component="h1" gutterBottom>2차 인증 코드</Typography>
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextField
                label="인증 코드"
                variant="outlined"
                value={code}
                size="small"
                helperText={helperText}
                error={error ? true : false}
                onChange={(e) => setCode(e.target.value)}
                type="password"
                />
              <DefaultButton type="submit">확인</DefaultButton>
            </Stack>
          </form>
        </Stack>
      </DefaultBox>
    )
  }