const express=require("express");
const createListing=require("../controllers/listingController.js");
const verifyToken=require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/", verifyToken, createListing);

module.exports=router;
