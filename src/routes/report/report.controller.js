const { GetReport } = require("../../model/report.model");

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

module.exports = {
  httpGetReport,
};
