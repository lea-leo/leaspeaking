"use strict";

import express from "express";

var app = express();

import * as twitter from "./twitter";

twitter.streamTwitter();

app.listen(8080, () => {console.log("Express start...");});



