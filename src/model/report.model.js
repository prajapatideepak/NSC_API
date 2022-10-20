const fees_receipts = require("../models/feesReceipt");

async function GetReport() {
  const data = await fees_receipts.find().populate("transaction_id");

  const current_Date = new Date();
  current_Date.setDate(current_Date.getDate() - 1);
  console.log(current_Date);

  filterData = await data.filter((recipet) => recipet.date > current_Date);

  return filterData;
}

module.exports = {
  GetReport,
};
