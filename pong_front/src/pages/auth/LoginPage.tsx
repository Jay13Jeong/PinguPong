// import Login from '../../components/auth/Login';
import { LoginButton } from '../../components/auth/Login/';
import useCheckLogin from '../../util/useCheckLogin';

export default function LoginPage() {
  useCheckLogin();
  return (
    <>
      <LoginButton/>
      {/* MovingPingu */}
    </>
  );
}
