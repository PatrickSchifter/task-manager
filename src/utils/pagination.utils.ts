import { NotFoundException } from '@nestjs/common'
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query.pagination.dto'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_LIMIT = 10

export const paginate = (query?: QueryPaginationDTO): { skip: number; take: number } => {
  const limit = Math.abs(Number(query?.limit ?? DEFAULT_PAGE_LIMIT))

  const page = Math.abs(Number(query?.page ?? DEFAULT_PAGE_NUMBER))

  return { skip: limit * (page - 1), take: limit }
}

export const paginateOutput = <T>({
  data,
  total,
  query,
}: {
  data: T[]
  total: number
  query?: QueryPaginationDTO
}): PaginatedResponseDTO<T> => {
  const page = Math.abs(Number(query?.page ?? DEFAULT_PAGE_NUMBER))
  const limit = Math.abs(Number(query?.limit ?? DEFAULT_PAGE_LIMIT))

  const lastPage = Math.max(1, Math.ceil(total / limit))

  if (page > lastPage)
    throw new NotFoundException(`Page ${page} not found. Last page is ${lastPage}`)

  if (!data.length)
    return {
      data,
      meta: {
        total,
        currentPage: page,
        lastPage,
        nextPage: null,
        prevPage: null,
        totalPerPage: limit,
      },
    }

  return {
    data,
    meta: {
      currentPage: page,
      lastPage,
      nextPage: page < lastPage ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      total,
      totalPerPage: limit,
    },
  }
}
