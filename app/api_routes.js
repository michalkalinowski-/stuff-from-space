module.exports = function(router, passport) {

    // DB Models
    var Bear = require('./models/bear');

    // Bear routes
    router.route('/api/bears')
        .post(function(req, res) {
            var bear = new Bear();
            bear.name = req.body.name;

            // save and check for errors
            bear.save(function(err){
                if (err) {
                    req.send(err);
                }
                res.json({message : 'Bear created!'});
            });
        })
        .get(function(req, res) {
            Bear.find(function(err, bears){
                if (err) {
                    req.send(err);
                }
                res.json(bears);
            });
        });

    // Single Bear routes
    router.route('/api/bears/:bear_id')
        .get(function(req, res) {
            Bear.findById(req.params.bear_id, function(err, bear) {
                if (err) {
                    req.send(err);
                }
                res.json(bear);
            });
        })
        .put(function(req, res) {
            Bear.findById(req.params.bear_id, function(err, bear) {

                if (err) {
                    req.send(err);
                }

                bear.name = req.body.name;

                // save and check for errors
                bear.save(function(err){
                    if (err) {
                        req.send(err);
                    }
                    res.json({message : 'Bear updated!'});
                });
            });
        })
        .delete(function(req, res) {
            Bear.remove({
                _id: req.params.bear_id
            }, function(err, bear){
                if(err) {
                    req.send(err);
                }
                res.json({message : 'Bear Deleted!'});
            });
        });

}