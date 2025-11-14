import React, { useCallback, useEffect, useRef } from "react";
import styles from "./BottomPager.module.css";

// PUBLIC_INTERFACE
/**
 * BottomPager renders page navigation controls.
 *
 * Props:
 * - totalItems: number of items in the dataset
 * - currentPage: current 1-based page index
 * - pageSize: number of items per page (default 10)
 * - onPageChange: (newPage: number) => void, called when the current page changes
 * 
 * Styling is controlled by BottomPager.module.css and theme CSS variables.
 * Pager is keyboard and ARIA accessible.
 */
interface BottomPagerProps {
  totalItems: number;
  currentPage: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const MAX_PAGE_BTNS = 7;

const BottomPager: React.FC<BottomPagerProps> = ({
  totalItems,
  currentPage,
  pageSize = 10,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagerRef = useRef<HTMLDivElement>(null);

  // Keyboard handler (left/right arrows and focus trap)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Only act if a child of the pager is focused
      if (
        pagerRef.current &&
        pagerRef.current.contains(document.activeElement)
      ) {
        if (e.key === "ArrowRight" && currentPage < totalPages) {
          e.preventDefault();
          onPageChange(currentPage + 1);
        } else if (e.key === "ArrowLeft" && currentPage > 1) {
          e.preventDefault();
          onPageChange(currentPage - 1);
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentPage, totalPages, onPageChange]);

  // Generate array of page numbers to display (ellipses as needed)
  const makePageBtns = useCallback(() => {
    if (totalPages <= MAX_PAGE_BTNS) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage > totalPages - 4) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div
      className={styles.pager}
      ref={pagerRef}
      role="navigation"
      aria-label="Note pages navigation"
    >
      <button
        className={styles.pagerBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        tabIndex={0}
      >
        ←
      </button>
      {makePageBtns().map((btn, idx) => {
        if (typeof btn === "string") {
          return (
            <span className={styles.ellipsis} key={`ellipsis${idx}`} aria-hidden>
              …
            </span>
          );
        }
        const selected = btn === currentPage;
        return (
          <button
            key={btn}
            className={`${styles.pagerBtn} ${selected ? styles.selected : ""}`}
            aria-label={
              selected ? `Page ${btn}, current page` : `Go to page ${btn}`
            }
            aria-current={selected ? "page" : undefined}
            tabIndex={0}
            disabled={selected}
            onClick={() => btn !== currentPage && onPageChange(Number(btn))}
          >
            {btn}
          </button>
        );
      })}
      <button
        className={styles.pagerBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        tabIndex={0}
      >
        →
      </button>
    </div>
  );
};

export default BottomPager;
