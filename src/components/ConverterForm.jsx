import React, { useEffect } from "react";
import CurrencySelect from "./CurrencySelect";
import { useState } from "react";

const ConverterForm = () => {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  const getExchageRate = async () => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}&symbols=USD,${fromCurrency},${toCurrency}`;
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Something went wrong!");

      const data = await response.json();

      const usdTofromCurrency = data.rates[fromCurrency];
      const usdTotoCurrency = data.rates[toCurrency];
      if (usdTofromCurrency === undefined || usdTotoCurrency === undefined) {
        console.error(
          "Currency rates are undefined. Check the API response and currency codes."
        );
        return;
      }

      const rate = usdTotoCurrency / usdTofromCurrency;

      const currencyRate = (rate * amount).toFixed(2);

      setResult(`${amount} ${fromCurrency} = ${currencyRate} ${toCurrency}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    getExchageRate();
  };

  useEffect(() => getExchageRate, []);

  return (
    <form onSubmit={handleFormSubmit} className="converter-form">
      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          Enter Amount
        </label>
        <input
          type="number"
          id="amount"
          className="form-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="form-group form-currency-group">
        <div className="form-section">
          <label htmlFor="from" className="form-label">
            From
          </label>
          <CurrencySelect
            selectedCurrency={fromCurrency}
            handleCurrency={(e) => setFromCurrency(e.target.value)}
          />
        </div>
        <div className="swap-icon" onClick={handleSwapCurrencies}>
          <svg
            width="16"
            viewBox="0 0 20 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
              fill="#fff"
            />
          </svg>
        </div>
        <div className="form-section">
          <label htmlFor="from" className="form-label">
            To
          </label>
          <CurrencySelect
            selectedCurrency={toCurrency}
            handleCurrency={(e) => setToCurrency(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className={`${isLoading ? "loading" : ""} submit-button`}
      >
        Get Exchange Rate
      </button>
      <p className="exchange-rate-result">{result}</p>
    </form>
  );
};

export default ConverterForm;
