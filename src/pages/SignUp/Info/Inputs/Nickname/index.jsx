import Positive from '@/components/Instruction/Positive';
import Instruction from '@/components/Instruction';
import InputSection from '@/pages/SignUp/components/InputSection';
import DefaultInput from '@/pages/SignUp/components/DefaultInput';
import Negative from '@/components/Instruction/Negative';
import { useState } from 'react';

function Nickname({ setAllow }) {
  const [nickname, setNickname] = useState('');
  const [nicknameValid, setNicknameValid] = useState(false);

  const handleNickname = (e) => {
    const value = e.target.value;
    setNickname(value);

    const regex = /^[a-zA-Z가-힣]{2,8}$/;
    const state = value.length >= 2 && regex.test(value);

    setNicknameValid(state);
    setAllow((prev) => {
      const newAllow = [...prev];
      newAllow[0] = state;
      return newAllow;
    });
  };

  return (
    <InputSection $margin='10px' title='닉네임*'>
      <DefaultInput
        placeholder='닉네임을 입력해주세요'
        onChange={handleNickname}
        value={nickname}
      />
      {nickname.length > 0 && nicknameValid ? (
        <Positive text='사용가능한 닉네임입니다' />
      ) : nickname.length > 0 ? (
        <>
          <Instruction text='*중복되지않는 한글 또는 영문 2-8자를 입력해주세요' />
          <Instruction text='*숫자 및 특수문자 불가' />
          <Negative text='사용할 수 없는 닉네임입니다' />
        </>
      ) : (
        <>
          <Instruction text='*중복되지않는 한글 또는 영문 2-8자를 입력해주세요' />
          <Instruction text='*숫자 및 특수문자 불가' />
        </>
      )}
    </InputSection>
  );
}

export default Nickname;
