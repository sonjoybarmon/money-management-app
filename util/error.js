module.exports = {
    serverError (res , error) {
        console.log(error);
        res.status(500).json({
            message : "Server Error Occurred",
        })
    },

    resourcedError (res , message) {
        res.status(400).json({
            message 
        })
    }
}