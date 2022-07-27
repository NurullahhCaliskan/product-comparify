import MongoClient from 'mongodb';
import { collections } from '../database.config.js';
import _ from 'lodash';
import MailValidator from '../validate/mailValidator.js';

export default class SessionRepository {
    async saveSession(client, session) {
        let mailValidator = new MailValidator();

        let query = { id: client.id };
        let newRecord = { $set: client };

        await collections.storeModel
            .updateOne(query, newRecord, { upsert: true })
            .then((r) => r)
            .catch((e) => e);

        if (_.has(session, ['onlineAccessInfo', 'associated_user'])) {
            let user = session.onlineAccessInfo.associated_user;
            let userQuery = { storeId: client.id, id: user.id };

            user.storeId = client.id;
            let newUserRecord = { $set: user };

            await collections.storeUserModel
                .updateOne(userQuery, newUserRecord, { upsert: true })
                .then((r) => r)
                .catch((e) => e);
        }

        await collections.userSessionModel
            .insertOne(session)
            .then((r) => r)
            .catch((e) => e);

        //set default mail
        let storeQuery = { id: client.id };
        const options = { projection: { _id: 1, id: 1, selectedMail: 1 } };
        let store = await collections.storeModel.findOne(storeQuery, options);

        if (!store.selectedMail) {
            if (client.customer_email) {
                try {
                    mailValidator.checkValidShopifyUrl(client.customer_email);

                    store.selectedMail = client.customer_email;

                    let storeQuery = { $set: store };

                    await collections.storeModel
                        .updateOne(query, storeQuery, { upsert: true })
                        .then((r) => r)
                        .catch((e) => e);
                } catch (e) {}
            } else if (_.has(session, ['onlineAccessInfo', 'associated_user'])) {
                let user = session.onlineAccessInfo.associated_user;
                let userQuery = { id: user.id };

                let userFromDb = await collections.storeUserModel.findOne(userQuery);

                if (userFromDb.email) {
                    try {
                        mailValidator.checkValidShopifyUrl(userFromDb.email);

                        store.selectedMail = userFromDb.email;

                        let storeQuery = { $set: store };
                        await collections.storeModel
                            .updateOne(query, storeQuery, { upsert: true })
                            .then((r) => r)
                            .catch((e) => e);
                    } catch (e) {}
                }
            }
        }
    }
}
