import { useState, useEffect } from "react";
import axiosInstance from "../useAxiosInstance";

const useTransactionData = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/transactions");
        const result = response.data.data || response.data;
        setTransactions(result.transactions || result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, loading, error };
};

export default useTransactionData;
