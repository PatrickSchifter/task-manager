import { SetMetadata } from '@nestjs/common'
import { VALIDATE_RESOURCES_IDS } from 'src/consts'

export const ValidateResourcesIds = (...args: string[]) => SetMetadata(VALIDATE_RESOURCES_IDS, args)
