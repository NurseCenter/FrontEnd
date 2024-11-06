import DOMPurify from 'dompurify';

import Eye from '@/components/Icons/Eye';
import HeartInactive from '@/components/Icons/HeartInactive';

import CommentLength from '@/components/CommentLength';

import {
  TableRow,
  PostNumberBox,
  PostTitleBox,
  PostNicknameBox,
  PostIconBox,
  PostDateBox,
} from '@/pages/Community/CommunityPost/style';

export default function CommunityPost({
  number,
  title,
  nickname,
  createDate,
  likeCount,
  searchKeyword,
  postViewCount,
  numberOfCommentsAndReplies,
  handlePostClick,
}) {
  return (
    <TableRow onClick={handlePostClick}>
      <PostNumberBox>{number}</PostNumberBox>
      <PostTitleBox>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(title),
          }}
        ></p>
        {numberOfCommentsAndReplies && (
          <CommentLength>{numberOfCommentsAndReplies}</CommentLength>
        )}
      </PostTitleBox>
      <PostNicknameBox>{nickname}</PostNicknameBox>
      <PostDateBox>{createDate}</PostDateBox>
      <PostIconBox>
        <Eye postViewCount={postViewCount} />
        <HeartInactive likeCount={likeCount} />
      </PostIconBox>
    </TableRow>
  );
}
