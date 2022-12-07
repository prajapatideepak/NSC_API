const {
  GetReport,
  GetSalaryReport,
  getYearlyReport,
} = require("../../model/report.model");

async function httpGetReport(req, res) {
  try {
    const data = await GetReport();
    return res.status(200).json({
      ok: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: `${error}`,
    });
  }
}

async function httpGetSalaryReport(req, res) {
  try {
    const data = await GetSalaryReport();
    return res.status(200).json({
      ok: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: `${error}`,
    });
  }
}

async function httpGetMonthlyReport(req, res) {
  const section = req.params.section;
  try {
    const data = await getYearlyReport(section);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: `${error}`,
    });
  }
}
module.exports = {
  httpGetReport,
  httpGetMonthlyReport,
  httpGetSalaryReport,
};
