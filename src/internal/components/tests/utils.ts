// (C) 2007-2019 GoodData Corporation
function delay(timeout = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

export { delay };
