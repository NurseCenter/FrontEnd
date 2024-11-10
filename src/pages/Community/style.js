import styled from 'styled-components';

import { primaryColorBoxStyle } from '@/styles/commonStyle/box';
import { postsHeaderStyle } from '@/styles/commonStyle/etc';
import { paginationWrapperStyle } from '@/styles/commonStyle/wrapper';
import {
  small_500,
  small_600,
  large_500,
} from '@/styles/commonStyle/localTextStyle';
import { centerAlignStyle } from '@/styles/commonStyle/etc';

const ContentsAlignBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const PostCreateButton = styled.button`
  ${primaryColorBoxStyle}
  ${small_600}
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 135px;
  height: 40px;
  padding: 5px 12px;
  > img {
    width: 24px;
    height: 24px;
  }
`;

const Wrapper = styled.div`
  width: 1042px;
  margin: 0 auto;
  table {
    width: 100%;

    > tbody {
      height: ${({ height }) => height};
    }
  }
`;

const TableHeader = styled.tr`
  ${postsHeaderStyle}
  ${small_500}
  display: flex;
  align-items: center;
  padding: 15px 20px 15px;
  text-align: left;
  > th:nth-child(1) {
    flex: 0 0 8.5rem;
  }
  > th:nth-child(2) {
    flex: 0 0 50rem;
  }
  > th:nth-child(3) {
    flex: 0 0 10rem;
  }
  > th:nth-child(4) {
    flex: 0 0 14.5rem;
  }
`;

const PageWrapper = styled.section`
  ${paginationWrapperStyle}
  margin: 50px auto 95px;
`;

const NoSearchResults = styled.p`
  ${centerAlignStyle}
  ${large_500}
  
  padding: 150px 0;
`;

export {
  ContentsAlignBox,
  PostCreateButton,
  TableWrapper,
  TableHeader,
  PageWrapper,
  NoSearchResults,
};
