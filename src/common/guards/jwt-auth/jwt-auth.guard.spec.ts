import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { JwtAuthGuard } from './jwt-auth.guard'

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard(new RequestContextService())).toBeDefined()
  })
})
