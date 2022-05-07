import MongoClient from "mongodb";

export default class SessionRepository {
    session(session) {

        MongoClient.MongoClient.connect(process.env.DBHOST, (err, client) => {
            if (err) throw err

            const db = client.db(process.env.DBNAME)

            db.collection("user-session").insertOne(session, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
            });


            //add to user collection if not exist
            let query = {userId: session.id};
            let newRecord = {$set: {userId: session.id}};

            db.collection("user").updateOne(query, newRecord, {upsert:true}, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
            });
        })
    }
}
