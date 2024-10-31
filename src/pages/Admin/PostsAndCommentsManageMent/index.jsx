import { useState, useEffect, useRef } from 'react';
import uuid from 'react-uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TitleSection from '@/pages/Admin/TitleSection';
import ArrLengthSection from '@/pages/Admin/ArrLengthSection';
import ArrLengthView from '@/pages/Admin/ArrLengthView';
import SearchInput from '@/pages/Admin/SearchInput';
import TableWrapper from '@/pages/Admin/TableDesign/TableWrapper';
import TableHeaderRow from '@/pages/Admin/TableDesign/TableHeaderRow';
import TableBodyRow from '@/pages/Admin/TableDesign/TableBodyRow';
import PaginationWrapper from '@/pages/Admin/PaginationWrapper';
import Pagination from '@/components/Pagination';
import DeleteModal from '@/pages/Admin/Modals/DeleteModal';
import PostOrCommentDetailModal from '@/pages/Admin/Modals/PostOrCommentDetailModal';
import AlignSelectMenu from '@/components/AlignSelectMenu';

import deleteDefault from '@/assets/icons/trush/trush_default.svg';
import deleteSelected from '@/assets/icons/trush/trush_selected.svg';
import checkThick from '@/assets/icons/check/check_thick.svg';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons';

import {
  TableTopArea,
  PostDeleteButton,
  PostDeletetSelectButton,
  TableRowSelectWrapper,
  CommentLength,
} from '@/pages/Admin/PostsAndCommentsManageMent/style';
import {
  TitleCategory,
  DummyClickBox,
} from '@/pages/Admin/ReportHistory/style';
import { SearchBox, ResetButton } from '@/pages/Admin/MemberManagement/style';

import {
  postManagementHeaderColumns,
  commentManagementHeaderColumns,
} from '@/pages/Admin/data';

import useEventHandler from '@/hooks/useEventHandler';
import useFetchAndPaginate from '@/hooks/useFetchAndPaginate';
import useModalsControl from '@/hooks/useModalsControl';

import {
  adminPagePostsSearchTypes,
  adminPageCommentsSearchTypes,
} from '@/components/AlignSelectMenu/data';

import {
  getPostsOrSearchPosts,
  getCommentsOrReplyComments,
} from '@/api/adminApi';

import { communityPostMaxLimit, pageViewLimit } from '@/utils/itemLimit';
import { formatDateToPost } from '@/utils/dateFormatting';
import { errorAlert } from '@/utils/sweetAlert';
import { isOnlyWhiteSpaceCheck } from '@/utils/whiteSpaceCheck';

