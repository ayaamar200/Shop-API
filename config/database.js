
// @desc   Database connection setup using Mongoose
import { connect } from "mongoose"; 
const dbConnection = () => {
  connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);
    })

};

export default dbConnection;
