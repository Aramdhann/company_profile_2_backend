require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect();

app.get("/", (req, res) => {
  return res.json("This is from the backend side");
});

app.get("/event", (req, res) => {
  const sql = "SELECT * FROM event ORDER BY Date DESC";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    return res.json(results);
  });
});

app.get("/tkb", (req, res) => {
  const sql = "SELECT tkb_value FROM tkb ORDER BY id DESC LIMIT 1;";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    const responseData = {
      tkb: results[0].tkb_value,
    };
    return res.json(responseData);
  });
});

app.get("/detail-bisnis", (req, res) => {
  const sql =
    "SELECT loan_total, loan_current, loan_outstanding, total_individu_borrower, total_institution_borrower, detail_individu_borrower_active, detail_institution_borrower_active, active_account,data_created FROM db_office.detail_bisnis ORDER BY id DESC LIMIT 1;";

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const responseData = {
      loanTotal: results[0].loan_total,
      loanCurrent: results[0].loan_current,
      loanOutstanding: results[0].loan_outstanding,
      totalIndividuBorrower: results[0].total_individu_borrower,
      totalInstitutionBorrower: results[0].total_institution_borrower,
      detailIndividuBorrowerActive: results[0].detail_individu_borrower_active,
      detailInstitutionBorrowerActive:
        results[0].detail_institution_borrower_active,
      activeAccount: results[0].active_account,
      dataCreated: results[0].data_created,
    };
    return res.json(responseData);
  });
});

app.get("/finance", (req, res) => {
  const sql =
    "SELECT a.total_tidak_lancar AS assetTotalTidakLancar, a.total_lancar AS assetTotalLancar, " +
    "l.total_tidak_lancar AS liabilitasTotalTidakLancar, l.total_lancar AS liabilitasTotalLancar, " +
    "e.total AS ekuitasTotal, d.data_created, d.status " +
    "FROM asset AS a " +
    "JOIN liabilitas AS l ON a.data_created_id = l.data_created_id " +
    "JOIN ekuitas AS e ON a.data_created_id = e.data_created_id " +
    "JOIN date_financial_report AS d ON a.data_created_id = d.id " +
    "ORDER BY a.id DESC LIMIT 1;";

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const responseData = {
      assetTotalTidakLancar: results[0].assetTotalTidakLancar,
      assetTotalLancar: results[0].assetTotalLancar,
      liabilitasTotalTidakLancar: results[0].liabilitasTotalTidakLancar,
      liabilitasTotalLancar: results[0].liabilitasTotalLancar,
      ekuitasTotal: results[0].ekuitasTotal,
      dataCreated: results[0].data_created,
      status: results[0].status,
    };
    return res.json(responseData);
  });
});

app.get("/comprehensif", (req, res) => {
  const sql =
    "SELECT i.total AS incomeTotal, oe.total AS operatingExpenseTotal, " +
    "oi.total AS otherIncomeTotal, cp.total AS compreProfitTotal, " +
    "d.data_created, d.status " +
    "FROM income AS i " +
    "JOIN operating_expense AS oe ON i.data_created_id = oe.data_created_id " +
    "JOIN other_income AS oi ON i.data_created_id = oi.data_created_id " +
    "JOIN compre_profit AS cp ON i.data_created_id = cp.data_created_id " +
    "JOIN date_comprehensif_income AS d ON i.data_created_id = d.id " +
    "ORDER BY i.id DESC LIMIT 1;";

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const responseData = {
      incomeTotal: results[0].incomeTotal,
      operatingExpenseTotal: results[0].operatingExpenseTotal,
      otherIncomeTotal: results[0].otherIncomeTotal,
      compreProfitTotal: results[0].compreProfitTotal,
      dataCreated: results[0].data_created,
      status: results[0].status,
    };
    return res.json(responseData);
  });
});

app.get("/opini-audit", (req, res) => {
  const sql =
    "SELECT data_created, status FROM opini_audit ORDER BY id DESC LIMIT 1";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const responseData = {
      dataCreated: results[0].data_created,
      status: results[0].status,
    };
    return res.json(responseData);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
