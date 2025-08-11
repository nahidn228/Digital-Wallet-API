export interface TErrorSources {
  path: string;
  message: string;
}
export interface TErrorSourcesResponse {
  statusCode: number;
  message: string;
  error: TErrorSources[];
}
