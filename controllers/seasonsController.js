module.exports = {
    findAll: function(req, res) {
        console.log(req.query);
        res.json({ 'msg': 'Hello from MERN' });
    },
};