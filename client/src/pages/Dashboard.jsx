import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const history = useHistory();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  const populateQuote = async () => {
    try {
      const res = await axios.get("http://localhost:4001/api/quote", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });

      console.log(res);
      setQuote(res.data.quote);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        localStorage.removeItem("token");
        history.replace("/login");
      } else {
        populateQuote();
      }
    }
  }, []);

  const addQuote = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4001/api/quote",
        { quote: tempQuote },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      console.log(res);
      setQuote(tempQuote);
      setTempQuote("")
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{quote || "No quote Found"}</p>

      <form onSubmit={addQuote}>
        <input
          type="text"
          placeholder="Enter your Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <input type="submit" value="Add Quote" />
      </form>
    </div>
  );
};

export default Dashboard;
