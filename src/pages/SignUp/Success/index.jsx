import { checkMembershipStatus, userSignUpEmail } from '@/api/authApi';
import success from '@/assets/images/sign_up_success.png';

import {
  ButtonWrapper,
  EmailBox,
  LeftButton,
  RightButton,
  Wrapper,
} from '@/pages/SignUp/Success/style';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Success() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email);

  useEffect(() => {
    const fetch = async () => {
      if (!email) {
        const response = await checkMembershipStatus();
        setEmail(response.data.nickname);
      }
    };
    fetch();
  }, []);

  const sendEmail = async () => {
    try {
      await userSignUpEmail(email);
      alert('이메일을 전송하였습니다.');
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      <Wrapper>
        <img src={success} alt='success' />
        <h3>가입을 환영합니다!</h3>
        <p>입력해주신 이메일주소로 이메일 인증이 발송되었습니다.</p>
        <p>메일을 확인하여 계정을 활성화해주세요.</p>
        <EmailBox>{email}</EmailBox>
        <span>
          메일을 받지 못하신 경우, 메일 다시 보내기 버튼을 클릭해주세요
        </span>
        <ButtonWrapper>
          <LeftButton to='/'>메인으로 가기</LeftButton>
          <RightButton onClick={sendEmail}>메일 다시 보내기</RightButton>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
}

export default Success;
