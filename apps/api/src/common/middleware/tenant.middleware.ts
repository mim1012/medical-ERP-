import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request & { user?: { organizationId?: string }; organizationId?: string }, res: Response, next: NextFunction): void {
    if (req.user?.organizationId) {
      req.organizationId = req.user.organizationId
    }
    next()
  }
}
