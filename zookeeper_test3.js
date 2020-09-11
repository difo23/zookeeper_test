//No funciona ni entiendo que hace.
 
zk_r.on_connected().
then (
    function (zkk){
        console.log ("reader on_connected: zk=%j", zkk);
        return zkk.create ("/node.js2", "some value", ZK.ZOO_SEQUENCE | ZK.ZOO_EPHEMERAL);
    }
).then (
    function (path) {
        zk_r.context.path = path;
        console.log ("node created path=%s", path);
        return zk_r.w_get (path,
            function (type, state, path_w) { // this is a watcher 
                console.log ("watcher for path %s triggered", path_w);
                deferred_watcher_triggered.resolve (path_w);
            }
        );
    }
).then (
    function (stat_and_value) { // this is the response from w_get above 
        console.log ("get node: stat=%j, value=%s", stat_and_value[0], stat_and_value[1]);
        deferred_watcher_ready.resolve (zk_r.context.path);
        return deferred_watcher_triggered;
    }
).then (
    function () {
        console.log ("zk_reader is finished");
        process.nextTick( function () {
            zk_r.close ();
        });
    }
);