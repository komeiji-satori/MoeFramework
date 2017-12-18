const Koa = require('koa');
const config = require('./config');
const fs = require('fs');
const app = new Koa();

app.use(async(ctx, next) => {
    let path = ctx.request.path.split("/");
    url_router = [];
    path.forEach((value, index) => {
        if (value) {
            url_router.push(value)
        }
    })
    let action = url_router[0];
    let method = url_router[1];
    let controller_path = './Controller/' + action;
    if (fs.existsSync(controller_path + ".js")) {
        let controller = require(controller_path);
        if (typeof(controller[method]) == "undefined") {
            ctx.response.body = JSON.stringify({ staus: 404, message: "Method Not Found" });
            return;
        }
        //console.log(ctx.request.method + " " + ctx.request.url);
        ctx.response.body = Function.prototype.apply.call(controller[method], undefined, [ctx, config]);
    } else {
        ctx.response.body = JSON.stringify({ staus: 404, message: "Action Not Found" });
    }

});
console.log("Listening Port: " + config.http_port)
app.listen(config.http_port);