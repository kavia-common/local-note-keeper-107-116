export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function slicePage<T>(items: T[], currentPage: number, pageSize: number): T[] {
  const start = (currentPage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getPageParam(): number {
  const url = new URL(window.location.href);
  const p = parseInt(url.searchParams.get("page") || "", 10);
  return !isNaN(p) && p > 0 ? p : 1;
}

export function setPageParam(page: number): void {
  const url = new URL(window.location.href);
  url.searchParams.set("page", `${page}`);
  window.history.replaceState({}, "", url.toString());
}

const PAGE_LS_KEY = "lnk_current_page";

export function loadPageFromStorage(): number {
  const stored = localStorage.getItem(PAGE_LS_KEY);
  const num = stored ? parseInt(stored, 10) : 1;
  return !isNaN(num) && num > 0 ? num : 1;
}

export function savePageToStorage(page: number): void {
  localStorage.setItem(PAGE_LS_KEY, page.toString());
}
