export function getPagination(qs: any) {
  const page = Math.max(parseInt(qs.page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(qs.pageSize) || 10, 1), 100);
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
}
