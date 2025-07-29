// /src/daos/mongo/utils/getNextNumber.js


  export async function getNextNumber(model) {
    const lastDoc = await model.findOne().sort({ num: -1 }).select("num");
    return lastDoc && typeof lastDoc.num === "number" ? lastDoc.num + 1 : 1;
  }
