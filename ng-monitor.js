/**
 * Created by andrew.yang on 5/31/2017.
 */
const express = require('express');
const path=require('path');
const app=express();
app.use('/api',require('./routes/api'));
app.use('/',express.static(__dirname+'/dist'));
app.use("/temperature", (req, res)=> {
    res.sendFile(path.resolve(__dirname + '/dist/index.html'));
});
app.use("/battery", (req, res)=> {
    res.sendFile(path.resolve(__dirname + '/dist/index.html'));
});
app.use("/throughput", (req, res)=> {
    res.sendFile(path.resolve(__dirname + '/dist/index.html'));
});
const PORT = process.env.PORT || 4000;
app.listen(PORT,function(){
    //console.log('Running Intranet on port 4000');
    console.log('Running Intranet on port ' + PORT);
});