import mysql from 'mysql';

const connection = mysql.createConnection({
    host: '1.117.60.190',
    user: 'root',
    password: 'w1470671730',
    database: 'landslide_identification_platform'
});

connection.connect((err) => {
    if (err) {
        console.error('error connection: ' + err.stack);
        return;
    }
    console.log('connection as id ' + connection.threadId);
});

export { connection }
