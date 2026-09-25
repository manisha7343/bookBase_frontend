import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";

// Keeps track of which books the signed-in user already has,
// and borrows a book when asked. Used by Catalog, Search and Book Details.
export default function useBorrow() {
  const showToast = useToast();
  const [activeLoans, setActiveLoans] = useState([]);
  const [busyBookId, setBusyBookId] = useState(null);

  const loadLoans = useCallback(() => {
    api("/borrowings/my-books")
      .then((data) => setActiveLoans(data.borrowings))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const loanFor = (bookId) => activeLoans.find((loan) => loan.bookId?._id === bookId);

  // Returns the updated borrowing, or null if it failed
  const borrow = async (book) => {
    setBusyBookId(book._id);
    try {
      const data = await api("/borrowings/borrow", { method: "POST", body: { bookId: book._id } });
      setActiveLoans((loans) => [...loans, data.borrowing]);
      showToast(`Borrowed "${book.title}". Please return it by the due date.`);
      return data.borrowing;
    } catch (err) {
      showToast(err.message, "error");
      return null;
    } finally {
      setBusyBookId(null);
    }
  };

  return { loanFor, borrow, busyBookId, reload: loadLoans };
}
