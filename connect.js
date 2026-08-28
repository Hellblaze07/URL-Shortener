const mongoose=require('mongoose');

async function establishDatabaseConnection(connectionString)
{
    return mongoose.connect(connectionString);
}

module.exports={establishDatabaseConnection};