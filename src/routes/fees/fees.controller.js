const { getFeesAndStudentData } = require("../../model/fees.model");

async function httpGetFeesData(req, res) {
  const search = req.params.search;

  if (!search) {
    return res.status(400).json({
      ok: false,
      error: "Invalid Parameter",
    });
  }
    try {
      const data = await getFeesAndStudentData(search);
      res.status(200).json({
        ok: true,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: `error : ${error}`,
      });
    }
  }


module.exports = {
  httpGetFeesData,
};
