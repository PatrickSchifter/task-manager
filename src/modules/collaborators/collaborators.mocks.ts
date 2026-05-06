import { faker } from '@faker-js/faker'
import { QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto'
import { CollaboratorRole } from 'src/generated/prisma/enums'

export const mockedCollaborators = faker.helpers.multiple(
  () => {
    return {
      id: faker.string.uuid(),
      projectId: faker.string.uuid(),
      userId: faker.string.uuid(),
      role: faker.helpers.arrayElement([
        CollaboratorRole.OWNER,
        CollaboratorRole.EDITOR,
        CollaboratorRole.VIEWER,
      ]),
      createdAt: new Date(),
      user: {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      },
    }
  },
  { count: 10 },
)

export const mockPaginationQuery: QueryPaginationDTO = {
  limit: '10',
  page: '1',
}
