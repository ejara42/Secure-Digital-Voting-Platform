const eventBus = require("./eventBus");

eventBus.on("VOTE_CAST", async (event) => {
    console.log("📨 EVENT RECEIVED: VOTE_CAST");

    // Example future actions
    // await updateResults(event);
    // await writeAuditLog(event);
});
