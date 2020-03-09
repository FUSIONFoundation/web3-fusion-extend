if ( !process.env.DB_CONNECT_STRING ) {
    console.log("NO ENVIRONMENT VAR DB CONNECT STRING SPECIFIED (DB_CONNECT_STRING")
    process.exit(1)
}

var dbConnect = JSON.parse(process.env.DB_CONNECT_STRING.replace(/'/g, '"'));
var _pool;
var _masterConnection;

var mysql = require("promise-mysql");

async function keepSQLAlive() {
    _isDBConnected = false;
    _pool = await mysql.createPool(
        Object.assign({ multipleStatements: true }, dbConnect)
    );

    _pool
        .getConnection()
        .then(conn => {
            conn.release()
            // console.log(rows)
            _isDBConnected = true;
            console.log("Databsase connected!");
            return { success: true };
        })
        .catch(err => {
            console.error(
                "connect to database failed, trying again in five seconds",
                err
            );
            setTimeout(() => {
                keepSQLAlive();
            }, 5000);
        });
}

keepSQLAlive()

exports.getConnection = function() {
    return _pool.getConnection().then(conn => {
        return conn
    }).catch( (e) => {
        console.log("error getting connection ", e )
        throw e
    })
}
