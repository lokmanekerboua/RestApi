const appErr = (message, statusCode) => {
    let error = new Error(message);
    error.statusCode = statusCode ? statusCode : 500;
    error.stack = error.stack;
    return error;
};

//nakhdmo bl function wela bl class kima nhebo 

//Err class
class AppErr extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode ? statusCode : 500;
        this.stack = this.stack;
        this.status = 'failed';
    }
}

module.exports = { appErr, AppErr };