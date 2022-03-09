const express = require('express');
const mongoose = require('mongoose');
const WildersController = require('./controllers/Wilders');

const app = express();

function execAsyncHandler(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res, next);
        } catch (err) {
            console.log("Error caught by the higher order function");
            next(err);
        }
    }
}

mongoose.connect('mongodb://localhost:27017/wildapi2', {
    autoIndex: true
})
    .then(() => {
        console.log("Connected");
    })
    .catch(() => {
        console.log("Not connected");
    });

app.use(express.json());

// app.HTTP_VERB(endpoint, handler)
// GET, POST, PUT, DELETE
// mon app - quand je veux créer - sur mon API, mes wilders
// Routes REST: Verbe HTTP → action. Endpoint → aucune action. 
app.get('/api/wilders/', execAsyncHandler(WildersController.findAll));
app.get('/api/wilders/:id', execAsyncHandler(WildersController.findOne));
app.post('/api/wilders', execAsyncHandler(WildersController.create));
app.put('/api/wilders/:id', execAsyncHandler(WildersController.update));
app.patch('/api/wilders/:id', execAsyncHandler(WildersController.partialUpdate));
app.delete('/api/wilders/:id', execAsyncHandler(WildersController.delete));

// Handle 500 error
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Error occured, sorry' });
});

// Handle 404 not found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(4000, function () {
    console.log("Server started on port 4000!");
});

