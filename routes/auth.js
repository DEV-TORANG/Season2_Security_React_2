const router = require("./users");

const user = require('../routes/users');
const {authenticate} = require('../routes/jwt');

router.route('/user').get( authenticate, user.userLogin);

module.exports = router