const express=require("express");
const {createListing,getNearbyListings,getAllListings,getListingById}=require("../controllers/listingController.js");
const verifyToken=require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", verifyToken, createListing);
router.get("/near",verifyToken,getNearbyListings);
router.get("/all", verifyToken, getAllListings); 
router.get("/:id", verifyToken, getListingById);
module.exports=router;