export default function PostsAndCommentsManageMent() {
  const debounceRef = useRef(null);

  const {
    items: tableItems,
    totalItems,
    currentPageNumber,
    groupedPageNumbers: pageNumbers,
    setItems: setTableItems,
    getDataAndSetPageNumbers: getTableItemsAndSetPageNumbers,
    setCurrentPageNumber,
    handlePageNumberClick,
    handlePrevPageClick,
    handleNextPageClick,
  } = useFetchAndPaginate({
    defaultPageNumber: 1,
    itemMaxLimit: communityPostMaxLimit,
    pageViewLimit,
  });
  const {
    isItemDeleteModal,
    isPostOrCommentDetailModal,
    handleModalOpen,
    handleModalClose,
  } = useModalsControl();
  const {
    changeValue: isDeleteButtonActive,
    handleChange: handleDeleteButtonActiveChange,
  } = useEventHandler({
    changeDefaultValue: false,
  });

  const [headerColumns, setHeaderColumns] = useState(
    postManagementHeaderColumns
  );
  const [query, setQuery] = useState({
    page: currentPageNumber,
    limit: communityPostMaxLimit,
    withReplies: true,
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionType, setActionType] = useState('');
  const [detailModalInfo, setDetailModalInfo] = useState({});
  const [searchTypes, setSearchTypes] = useState(adminPagePostsSearchTypes);
  const [selectedSearchType, setSelectedSearchType] = useState(
    adminPagePostsSearchTypes[0].label
  );
  const [selectedSearchTypeQuery, setSelectedSearchTypeQuery] = useState(
    adminPagePostsSearchTypes[0].query
  );

  const { changeValue: searchValue, handleChange: handleSearchValueChange } =
    useEventHandler({
      changeDefaultValue: '',
    });
  const {
    changeValue: curActiveCategory,
    handleChange: handleActiveCategoryChange,
  } = useEventHandler({
    changeDefaultValue: '게시글',
  });

  const handleDeleteSelectStateChange = ({
    selectItemIdx,
    selectId,
    commentType,
  }) => {
    // 클릭x => 클릭o
    //1) delete select on
    //2) 배열에 [postId] 추가

    //클릭o => 클릭 x

    //1) delete select off
    //2) 배열에 [postId] 있는지 검사 (some, include) => 있을시 제거

    //선택한 요소 토글
    const changeFnc = (arr) => {
      return arr.map((item, idx) => {
        return {
          ...item,
          deleteSelectState:
            selectItemIdx === idx
              ? !item.deleteSelectState
              : item.deleteSelectState,
        };
      });
    };
    //선택한 요소 id 토글
    setSelectedIds((prev) => {
      const selectedIdIndex =
        curActiveCategory === '게시글'
          ? prev.findIndex((selectedId) => selectedId === selectId)
          : prev.findIndex((list) => list.commentId === selectId);

      //-1이면 어차피 뒤쪽꺼 실행되어서 상관없음

      if (selectedIdIndex > -1) {
        //splice하면서 return하면 splice한 값만 배열에 남게 되고 그게 반환 됨.
        //원본 배열에 splice작업을 거친 뒤 원본 배열을 반환해야함.
        // splice return -> splice한 요소를 반환,
        // arr.splice() -> return arr splice하고 남은 arr요소를 반환
        const arr = [...prev];
        arr.splice(selectedIdIndex, 1);
        return arr;
      } else {
        return [
          ...prev,
          curActiveCategory === '게시글'
            ? selectId
            : { type: commentType, commentId: selectId },
        ];
      }
    });
    setTableItems((prev) => changeFnc(prev));
  };

  const handleDeleteSelectStateReset = () => {
    const resetFnc = (arr) => {
      return arr.map((item) => {
        return {
          ...item,
          deleteSelectState: false,
        };
      });
    };
    setTableItems((prev) => resetFnc(prev));
    setSelectedIds([]);
  };

  const boardTypeFormatting = (boardType) => {
    const boardTypes = {
      theory: '이론정보',
      practice: '실습정보',
      exam: '국가고시준비',
      job: '취업정보',
      employment: '구인구직',
      event: '이벤트',
      notice: '공지사항',
    };

    return boardTypes[boardType];
  };

  const handleItemDeleteButtonClick = () => {
    if (!isDeleteButtonActive) {
      handleDeleteButtonActiveChange(true);
      return;
    }

    if (selectedIds.length === 0) {
      errorAlert('리스트를 선택 하셔야 삭제가 가능합니다!');
    } else if (selectedIds.length > 0) {
      handleModalOpen({ modalName: 'isItemDeleteModal' });
    }
  };

  const checkCurrentCategory = (currentQuery) => {
    if (curActiveCategory === '게시글') {
      currentQuery.withReplies = true;
    }

    return currentQuery;
  };

  const searchTypeReset = () => {
    if (curActiveCategory === '게시글') {
      setSelectedSearchType(adminPagePostsSearchTypes[0].label);
      setSelectedSearchTypeQuery(adminPagePostsSearchTypes[0].query);
      setSearchTypes(adminPagePostsSearchTypes);
    } else if (curActiveCategory === '댓글') {
      setSelectedSearchType(adminPageCommentsSearchTypes[0].label);
      setSelectedSearchTypeQuery(adminPageCommentsSearchTypes[0].query);
      setSearchTypes(adminPageCommentsSearchTypes);
    }
  };

  const stateReset = () => {
    setActionType('');
    setCurrentPageNumber(1);
    searchTypeReset();
    handleSearchValueChange('');
    setSelectedIds([]);
  };

  const updateChangedQueries = () => {
    setQuery((prev) => {
      return {
        ...prev,
        ...checkCurrentCategory({
          page: currentPageNumber,
          limit: communityPostMaxLimit,
        }),
      };
    });
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      if (isOnlyWhiteSpaceCheck(searchValue)) {
        errorAlert('검색어를 입력 해주세요!');
        return;
      }

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setActionType('');
        setCurrentPageNumber(1);

        setQuery(
          checkCurrentCategory({
            page: 1,
            limit: communityPostMaxLimit,
            type: selectedSearchTypeQuery,
            search: searchValue,
          })
        );
      }, 100);
    }
  };

  const checkIsSelected = ({ listId, commentId }) => {
    if (curActiveCategory === '게시글') {
      return selectedIds.some((selectedId) => selectedId === listId);
    } else if (curActiveCategory === '댓글') {
      return selectedIds.some((list) => list.commentId === commentId);
    }
  };

  const setItemProperties = (item) => {
    if (curActiveCategory === '게시글') {
      return {
        itemId: item.postId,
        boardType: item.boardType,
        itemTitleOrContent: item.title,
        nickname: item.author,
        deleteSelectState: checkIsSelected({ listId: item.postId }),
      };
    } else {
      return {
        itemId: item.id,
        boardType: item.category,
        itemTitleOrContent: item.content,
        nickname: item.nickname,
        deleteSelectState: checkIsSelected({ commentId: item.id }),
      };
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (actionType === 'pageMove') {
      window.scroll({ top: 0, left: 0 });
      updateChangedQueries();
    }
  }, [currentPageNumber]);

  useEffect(() => {
    if (curActiveCategory === '게시글') {
      setHeaderColumns(postManagementHeaderColumns);
    } else if (curActiveCategory === '댓글') {
      setHeaderColumns(commentManagementHeaderColumns);
    }

    searchTypeReset();
    stateReset();
    window.scroll({ top: 0, left: 0 });
    setQuery(checkCurrentCategory({ page: 1, limit: communityPostMaxLimit }));

    //setTimeout제거
    clearTimeout(debounceRef.current);
    debounceRef.current = null;
  }, [curActiveCategory]);

  useEffect(() => {
    (async () => {
      await getTableItemsAndSetPageNumbers(() => {
        return curActiveCategory === '게시글'
          ? getPostsOrSearchPosts(query)
          : getCommentsOrReplyComments(query);
      });

      setTableItems((prev) => {
        //key값 다르면 렌더링할때 undfiend => 바뀐값 이런식으로 나옴
        //key를 통일시켜서 tablelist 값이 바껴도 그전값 -> 바뀐값으로 표기하자.
        return prev.map((item) => {
          //console.log(item);
          const {
            itemId,
            boardType,
            nickname,
            itemTitleOrContent,
            deleteSelectState,
          } = setItemProperties(item);
          return {
            ...item,
            itemId,
            boardType,
            nickname,
            itemTitleOrContent,
            deleteSelectState,
          };
        });
      });
    })();
  }, [query]);

  useEffect(() => {
    console.log(tableItems);
  }, [tableItems]);

  return (
    <>
      {isItemDeleteModal && (
        <DeleteModal
          deleteItemLength={selectedIds.length}
          currentActiveCategory={curActiveCategory}
          selectedIds={selectedIds}
          stateReset={stateReset}
          updateChangedQueries={updateChangedQueries}
          handleModalClose={() => {
            handleModalClose({ modalName: 'isItemDeleteModal' });
          }}
        />
      )}
      {isPostOrCommentDetailModal && (
        <PostOrCommentDetailModal
          currentActiveCategory={curActiveCategory}
          detailModalInfo={detailModalInfo}
          handleModalClose={() => {
            handleModalClose({ modalName: 'isPostOrCommentDetailModal' });
          }}
        />
      )}
      <TitleSection>
        <TitleCategory
          $currenntActiveCategory={curActiveCategory}
          $ownCategory={'게시글'}
          onClick={() => {
            handleActiveCategoryChange('게시글');
          }}
        >
          게시글
        </TitleCategory>
        <TitleCategory
          $currenntActiveCategory={curActiveCategory}
          $ownCategory={'댓글'}
          onClick={() => {
            handleActiveCategoryChange('댓글');
          }}
        >
          댓글
        </TitleCategory>
      </TitleSection>
      <TableTopArea>
        <ArrLengthSection>
          <ArrLengthView length={totalItems} />
          <SearchBox>
            <AlignSelectMenu
              optionList={searchTypes}
              pageType={'admin'}
              selectedOption={selectedSearchType}
              setSelectedOption={setSelectedSearchType}
              handleSelectedOption={setSelectedSearchTypeQuery}
            />
            <SearchInput
              searchValue={searchValue}
              handleSearchValueChange={handleSearchValueChange}
              handleSearch={handleSearch}
            />
            <ResetButton
              onClick={() => {
                stateReset();
                setQuery(
                  checkCurrentCategory({
                    page: 1,
                    limit: communityPostMaxLimit,
                  })
                );
              }}
            >
              <FontAwesomeIcon icon={faUndoAlt} />
            </ResetButton>
          </SearchBox>
        </ArrLengthSection>
        <div>
          <PostDeleteButton
            onClick={handleItemDeleteButtonClick}
            $isDeleteButtonActive={isDeleteButtonActive}
          >
            <img
              src={isDeleteButtonActive ? deleteSelected : deleteDefault}
              alt={'post-delete-button'}
            />
            삭제
          </PostDeleteButton>
          {isDeleteButtonActive && (
            <PostDeleteButton
              onClick={() => {
                handleDeleteButtonActiveChange(false);
                handleDeleteSelectStateReset();
              }}
            >
              취소
            </PostDeleteButton>
          )}
        </div>
      </TableTopArea>
      <TableWrapper>
        <table>
          <thead>
            <TableHeaderRow currentActiveTab={'게시물 관리'}>
              {headerColumns?.map((data) => {
                return <th key={uuid()}>{data.header}</th>;
              })}
            </TableHeaderRow>
          </thead>
          <tbody>
            {tableItems?.map((item, idx) => {
              return (
                <TableBodyRow key={uuid()} currentActiveTab={'게시물 관리'}>
                  <td>{String(item.itemId).padStart(2, '0')}</td>
                  <td>{boardTypeFormatting(item.boardType)}</td>
                  <td>
                    {item.itemTitleOrContent}
                    {item.numberOfCommentsAndReplies &&
                      item.numberOfCommentsAndReplies > 0 && (
                        <CommentLength>
                          {`[${item.numberOfCommentsAndReplies}]`}
                        </CommentLength>
                      )}
                  </td>
                  <td>{item.nickname}</td>
                  <td>
                    {formatDateToPost({ date: item.createdAt })}
                    {isDeleteButtonActive && (
                      <PostDeletetSelectButton
                        $isSelected={item.deleteSelectState}
                      >
                        <img src={checkThick} alt={'post-delete-check'} />
                      </PostDeletetSelectButton>
                    )}
                  </td>
                  {isDeleteButtonActive && (
                    <TableRowSelectWrapper
                      onClick={() => {
                        handleDeleteSelectStateChange({
                          selectItemIdx: idx,
                          selectId: item.itemId,
                          commentType: item.type,
                        });
                      }}
                    />
                  )}
                  <DummyClickBox
                    onClick={() => {
                      setDetailModalInfo({
                        creator: item.nickname,
                        createDate: formatDateToPost({ date: item.createdAt }),
                        boardType: item.boardType,
                        itemId: item.itemId,
                        titleOrContent: item.itemTitleOrContent,
                        navLink: `/community/${item.boardType}/post/${item.postId}`,
                      });
                      handleModalOpen({
                        modalName: 'isPostOrCommentDetailModal',
                      });
                    }}
                  />
                </TableBodyRow>
              );
            })}
          </tbody>
        </table>
      </TableWrapper>
      {pageNumbers?.length > 0 && (
        <PaginationWrapper>
          <Pagination
            pageNumbers={pageNumbers}
            currentPageNumber={currentPageNumber}
            setActionType={setActionType}
            handlePageNumberClick={handlePageNumberClick}
            handlePrevPageClick={handlePrevPageClick}
            handleNextPageClick={handleNextPageClick}
          />
        </PaginationWrapper>
      )}
    </>
  );
}
