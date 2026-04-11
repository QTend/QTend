const { default: mongoose,  } = require("mongoose");

const connection = {};

export const connectToDB = async () => {
    try {
        //checking if connection exist so to avoid reconnection everytime we start our application
        if(connection.isConnected){
            console.log("Using exisiting connection")
            return;
        }
        const db =  await mongoose.connect(process.env.MONGO_URL);
        //update connection if it is not empty use te existing one
        connection.isConnected = db.connections[0].readyState;
      } catch (error) {
        console.log(error, 'Erro error');
        throw new Error(error)
      }
}
