import { useDispatch } from 'react-redux';

import ModalContainer from '@/components/ModalContainer';
import ModalCloseArea from '@/components/ModalCloseArea';

import searchIcon from '@/assets/icons/search/search_black.svg';
import cross from '@/assets/icons/etc/close.svg';

import {
  ModalWrapper,
  ModalInnerLeftBox,
  SearchInputArea,
  SearchListBox,
  SearchList,
  HospitalName,
  HospitalLocationInfo,
  HospitalContact,
  ModalInnerRightBox,
  ModalCloseButton,
} from '@/pages/CreateCommunityPost/HospitalSearchModal/style';

import { setIsHospitalModal } from '@/store/modalsControl';

export default function HospitalSearchModal({ SetHospitalName }) {
  const dispatch = useDispatch();

  return (
    <ModalContainer>
      <ModalWrapper>
        <ModalCloseButton
          type='button'
          onClick={() => {
            dispatch(setIsHospitalModal(false));
          }}
        >
          <img src={cross} alt='close-button' />
        </ModalCloseButton>
        <ModalInnerLeftBox>
          <h2>병원찾기</h2>
          <SearchInputArea>
            <input placeholder='병원을 입력하세요.' maxLength={35} />
            <img src={searchIcon} alt='search-icon' />
          </SearchInputArea>
          <SearchListBox>
            <SearchList>
              <HospitalName>강남세브란스 병원</HospitalName>
              <HospitalLocationInfo>
                <p>서울 강남구 언주로 211 / 도곡동 146-92</p>
                <p>06273</p>
              </HospitalLocationInfo>
              <HospitalContact>1599-6114</HospitalContact>
            </SearchList>
          </SearchListBox>
        </ModalInnerLeftBox>
        <ModalInnerRightBox></ModalInnerRightBox>
      </ModalWrapper>
      <ModalCloseArea
        handleModalClose={() => {
          dispatch(setIsHospitalModal(false));
        }}
      />
    </ModalContainer>
  );
}
