export const handlePayment = async (
  product,
  userDetails,
  onSuccess,
  onError,
) => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  try {
    // 1. Create Order
    const response = await fetch(`${BACKEND_URL}/orders/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        amount: product.price, // Ensure this is the total amount (e.g. price * qty)
        name: userDetails.name,
        phoneNumber: userDetails.phoneNumber,
        house: userDetails.house || "",
        street: userDetails.street || "",
        town: userDetails.town || "",
        city: userDetails.city || "",
        pincode: userDetails.pincode || "",
        items: product.items || [], // Send items if available
      }),
    });

    const orderData = await response.json();

    if (!orderData.success) {
      if (onError) onError(orderData.error || "Order creation failed");
      else alert("Order creation failed: " + orderData.error);
      return;
    }

    // 2. Open Razorpay
    const options = {
      key: orderData.key,
      amount: orderData.amount * 100, // Amount is in paise here (handled by backend usually, but check)
      currency: orderData.currency,
      name: "GlosMax Store",
      description: "Purchase " + product.name,
      order_id: orderData.razorpayOrderId,
      handler: async function (response) {
        // 3. Verify Payment on Success
        try {
          const verifyRes = await fetch(
            `${BACKEND_URL}/orders/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            },
          );

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            if (onSuccess) onSuccess(verifyData);
            else alert("Payment Successful!");
          } else {
            if (onError)
              onError(verifyData.error || "Payment Verification Failed");
            else alert("Payment Verification Failed: " + verifyData.error);
          }
        } catch (err) {
          if (onError) onError("Verification Network Error");
          else console.error(err);
        }
      },
      prefill: {
        name: userDetails.name,
        contact: userDetails.phoneNumber,
        email: userDetails.email, // Added email if available
      },
      theme: { color: "#dc2626" }, // Brand Red
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  } catch (error) {
    if (onError) onError(error.message || "Payment initiation failed");
    else console.error("Payment Error:", error);
  }
};
