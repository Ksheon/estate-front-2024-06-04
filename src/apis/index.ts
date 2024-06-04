import { AxiosResponse } from "axios";
import ResponseDto from "./response.dto";

// function: Request 처리 함수
export const requestHandler = <T>(response: AxiosResponse<T, any>) => {
    const responseBody = response.data;
    return responseBody;
}

// function: Request Error 처리 함수
export const requestErrorHandler = (error: any) => {
    const responseBody = error.response?.data;
    // 본래 undefined 형태 > 그냥 null로 내보내고 싶어서 추가
    if (!responseBody) return null;
    // responseBody를 ResponseDto형태로 내보냄
    return responseBody as ResponseDto;
}

// function: Authrization Bearer 헤더
export const bearerAuthorization = (accessToken: string) => ({headers: {'Authorization': `Bearer ${accessToken}`}});
