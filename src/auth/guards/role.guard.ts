import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../../common/role.enum.js";
import { Role_key } from "../decorators/roles.decorator.js";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<Role[]>(Role_key, [context.getHandler(), context.getClass])

        if (!roles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user;

        if (!user || !user.role) {
            return false
        }
        return roles.includes(user.role)

    }


}