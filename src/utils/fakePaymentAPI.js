

export const simulateGCashPayment = async (amount) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Randomly simulate success or failure
        const isSuccess = Math.random() > 0.3; // 70% success rate
        if (isSuccess) {
          resolve({
            status: "success",
            message: "Payment successfully processed using GCash",
            amount,
          });
        } else {
          reject({
            status: "failed",
            message: "Payment failed using GCash",
          });
        }
      }, 2000); // Simulate a 2-second delay
    });
  };
  