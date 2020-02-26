// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [
                [null, "2773426.95", "8656468.2", "29140409.09", "60270072.2", "15785080.1"],
                ["2773426.95", "8656468.2", "29140409.09", "60270072.2", "15785080.1", null],
            ],
            paging: {
                count: [2, 6],
                offset: [0, 0],
                total: [2, 6],
            },
            headerItems: [
                [],
                [
                    [
                        {
                            attributeHeaderItem: {
                                name: "2008",
                                uri: "/gdc/md/" + projectId + "/obj/158/elements?id=2008",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2009",
                                uri: "/gdc/md/" + projectId + "/obj/158/elements?id=2009",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2010",
                                uri: "/gdc/md/" + projectId + "/obj/158/elements?id=2010",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2011",
                                uri: "/gdc/md/" + projectId + "/obj/158/elements?id=2011",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2012",
                                uri: "/gdc/md/" + projectId + "/obj/158/elements?id=2012",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "2013",
                                uri: "/gdc/md/" + projectId + "/obj/158/elements?id=2013",
                            },
                        },
                    ],
                ],
            ],
        },
    };
};
