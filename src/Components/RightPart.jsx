import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
import { useState } from "react";
const RightPart = () => {
  const [openSubscriptionModal,setOpenSubscriptionModal] = useState(false);
  const handleopenSubscriptionModal = () => setOpenSubscriptionModal(true);
  const handleCloseopenSubscriptionModal = () => setOpenSubscriptionModal(false);
  const handleChangeTheme = () => {
    console.log("change");
  };
  return (
    
      <section className="my-5">
        <h1 className="text-xl font-bold">Get Verified</h1>
        <h1 className="font-bold my-2">Subscribe to unlock new Features</h1>
        <Button
        onClick={handleopenSubscriptionModal}
          variant="contained"
          sx={{ padding: "10px", paddingX: "25px", borderRadius: "25px" }}
        >
          Get verified
        </Button>
      </section>
      <section className="mt-7 space-y-5">
        <h1 className="font-bold text-xl py-1">What's happening</h1>
        <div>
          <p className="text-sm">FIFA women's world cup . LIVE</p>
          <p className="font-bold">philipines vs swissterland</p>
        </div>
        <div className="flex justify-between w-full">
          <div>
            <p>Entertaintment . Trending</p>
            <p className="font-bold">#TheMarvels</p>
            <p>34.4K Tweets</p>
          </div>
          <MoreHorizIcon />
        </div>
      </section>
      <section>
        <SubscriptionModal open={openSubscriptionModal} handleClose={handleCloseopenSubscriptionModal}/>
      </section>
    </div>
  );
};

export default RightPart;
