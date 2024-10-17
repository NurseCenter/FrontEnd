import ModalContainer from '@/components/ModalContainer';
import ModalCloseArea from '@/components/ModalCloseArea';

import close from '@/assets/icons/etc/close.svg';
import alert from '@/assets/icons/etc/warn.svg';

import {
  ModalWrapper,
  ContentsWrapper,
  ModalCloseButton,
  AlertImgBox,
  WarningMessage,
  InformationMessage,
  NoticeMessage,
  ConfirmButton,
} from '@/pages/Admin/Modals/DeleteModal/style';

import { deletePosts } from '@/api/adminApi';

export default function DeleteModal({
  ItemReset,
  selectedIds,
  deleteItemLength,
  handleModalClose,
}) {
  const handleItemDelete = async () => {
    console.log('dd');
    /*     try {
      await deletePosts(selectedIds);
      ItemReset();
    } catch (error) {
      console.error(error);
    } */
  };

  return (
    <ModalContainer>
      <ModalWrapper>
        <ContentsWrapper>
          <ModalCloseButton onClick={handleModalClose}>
            <img src={close} alt='modal-close-button' />
          </ModalCloseButton>
          <AlertImgBox>
            <img src={alert} alt='warn' />
          </AlertImgBox>
          <WarningMessage>정말 삭제를 하시겠습니까?</WarningMessage>
          <InformationMessage>
            총 {deleteItemLength}개의 게시글이 삭제될 예정입니다
          </InformationMessage>
          <NoticeMessage>
            삭제된 게시물은 영구적으로 삭제되며, <br />
            복구는 불가능 합니다
          </NoticeMessage>
        </ContentsWrapper>
        <ConfirmButton type='button' onClick={handleItemDelete}>
          삭제하기
        </ConfirmButton>
      </ModalWrapper>
      <ModalCloseArea handleModalClose={handleModalClose} />
    </ModalContainer>
  );
}
