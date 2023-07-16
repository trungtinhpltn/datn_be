import { Cache } from "cache-manager";
import { Injectable, Logger, NestMiddleware,CACHE_MANAGER, Inject, HttpException, HttpStatus } from "@nestjs/common";

import { NextFunction, Request, Response } from "express";

@Injectable()
export class SignInRateLimit implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  private logger = new Logger("HTTP");

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { ip, body } = request;
    const key = ip.concat(body.username);
    let numberOfReq: number
    try {
      numberOfReq = await this.cacheManager.get(key) || 0
      if(numberOfReq >= 5){
        throw new HttpException("Bạn đã nhập sai quá 5 lần, vui lòng đợi 5p", HttpStatus.TOO_MANY_REQUESTS);
      }
      
    } catch (error) {
      throw error
    }
    response.on("close", async () => {
      const { statusCode } = response;
      if(statusCode === 200){
        await this.cacheManager.del(key)
      }else{
        await this.cacheManager.set(key, numberOfReq + 1)
      }
    });

    next();
  }
}
