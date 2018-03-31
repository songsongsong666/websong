

module.exports = function (app) {
  var db = require("./../model/models.server");
  require("./services/user.service.server")(app);
  require("./services/website.service.server")(app);
  require("./services/page.service.server")(app);
  require("./services/widget.service.server")(app);

};

