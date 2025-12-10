import { Injectable } from '@nestjs/common';
import { CwAdminService } from './cw-admin.service';
import { CwClientService } from './cw-client.service';

@Injectable()
export class CwBaseService {
  constructor(
    public readonly admin: CwAdminService,
    public readonly client: CwClientService,
  ) {}
}
