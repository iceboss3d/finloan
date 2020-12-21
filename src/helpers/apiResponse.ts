import { HttpException, HttpStatus } from "@nestjs/common";

const apiResponse = {
    successResponse: (msg: string) => {
        const data: Object = {
            status: true,
            message: msg
        }
        return new HttpException(data, HttpStatus.ACCEPTED);
    },
    successResponseWithData: (msg: string, data: Object) => {
        const resData = {
            message: msg,
            data
        }
        return new HttpException(resData, HttpStatus.OK);
    },
    notFoundResponse: (msg: string) => {
        const data: Object = {
            status: false,
            message: msg
        }
        return new HttpException(data, HttpStatus.NOT_FOUND);
    },
    errorResponse: (msg: string) => {
        const data: Object = {
            status: false,
            message: msg
        }
        return new HttpException(data, HttpStatus.BAD_REQUEST);
    },
    unauthorizedResponse: (msg: string) => {
        const data: Object = {
            status: false,
            message: msg
        }
        return new HttpException(data, HttpStatus.UNAUTHORIZED);
    },
    existingResponse: (msg: string) => {
        const data: Object = {
            status: false,
            message: msg
        }
        return new HttpException(data, HttpStatus.CONFLICT);
    },
    validationError: (msg: string, errors: any[]) => {
        const data: Object = {
            status: false,
            message: msg,
            errors
        }
        return new HttpException(data, HttpStatus.BAD_REQUEST);
    },
}
export {apiResponse};