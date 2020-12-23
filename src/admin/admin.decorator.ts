import { createParamDecorator, ExecutionContext } from "@nestjs/common"
export const Admin = createParamDecorator((data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return data ? req.user[data] : req.user
})