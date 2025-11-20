const express=require("express");
const {createListing,getNearbyListings,getAllListings,getListingById,getMyListings,updateListing,deleteListing}=require("../controllers/listingController.js");
const verifyToken=require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", verifyToken, createListing);
router.get("/near",verifyToken,getNearbyListings);
router.get("/all", verifyToken, getAllListings); 
router.get("/my-listings", verifyToken, getMyListings);
router.get("/:id", verifyToken, getListingById);
router.put("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

module.exports=router;
