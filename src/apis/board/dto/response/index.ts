import ResponseDto from "src/apis/response.dto";
import { BoardListItem } from "src/types";

export interface GetBoardListResponseDto extends ResponseDto{
    boardList: BoardListItem[];
}

export interface GetSearchBoardListResponseDto extends ResponseDto{
    boardList: BoardListItem[];
}

export interface GetBoardResponseDto extends ResponseDto{
    receptionNumber: number;
    status: boolean;
    title: string;
    writerId: string;
    writeDatetime: string;
    contents: string;
    viewCount: number;
    // comment?: string 으로 표현할 시 comment값이 존재하지 않을 수 있음(undefined)
    comment: string | null;
}