import ResponseDto from "src/apis/response.dto";

// description : 로그인 Response Body Dto
export interface SignInResponseDto extends ResponseDto {
    accessToken: string;
    expires: number;
}