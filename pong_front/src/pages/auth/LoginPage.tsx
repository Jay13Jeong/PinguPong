import { LoginButton } from '../../components/auth/Login/';
import useCheckLogin from '../../util/useCheckLogin';

export default function LoginPage() {
  useCheckLogin(true);
  return (
    <>
      <LoginButton/>
    </>
  );
}
