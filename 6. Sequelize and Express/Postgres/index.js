const express = require('express');
const models = require('./src/models/index').models
    , sequelize = require('./src/models/index').sequelize;
const routes = require('./src/routes/index');

const app = express();
// additional Express stuff: middleware, routes, ...

app.use(async (req, res, next) => {
    req.context = {
        models,
        me: await models.User.findByLogin('adrian3ka'),
    };
    next();
});

const eraseDatabaseOnSync = true;

sequelize.sync({force: eraseDatabaseOnSync}).then(async () => {
    createUsersWithMessages();
    app.listen(process.env.PORT, () =>
        console.log(`Example app listening on port ${process.env.PORT}!`),
    );
});

app.use('/me', function (req, res) {
    return res.send(req.context.me);
});

app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);


const createUsersWithMessages = async () => {
    console.log("-------------------createUsersWithMessages---------------------")
    await models.User.create(
        {
            username: 'adrian3ka',
            email: 'eekkaaadrian@gmail.com',
            messages: [
                {
                    text: 'Published the Road to learn React',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );
    await models.User.create(
        {
            username: 'ddavids',
            messages: [
                {
                    text: 'Happy to release ...',
                },
                {
                    text: 'Published a complete ...',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );
};
