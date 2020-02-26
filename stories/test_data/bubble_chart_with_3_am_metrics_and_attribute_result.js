// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResult: {
            data: [
                ["100", "300", "200"],
                ["200", "500", "300"],
                ["300", "700", "400"],
                ["150", "400", "250"],
                ["10", "30", "20"],
                ["20", "80", "60"],
            ],
            paging: {
                count: [6, 3],
                offset: [0, 0],
                total: [6, 3],
            },
            headerItems: [
                [
                    [
                        {
                            attributeHeaderItem: {
                                name: "Adam Bradley",
                                uri: "/gdc/md/" + projectId + "/obj/1025/elements?id=1224",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Alejandro Vabiano",
                                uri: "/gdc/md/" + projectId + "/obj/1025/elements?id=1227",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Alexsandr Fyodr",
                                uri: "/gdc/md/" + projectId + "/obj/1025/elements?id=1228",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Cory Owens",
                                uri: "/gdc/md/" + projectId + "/obj/1025/elements?id=1229",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Dale Perdadtin",
                                uri: "/gdc/md/" + projectId + "/obj/1025/elements?id=1230",
                            },
                        },
                        {
                            attributeHeaderItem: {
                                name: "Dave Bostadt",
                                uri: "/gdc/md/" + projectId + "/obj/1025/elements?id=1231",
                            },
                        },
                    ],
                ],
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "M1",
                                order: 0,
                            },
                        },
                        {
                            measureHeaderItem: {
                                name: "M2",
                                order: 2,
                            },
                        },
                        {
                            measureHeaderItem: {
                                name: "M1 + M2",
                                order: 1,
                            },
                        },
                    ],
                ],
            ],
        },
    };
};
