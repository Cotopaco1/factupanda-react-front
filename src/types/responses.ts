import type { LaravelErrors } from "./errors";

export type ApiResponse<T> = {
    message : string;
    data : T;
    success : boolean;
}

export type ApiErrorResponse = {
    message : string;
    errors ?: LaravelErrors
}