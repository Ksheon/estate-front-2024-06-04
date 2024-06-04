import ResponseDto from "src/apis/response.dto";

// description: 지역 데이터 불러오기 Response Body DTO
export interface GetLocalDataResponseDto extends ResponseDto {
    yearMonth: string[];
    sale: number[];
    lease: number[];
    monthRent: number[];
}

// description: 비율 데이터 불러오기 Response Body DTO
export interface GetRatioDataResponseDto extends ResponseDto {
    yearMonth: string[];

    return40: number[];
    return4060: number[];
    return6085: number[];
    return85: number[];

    leaseRatio40: number[];
    leaseRatio4060: number[];
    leaseRatio6085: number[];
    leaseRatio85: number[];

    monthRentRatio40: number[];
    monthRentRatio4060: number[];
    monthRentRatio6085: number[];
    monthRentRatio85: number[];
}