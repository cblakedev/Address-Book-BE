require('colors');
var path = require('path');
var express = require('express');
var data = require(path.join(__dirname, 'data/people.json'));

var app = express();

// Allow access to the APIs from every url.
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use('/mockup/', express.static(path.join(__dirname, 'mockup')));

app.get('/api/people', function(req, res) {
    const name = req.query.name;

    if (name) {
        // Find contact whose name includes the query string (case-insensitive)
        const matchingPeople = data.people
            .filter(contact => contact.name.toLowerCase().includes(name.toLowerCase()))
            .map(contact => {
                return {
                    id: contact.id,
                    name: contact.name
                };
            });

        if (matchingPeople.length > 0) {
            // Return the matching contact if found
            res.json(matchingPeople);
        } else {
            // Return a 404 error if no matching people are found
            res.status(404).json({ message: 'No match found with the given name.' });
        }
    } else {
        // If no name is provided, return the entire list
        res.json(data.people.map(contact => {
            return {
                id: contact.id,
                name: contact.name
            };
        }));
    }
});

app.get('/api/people/profile', function(req, res) {
    const id = req.query.id;

    if (!id) {
        // Return an error message if no id is provided
        res.status(400).json({ message: 'Error: Contact ID is required.' });
        return; // Stop further execution
    }

    // Find the contact with the matching id
    const contact = data.people.find(contact => contact.id === parseInt(id));

    if (contact) {
        // Return the contact if found
        res.json(contact);
    } else {
        // Return a 404 error if no contact is found with that id
        res.status(404).json({ message: 'Contact not found' });
    }
});

var HTTP_PORT = 8080;

app.listen(HTTP_PORT, function(err) {
    if (err) {
        throw err;
    }

    console.log(('HTTP server listening on port ' + HTTP_PORT).green);

    console.log('Mockup:'.bold + ' http://localhost:' + HTTP_PORT + '/mockup/');
    console.log('People data:'.bold + ' http://localhost:' + HTTP_PORT + '/api/people');
});