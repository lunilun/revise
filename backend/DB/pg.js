const Pool = require('pg').Pool;

var msg;

const pool = new Pool({
    user: "userName",
    password: "userPassword",
    database: "Database", 
    host: "localhost",
    port: 5432
});

// //세이브
exports.Save = async function(req) {
    try {
        const sname = req.body.name;
        const sposx = req.body.posx;
        const sposy = req.body.posy;
        const sposz = req.body.posz;
  
        await pool.query(`update revisedata set posx=${sposx}, posy=${sposy},posz=${sposz} where objname='${sname}';`);
        msg='save';
        return msg;
    }catch(err){
        return "error";
    }
}
// //로드
exports.Load = async function() {
    try {
        const loadItems = await pool.query(`select * from revisedata`);
        return ({data:loadItems.rows});
    }catch(err){
        console.log(err);
    }
}

exports.uLoad = async function() {
    try{
        const loadItems = await pool.query(`select * from revisedata`);
        return loadItems.rows;
    }catch(err){
        console.log(err);
    }
}