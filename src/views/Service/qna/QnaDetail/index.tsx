import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useUserStore } from 'src/stores'
import { deleteBoardRequest, getBoardRequest, increaseViewCountRequest, postCommentRequest } from 'src/apis/board';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router';
import ResponseDto from 'src/apis/response.dto';
import { AUTH_ABSOULUTE_PATH, QNA_DETAIL_ABSOLUTE_PATH, QNA_LIST_ABSOLUTE_PATH, QNA_UPDATE_ABSOLUTE_PATH } from 'src/constant';
import { GetBoardResponseDto } from 'src/apis/board/dto/response';
import { PostCommentRequestDto } from 'src/apis/board/dto/request';

//                  component                   //
export default function QnaDetail() {

    //                  state                   //
    const [cookies] = useCookies();
    const {receptionNumber} = useParams();

    const {loginUserId, loginUserRole} = useUserStore();
    const [title, setTitle] = useState<string>('');
    const [writerId, setWriterId] = useState<string>('');
    const [writeDate, setWriteDate] = useState<string>('');
    const [viewCount, setViewCount] = useState<number>(0);
    const [contents, setContents] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false)
    const [comment, setComment] = useState<string | null>(null);
    const [commentRows, setCommentRows] = useState<number>(1);

    //                  function                  //
    const navigator = useNavigate();

    const increaViewCountResponse = (result: ResponseDto | null) => {
        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 접수번호입니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'NB' ? '존재하지 않는 접수번호 입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') {
                navigator(AUTH_ABSOULUTE_PATH);
                return;
            }
            navigator(QNA_LIST_ABSOLUTE_PATH);
            return;
        }

        if (!cookies.accessToken || !receptionNumber) return;
        getBoardRequest(receptionNumber, cookies.accessToken)
            .then(getBoardResponse);
    }

    const getBoardResponse = (result: GetBoardResponseDto | ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '잘못된 접수번호입니다.' :
            result.code === 'AF' ? '인증에 실패했습니다.' :
            result.code === 'NB' ? '존재하지 않는 접수번호 입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

        if (!result || result.code !== 'SU') {
            alert(message);
            if (result?.code === 'AF') {
                navigator(AUTH_ABSOULUTE_PATH);
                return;
            }
            navigator(QNA_LIST_ABSOLUTE_PATH);
            return;
        }

        const {title, status, writerId, writeDatetime, viewCount, contents, comment} = result as GetBoardResponseDto;
        setTitle(title);
        setStatus(status);
        setWriterId(writerId);
        setWriteDate(writeDatetime);
        setViewCount(viewCount);
        setContents(contents);
        setComment(comment);
    }

    const postCommentResonse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'VF' ? '입력된 데이터가 옳지 않습니다.' :
            result.code === 'AF' ? '권한이 없습니다.' :
            result.code === 'NB' ? '존재하지 않는 게시물입니다.' :
            result.code === 'WC' ? '이미 답변이 작성된 게시물입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }

        if (!receptionNumber || !cookies.accessToken) return;
        getBoardRequest(receptionNumber, cookies.accessToken).then(getBoardResponse);
    }

    const deleteBoardResponse = (result: ResponseDto | null) => {

        const message = 
            !result ? '서버에 문제가 있습니다.' :
            result.code === 'AF' ? '권한이 없습니다.' : 
            result.code === 'VF' ? '올바르지 않은 접수번호 입니다.' :
            result.code === 'NB' ? '존재하지 않는 게시물 입니다.' :
            result.code === 'DBE' ? '서버에 문제가 있습니다.' : ''

        if (!result || result.code !== 'SU') {
            alert(message);
            return;
        }
        
        navigator(QNA_LIST_ABSOLUTE_PATH);

    }

    //                  event handler                    //
    const onCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {

        if (status || loginUserRole !== 'ROLE_ADMIN') return;
        
        const comment = event.target.value;
        setComment(comment);

        // if (!commentRef.current) return;
        // commentRef.current.style.height = 'auto';
        // commentRef.current.style.height = `${commentRef.current.scrollHeight}px`
        const commentRows = comment.split('\n').length;
        setCommentRows(commentRows);
    }

    const onCommentSubmitClickHandler = () => {
        
        if (!comment || !comment.trim() || loginUserRole !== 'ROLE_ADMIN' || !cookies.accessToken) return;
        if (!receptionNumber) return;
        
        const requestBody: PostCommentRequestDto = {comment};
        postCommentRequest(receptionNumber, requestBody, cookies.accessToken).then(postCommentResonse);
    }
    
    const onListClickHandler = () => {
        navigator(QNA_LIST_ABSOLUTE_PATH);
    }

    const onUpdateClickHandler = () => {
        if(!receptionNumber || loginUserId !== writerId || status) return;
        navigator(QNA_UPDATE_ABSOLUTE_PATH(receptionNumber));
    }

    const onDeleteClickHandler = () => {
        if(!receptionNumber || loginUserId !== writerId || !cookies.accessToken) return;
        const isConfirm = window.confirm('정말로 삭제하시겠습니까?');
        if (!isConfirm) return;

        deleteBoardRequest(receptionNumber, cookies.accessToken).then(deleteBoardResponse);
    }

    //                  effect                  //
    useEffect(() => {
        if (!cookies.accessToken || !receptionNumber) return;

        increaseViewCountRequest(receptionNumber, cookies.accessToken).then(increaViewCountResponse);
    }, [])
    
    //                  render                  //
    // 아이디 첫글자만 표시
    const coverWriterId = writerId !== '' && (writerId[0] + '*'.repeat(writerId.length - 1));
    return (
        <div id='qna-detail-wrapper'>
            <div className='qna-detail-main-box'>
                <div className='qna-detail-top-box'>
                    <div className='qna-detail-title-box'>{title}</div>
                    <div className='qna-detail-info-box'>
                        <div className='qna-datil-info'>작성자 {coverWriterId}</div>
                        <div className='qna-datil-info-divider'>{'\|'}</div>
                        <div className='qna-datil-info'>작성일 {writeDate}</div>
                        <div className='qna-datil-info-divider'>{'\|'}</div>
                        <div className='qna-datil-info'>조회수 {viewCount}</div>
                    </div>
                </div>
                <div className='qna-detail-contents-box'>{contents}</div>
            </div>
            {loginUserRole === 'ROLE_ADMIN' && !status &&
            <div className='qna-detail-comment-write-box'>
                <div className='qna-datil-comment-text-area-box'>
                    <textarea style={{height: `${28 * commentRows}px`}} value={comment === null ? '' : comment} onChange={onCommentChangeHandler} placeholder='답글을 작성해 주세요.' className='qna-detail-textarea'></textarea>
                </div>
                <div className='primary-button' onClick={onCommentSubmitClickHandler}>답글달기</div>
            </div>
            }
            {status &&    
            <div className='qna-detail-comment-box'>
                <div className='primary-bedge'>답변</div>
                <div className='qna-detail-comment'>{comment}</div>
            </div>
            }

            <div className='qna-detail-button-box'>
                <div className='primary-button' onClick={onListClickHandler}>목록 보기</div>

                {loginUserId === writerId && loginUserRole === 'ROLE_USER' &&
                <div className='qna-detail-owner-button-box'>
                    {!status && <div className='second-button' onClick={onUpdateClickHandler}>수정</div>}
                    <div className='error-button' onClick={onDeleteClickHandler}>삭제</div>
                </div>
                }
            </div>
        </div>
    )
}
