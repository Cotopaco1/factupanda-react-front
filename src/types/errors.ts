export type LaravelErrors = Record<string, string[]>
export type LaravelValidationError = {
    message : string;
    errors : LaravelErrors
}
