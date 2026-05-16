export interface IErrorGeneralResp {
  error: IErrorResp;
  headers: any;
  message: string;
  name: string;
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
}

export interface IErrorResp {
  type:             string;
  title:            string;
  status:           number;
  detail:           string;
  instance:         string;
  errorCode:        string;
  timestamp:        Date;
  validationErrors: any;
}

