import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useState } from "react";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useSelector } from "react-redux";  // or import your own state management hook
import { API_BASE_URL } from "../../Config/api";  // Make sure to configure this URL

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

const paymentModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  textAlign: "center",
};

export default function SubscriptionModal({ open, handleClose }) {
  const [plan, setPlan] = useState("Annually");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); // Success or error message
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false); // For showing payment result modal
  const { auth } = useSelector((state) => state);  // Access the authentication state from Redux
  const userId = auth?.user?.id; 

  const features = [
    "Prioritized rankings in conversation and search.",
    "See approximately twice as many Tweets between ads in your For you and Following timelines.",
    "Add bold and italic text in your Tweets.",
    "Post longer videos and 1080p video uploads.",
    "All the existing Blue features, including Edit tweet, Bookmark Folders, and early access to new features."
  ];

  const handleSubmitPayment = () => {
    setIsProcessing(true);

    // Perform simple checks (Card, Expiry Date, and CVC)
    if (cardNumber.length !== 16) {
      setPaymentStatus("Invalid Card Number! It should be 16 digits.");
      setIsProcessing(false);
      setPaymentModalOpen(true);
      return;
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      setPaymentStatus("Invalid Expiry Date! Please check MM/YY format.");
      setIsProcessing(false);
      setPaymentModalOpen(true);
      return;
    }
    if (cvc.length !== 3) {
      setPaymentStatus("Invalid CVC! It should be 3 digits.");
      setIsProcessing(false);
      setPaymentModalOpen(true);
      return;
    }

    // Send payment request to backend
    const paymentData = {
      userId: userId,
      amount: plan === "Annually" ? 6800 : 800,  // Amount based on selected plan
    };

    // Send payment data in the body as JSON
    fetch(`${API_BASE_URL}/api/payment/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData), // Send the data in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "Payment successful!") {
          setPaymentStatus("Payment Successful! Your account has been verified.");
        } else {
          setPaymentStatus("Payment failed, try again.");
        }
        setIsProcessing(false);
        setPaymentModalOpen(true);
      })
      .catch((error) => {
        setPaymentStatus("An error occurred, please try again.");
        setIsProcessing(false);
        setPaymentModalOpen(true);
      });
  };

  const handleChangePlan = (planType) => {
    setPlan(planType);
  };

  const price = plan === "Annually" ? "LKR 6,800/year" : "LKR 800/month";
  const originalPrice = "LKR 7,800";

  return (
    <div>
      {/* Main Subscription Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex items-center justify-between pb-4 border-b">
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>

            <Button type="submit" variant="contained" onClick={handleSubmitPayment}>
              Save
            </Button>
          </div>
          <div className="flex justify-center py-10">
            <div className="w-[80%] space-y-10">
              <div className="p-5 rounded-md flex items-center justify-between shadow-lg bg-gray-300">
                <h1 className="text-xl pr-5">
                  Blue subscribers with a verified phone number will get a blue checkmark once approved.
                </h1>
                <img
                  src="https://abs.twimg.com/responsive-web/client-web/verification-card-v2@3x.8ebee01a.png"
                  alt="Verification Image"
                  className="w-24 h-24"
                />
              </div>
              <div className="flex justify-between border rounded-full px-5 py-3 border-gray-500">
                <div>
                  <span
                    onClick={() => handleChangePlan("Annually")}
                    className={`${plan === "Annually" ? "text-black" : "text-gray-400"} cursor-pointer`}
                  >
                    Annually
                  </span>
                  <span className="text-green-500 text-sm ml-5">Save 12%</span>
                </div>
                <p
                  onClick={() => handleChangePlan("Monthly")}
                  className={`${plan === "Monthly" ? "text-black" : "text-gray-400"} cursor-pointer`}
                >
                  Monthly
                </p>
              </div>
              <div className="space-y-3">
                {features.map((item, i) => (
                  <div key={i} className="flex items-center space-x-5">
                    <FiberManualRecordIcon sx={{ width: "7px", height: "7px" }} />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>
              <div
                className="cursor-pointer flex justify-center bg-gray-900 text-white rounded-full px-5 py-3"
                onClick={() => setPaymentModalOpen(true)}
              >
                <span className="line-through italic">{originalPrice}</span>
                <span className="px-5">{price}</span>
              </div>

              {/* Payment Form (Hidden initially, triggered by button click) */}
              <Modal
                open={isPaymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                aria-labelledby="payment-form-modal"
                aria-describedby="modal-for-card-payment"
              >
                <Box sx={paymentModalStyle}>
                  <Typography variant="h6" component="h2">
                    Enter Your Card Details
                  </Typography>
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full p-3 border rounded-md mt-4"
                    maxLength={16}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="flex space-x-4 mt-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-1/2 p-3 border rounded-md"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-1/2 p-3 border rounded-md"
                      maxLength={3}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSubmitPayment}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: "20px" }}
                  >
                    {isProcessing ? "Processing..." : "Submit Payment"}
                  </Button>
                </Box>
              </Modal>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Payment Status Modal (Success/Failure) */}
      <Modal
        open={isPaymentModalOpen && paymentStatus !== ""}
        onClose={() => setPaymentModalOpen(false)}
        aria-labelledby="payment-status-modal"
      >
        <Box sx={paymentModalStyle}>
          <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
            {paymentStatus}
          </Typography>
          <Button
            onClick={() => setPaymentModalOpen(false)}
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}