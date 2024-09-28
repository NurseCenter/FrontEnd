import { useState, useEffect } from 'react';
import uuid from 'react-uuid';

import CommunityPost from '@/pages/Community/CommunityPost';
import CommunityBanner from '@/components/CommunityBanner';
import CommunityBannerText from '@/components/CommunityBannerText';
import Pagination from '@/components/Pagination';
import AlignSelectMenu from '@/components/AlignSelectMenu';

import brush from '@/assets/icons/etc/brush.svg';

import {
  ContentsAlignBox,
  PostCreateButton,
  TableWrapper,
  TableHeader,
  PageWrapper,
} from '@/pages/Community/style';

import { alignSelectOptions } from '@/pages/Community/data';

import useFetchAndPaginate from '@/hooks/useFetchAndPaginate';
import useSelectorList from '@/hooks/useSelectorList';

import { getPosts } from '@/api/postApi';

import { formatDateToPost } from '@/utils/dateFormatting';
import { communityPostMaxLimit } from '@/utils/itemLimit';
import { pageViewLimit } from '@/utils/itemLimit';

export default function Community() {
  const {
    items: currentPosts,
    currentPageNumber,
    groupedPageNumbers: pageNumbers,
    getDataAndSetPageNumbers,
    handlePageNumberClick,
    handlePrevPageClick,
    handleNextPageClick,
    resetPageNumber,
  } = useFetchAndPaginate({
    defaultPageNumber: 1,
    itemMaxLimit: communityPostMaxLimit,
    pageViewLimit: pageViewLimit,
  });

  const { currentBoardType } = useSelectorList();

  const [optionList] = useState(alignSelectOptions);
  const [selectedOption, setSelectedOption] = useState(
    alignSelectOptions[0].label
  );
  const [query, setQuery] = useState({
    page: currentPageNumber,
    limit: communityPostMaxLimit,
  });
  const handleSelectedOption = ({ ...optionalQuery }) => {
    setQuery({
      page: currentPageNumber,
      limit: communityPostMaxLimit,
      ...optionalQuery,
    });
  };

  useEffect(() => {
    resetPageNumber();
    setSelectedOption(alignSelectOptions[0].label);
  }, [currentBoardType]);

  useEffect(() => {
    setQuery((prev) => {
      return {
        ...prev,
        page: currentPageNumber,
      };
    });
  }, [currentPageNumber]);

  useEffect(() => {
    //console.log(query);
    getDataAndSetPageNumbers(() => getPosts(currentBoardType, query));
  }, [query, currentBoardType]);

  return (
    <>
      <CommunityBanner>
        <CommunityBannerText />
      </CommunityBanner>
      <TableWrapper>
        <ContentsAlignBox>
          <PostCreateButton to='/community/create-community-post'>
            <img src={brush} alt='create-button' />
            게시글 작성
          </PostCreateButton>
          <AlignSelectMenu
            optionList={optionList}
            handleSelectedOption={handleSelectedOption}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </ContentsAlignBox>
        <table>
          <thead>
            <TableHeader>
              <th>
                <p>번호</p>
                <p>제목</p>
              </th>
              <th>
                <p>닉네임/날짜/조회수/좋아요 수</p>
              </th>
            </TableHeader>
          </thead>
          <tbody>
            {currentPosts?.map((post, idx) => {
              return (
                <CommunityPost
                  key={uuid()}
                  number={String(post.postId).padStart(2, '0')}
                  title={post.title}
                  nickname={post.user.nickname}
                  createDate={formatDateToPost(post.createdAt)}
                  postViewCount={parseInt(post.viewCounts, 10)}
                  likeCount={parseInt(post.likeCounts, 10)}
                  numberOfCommentsAndReplies={parseInt(
                    post.numberOfCommentsAndReplies,
                    10
                  )}
                />
              );
            })}
          </tbody>
        </table>
      </TableWrapper>
      <PageWrapper>
        <Pagination
          pageNumbers={pageNumbers}
          currentPageNumber={currentPageNumber}
          handlePageNumberClick={handlePageNumberClick}
          handlePrevPageClick={handlePrevPageClick}
          handleNextPageClick={handleNextPageClick}
        />
      </PageWrapper>
    </>
  );
}
