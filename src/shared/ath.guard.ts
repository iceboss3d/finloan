import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { apiResponse } from 'src/helpers/apiResponse';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.authorization) {
            return false;
        }
        request.user = await this.validateToken(request.headers.authorization);
        

        return true;
    }

    async validateToken(auth: string) {
        return new Promise((res, rej) => {
            if (auth.split(' ')[0] !== 'Bearer') {
                rej(apiResponse.unauthorizedResponse('Invalid Token'))
            }

            const token = auth.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
                if (err) {
                    const message = err.message;
                    rej(apiResponse.unauthorizedResponse(message));
                }
                const roles = ["super-admin", "admin", "lineManager", "manager"];
                
                if (!roles.find(role => role === decoded.role)) {                    
                    rej(apiResponse.unauthorizedResponse("Unauthorized"));
                }
                res(decoded);
            });
        })
    }
}