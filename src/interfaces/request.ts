import { Request } from "express";

export interface IRequest extends Request {
  client: any;
  id: string;
  transaction: any;
  language: string;
  fileValidationError: any;
  user: any;
}
