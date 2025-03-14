export interface ResponseBase<T> {
    errors: Object;
    isValidResponse: boolean;
    result: T;
}

export interface PageResult<T> {
    results: T[];
    pageSize: number;
    currentPage: number;
    rowCount: number;
    pageCount: number;
    firstRowOnPage: number;
    lastRowOnPage: number;
}
