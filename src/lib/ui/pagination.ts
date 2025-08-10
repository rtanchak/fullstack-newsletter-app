const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export function parsePaginationParams(
  params?: {
    page?: string | string[];
    limit?: string | string[];
  },
  defaultLimit: number = DEFAULT_LIMIT,
  maxLimit: number = MAX_LIMIT
) {
  const pageParam = Array.isArray(params?.page) ? params?.page[0] : params?.page;
  const limitParam = Array.isArray(params?.limit) ? params?.limit[0] : params?.limit;

  const parsedPage = Number(pageParam);
  const parsedLimit = Number(limitParam);
  
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limitUnclamped = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : defaultLimit;
  const currentLimit = Math.min(maxLimit, limitUnclamped);
  
  const calculateTotalPages = (totalItems: number) => Math.ceil(totalItems / currentLimit);

  return {
    page: currentPage,
    limit: currentLimit,
    calculateTotalPages,
  };
}
