import { CanActivate, Injectable, SetMetadata, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const admin = request.user;
    const hasScope = () => admin.role.some((role) => role.includes(role));
    return admin && admin.role && hasScope();
  }
}