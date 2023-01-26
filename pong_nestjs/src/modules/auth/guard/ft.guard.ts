import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard, IAuthModuleOptions } from "@nestjs/passport";

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {}