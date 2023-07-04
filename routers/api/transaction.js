const express=require("express");
const router =express.Router();
const bodyParser = require("body-parser")
const key = require("../../setup/keys/tokens.js").TOKEN_KEY;
const helper = require("../../helpers/sessionVerfiy.js")
const transactionController = require("../../Controllers/TransactionController.js")
// @type    GET
//@route    /api/all-transaction
// @desc    starting router
// @access  PRAVITE

router.get("/all-transaction", helper.sessionVerfiy, transactionController.getAllTranscations )

// @type    POST
//@route    /api/transcation/add
// @desc    starting router
// @access  PRAVITE

router.post("/add", helper.sessionVerfiy, transactionController.create )


// @type    DELETE
//@route    /api/transcation/delete
// @desc    starting router
// @access  PRAVITE

router.delete("/delete", helper.sessionVerfiy, transactionController.deleteTranscation )

module.exports = router;