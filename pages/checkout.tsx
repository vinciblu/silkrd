import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { saveShippingInfo } from "../store/checkout-slice"

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const shippingInfo = useSelector((state: RootState) => state.checkout.shippingInfo);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  // Add more shipping fields as needed

  const handleOrder = () => {
    const shippingData = {
      name,
      address,
      // Include other shipping fields here
    };
    dispatch(saveShippingInfo(shippingData));
  };

  return (
    <div>
      <h1>Checkout Page</h1>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {/* Add more shipping fields here */}
      <button onClick={handleOrder}>Place Order</button>
      <div>
        <h2>Shipping Information</h2>
        <p>Name: {shippingInfo.name}</p>
        <p>Address: {shippingInfo.address}</p>
        {/* Display other shipping fields here */}
      </div>
    </div>
  );
};

export default CheckoutPage;
