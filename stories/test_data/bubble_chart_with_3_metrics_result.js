// (C) 2020 GoodData Corporation
module.exports = () => {
    return {
        executionResult: {
            data: [["4600", "3300"]],
            paging: {
                count: [1, 2],
                offset: [0, 0],
                total: [1, 2],
            },
            headerItems: [
                [],
                [
                    [
                        {
                            measureHeaderItem: {
                                name: "_Snapshot [EOP-2]",
                                order: 0,
                            },
                        },
                        {
                            measureHeaderItem: {
                                name: "# of Open Opps.",
                                order: 1,
                            },
                        },
                        {
                            measureHeaderItem: {
                                name: "Remaining Quota",
                                order: 2,
                            },
                        },
                    ],
                ],
            ],
        },
    };
};
