import 'dotenv/config';

/*
  EMAIL_AUTH_EMAIL: 메일서버의 이메일
  EMAIL_AUTH_PASSWORD: 메일서버 패스워드
  EMAIL_HOST: 메일서버
  EMAIL_FROM_USER_NAME: 보내는 사람 이름
*/
export default () => ({
  email: {
    transport: `smtps://${process.env.EMAIL_AUTH_EMAIL}:${process.env.EMAIL_AUTH_PASSWORD}@${process.env.EMAIL_HOST}`,
    defaults: {
      from: `"${process.env.EMAIL_FROM_USER_NAME}" <${process.env.EMAIL_AUTH_EMAIL}>`,
    },
  },
});