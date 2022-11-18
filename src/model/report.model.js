const fees_receipts = require("../models/feesReceipt");

async function GetReport() {
  // const data = await fees_receipts.find().populate("transaction_id");
  const data = await fees_receipts.aggregate([
    {
      $lookup: {
        from: "fees",
        localField: "fees_id",
        foreignField: "_id",
        as: "fees",
        pipeline: [
          {
            $lookup: {
              from: "academics",
              localField: "_id",
              foreignField: "fees_id",
              as: "academics",
              pipeline: [
                {
                  $lookup: {
                    from: "students",
                    localField: "student_id",
                    foreignField: "_id",
                    as: "students",
                    pipeline: [
                      {
                        $lookup: {
                          from: "basic_infos",
                          localField: "basic_info_id",
                          foreignField: "_id",
                          as: "basic_info",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "transactions",
        localField: "transaction_id",
        foreignField: "_id",
        as: "transaction",
      },
    },
    {
      $lookup: {
        from: "admins",
        localField: "admin_id",
        foreignField: "_id",
        as: "admin",
      },
    },
  ]);

  const current_Date = new Date();
  console.log("Date", current_Date.getDate());
  current_Date.setDate(current_Date.getDate());

  filterData = await data.filter(
    (recipet) => new Date(recipet.date).getTime() < current_Date.getTime()
  );
  console.log(filterData.length);
  filterData.reverse();
  return filterData;
}

module.exports = {
  GetReport,
};
