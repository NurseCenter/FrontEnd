import {
  ButtonWrapper,
  EmailBox,
  Image,
  LeftButton,
  RightButton,
  Wrapper
} from "@/pages/SignUp/Success/style";
import success from '@/assets/images/sign_up_success.png';
import { useState } from "react";
import Modal from "@/pages/SignUp/Success/Modal";
import Header from "@/layouts/Header";

function Success() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Header />
      <Wrapper>
        {
          isModalOpen ? <Modal closeModal={closeModal} /> : <></>
        }
        <Image src={success} alt="success"/>
        <h3>가입을 환영합니다!</h3>
        <p>입력해주신 이메일주소로 이메일 인증이 발송되었습니다.</p>
        <p>메일을 확인하여 계정을 활성화해주세요.</p>
        <EmailBox>hihi@gmail.com</EmailBox>
        <span>메일을 받지 못하신 경우, 메일 다시 보내기 버튼을 클릭해주세요</span>
        <ButtonWrapper>
          <LeftButton onClick={openModal}>모달 확인</LeftButton>
          <RightButton />
        </ButtonWrapper>
      </Wrapper>
    </>
  );
}

export default Success;