import Login from '../../components/auth/Login';
// const Container = styled.div`
//   width: 60%;
//   margin: 0px auto;
// `;

// import { Link } from "react-router-dom";

// const RegisterButton = styled(Button)`
//   height: 40px;
//   border-radius: 5px;
//   margin-top: 30px;
//   font-size: 18px;
//   transition: all 0.7s ease;
//   :hover {
//     opacity: 0.8;
//   }
//   ::before {
//     padding-top: 0%;
//   }
// `;
// const CustomP = styled.p`
//   text-align: center;
// `;

export default function LoginPage() {
  return (
    <div>
      <Login />
    </div>
    // <Link to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e607d301881ee531825879addc115683a5bf969a5afc9160db766b30e0132ef3&redirect_uri=http%3A%2F%2Flocalhost%2F&response_type=code"><button>Login</button></Link>
    // <Container> 
    //   <Login />
    //   <CustomP>OR</CustomP>
    //   <RegisterButton children="회원가입" to="/auth/register" />
    // </Container>
  );
}
