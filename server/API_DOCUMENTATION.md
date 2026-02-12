# Backend API Documentation for Frontend Developers

**Base URL:** `http://localhost:5000` (Update for production)

## Integration Flow

1.  **User Checkout**: Frontend collects user details (address, phone, etc.).
2.  **Create Order**: Frontend calls `POST /orders/create-order` with product and user details.
3.  **Razorpay Modal**: Frontend uses the `razorpayOrderId` and `key` from the response to open the Razorpay checkout modal.
4.  **Payment Success**: User completes payment. Razorpay returns `payment_id`, `order_id`, and `signature`.
5.  **Verify Payment**: Frontend immediately calls `POST /orders/verify-payment` with these details to confirm and record the transaction on the backend.

---

## 1. Create Order
**Endpoint:** `POST /orders/create-order`

Call this when the user clicks "Buy Now" or "Checkout".

### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `productId` | Number | Yes | ID of the product. |
| `amount` | Number | Yes | Amount in **Rupees** (e.g., `500` for ₹500). |
| `name` | String | Yes | Customer Name. |
| `phoneNumber`| String | Yes | Customer Phone (Critical for Razorpay). |
| `house` | String | No | Address details. |
| `street` | String | No | Address details. |
| `town` | String | No | Address details. |
| `city` | String | No | Address details. |
| `pincode` | String | No | Address details. |

### Response Example (Success - 201)
```json
{
  "success": true,
  "orderId": 15,             // Local DB Order ID
  "razorpayOrderId": "order_EKwxwAgItmmXdp", // Pass to Razorpay
  "amount": 500,
  "currency": "INR",
  "key": "rzp_test_..."      // Razorpay Key ID
}
```

---

## 2. Verify Payment
**Endpoint:** `POST /orders/verify-payment`

Call this **inside the Razorpay success handler**.

### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `razorpay_order_id` | String | Yes | From Razorpay success object. |
| `razorpay_payment_id` | String | Yes | From Razorpay success object. |
| `razorpay_signature` | String | No | From Razorpay success object. |

### Response Example (Success - 200)
```json
{
  "success": true,
  "message": "Payment verified and transaction recorded"
}
```

---

## Frontend Integration Example (React/JS)

```javascript
const handlePayment = async (product, userDetails) => {
  // 1. Create Order
  const response = await fetch('http://localhost:5000/orders/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: product.id,
      amount: product.price,
      ...userDetails // name, phoneNumber, address fields
    })
  });

  const orderData = await response.json();

  if (!orderData.success) {
    alert('Order creation failed: ' + orderData.error);
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
      const verifyRes = await fetch('http://localhost:5000/orders/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })
      });
      
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        alert('Payment Successful!');
      }
    },
    prefill: {
      name: userDetails.name,
      contact: userDetails.phoneNumber
    },
    theme: { color: "#3399cc" }
  };

  const rzp1 = new window.Razorpay(options);
  rzp1.open();
};
```


PORT=5000
JWT_SECRET="ygukdUK8B5bE3617WU7rJKUw2"
RAZORPAY_KEY_ID="rzp_test_SDIr1wVS2uQGy7"
RAZORPAY_KEY_SECRET="zReZIur7CSIeauTZcZEkHIWUT"