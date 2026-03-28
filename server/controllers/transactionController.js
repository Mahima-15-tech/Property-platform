const Investment = require("../models/investment");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Investment.find()
      .populate("userId", "name")
      .populate("propertyId", "name")
      .sort({ createdAt: -1 });

      const data = transactions.map((tx) => ({
        id: `TX-${tx._id.toString().slice(-4)}`, // display
mongoId: tx._id, 
        investor: tx.userId?.name,
        property: tx.propertyId?.name,
        amount: `₹${tx.amount}`,
        date: new Date(tx.createdAt).toLocaleDateString(),
        time: new Date(tx.createdAt).toLocaleTimeString(),
        status: tx.status,
        method: tx.method,
      }));  

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      const tx = await Investment.findById(req.params.id);
  
      if (!tx) {
        return res.status(404).json({ message: "Transaction not found" });
      }
  
      tx.status = status;
      await tx.save();
  
      res.json({
        message: `Transaction ${status}`,
        tx,
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };