/**
 * Created by andrew.yang on 3/31/2017.
 */
const express = require('express');
const router = express.Router();
const moment=require('moment');
const promise = require('bluebird');
const options = {
    promiseLib: promise
};
const pgp=require('pg-promise')(options);
<!-- dev -->
const dbSch=pgp("postgres://postgres:postgres@10.1.20.82:5432/postgres");
// const dbTask=dbCon;
// const dbIntranet=dbCon;
<!-- wa -->
// const dbCon=pgp("postgres://postgres:Kilo21Postgre$@10.1.30.47:5432/postgres");
// const dbTask=dbCon;
//const dbSch=pgp("postgres://postgres:Kilo78WasP@59.100.115.27:5432/postgres");
<!-- acc -->
// const dbCon=pgp("postgres://postgres:Kilo21Postgre$@10.1.30.32:5432/postgres");
// const dbTask=pgp("postgres://postgres:Kilo21Postgre$@10.1.30.10:5432/postgres");
// const dbSch=pgp("postgres://postgres:Kilo78WasP@59.100.115.27:5432/postgres");
// const dbIntranet=dbTask;

/*  Created by hans.shi for harden test server */
<!-- harden -->
    //const dbSch=pgp("postgres://postgres:postgres@172.31.1.12:5432/postgres");
/*  finish by hans.shi for harden test server */

router.route('/temperature/list/:region')
    .get((req,res) => {
        let query = `SELECT * FROM temperature.list where region='${req.params.region}' order by oid`;
        let queryALL = `SELECT * FROM temperature.list order by oid`;
        execSql(dbSch,req.params.region === 'all'?queryALL:query,res);
    });
router.route('/temperature/:site/:time')
    .get((req,res) => {
        let query = `SELECT * FROM temperature.${req.params.site} where time>now()-interval '${req.params.time}' order by time`;
        execSql(dbSch,query,res);
    });
router.route('/battery/list/:region')
    .get((req,res) => {
        let query = `SELECT * FROM generator.list where region='${req.params.region}' order by oid`;
        //let queryALL = `SELECT * FROM generator.list order by oid`;
        execSql(dbSch,req.params.region === 'all'?queryALL:query,res);
    });
router.route('/battery/:site/:time')
    .get((req,res) => {
        //let query = `SELECT * FROM generator.${req.params.site} where time>now()-interval '${req.params.time}' order by time`;
        /* created by hans.shi on 27/09/2017 for show data from both bmv table and mppt table*/
        let query = `select * from generator.${req.params.site} as bmv
        inner join generator.${req.params.site}_mppt as mppt
        on date_trunc('minute', bmv.time) = date_trunc('minute', mppt.time) 
        where bmv.time > now() - interval '${req.params.time}' order by bmv.time`;
        /* finish by hans.shi on 27/09/2017 for show data from both bmv table and mppt table*/
        execSql(dbSch,query,res);
    });
router.route('/throughput/list/:region')
    .get((req,res) => {
        let query = `SELECT * FROM asastats.list where region='${req.params.region}' order by oid`;
        let queryALL = `SELECT * FROM asastats.list order by oid`;
        execSql(dbSch,req.params.region === 'all'?queryALL:query,res);
    });
router.route('/throughput/:site/:time')
    .get((req,res) => {
        let query = `SELECT * FROM asastats.${req.params.site} where dumptime>now()-interval '${req.params.time}' order by dumptime`;
        execSql(dbSch,query,res);
    });


execSql = (con,query,res) => {
    con.query(query)
        .then((result) => {
            return res.json(result);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json(error)
        });
};

execResultSql = (con,query,values,res) => {
    con.result(query,values)
        .then(result=>{
            return res.json({
                'success':true,
                'result':result
            })
        })
        .catch(error=>{
            console.error(error);
            return res.json({
                'success':false,
                'result':error
            })
        });
};
sendEmail = ( from,to,subject,html,res ) => {
    transporter.sendMail({
        from,
        to,
        subject,
        html
    },error => {
        console.error(error);
        return res.json({
            'success':false,
            'result':error
        })
    });
};

module.exports = router;