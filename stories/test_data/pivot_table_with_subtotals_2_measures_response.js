// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "Region",
                                localIdentifier: "a1",
                                uri: "/gdc/md/" + projectId + "/obj/1024",
                                identifier: "label.owner.region",
                                formOf: {
                                    name: "Region",
                                    uri: "/gdc/md/" + projectId + "/obj/1023",
                                    identifier: "attr.owner.region",
                                },
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Department",
                                localIdentifier: "a2",
                                uri: "/gdc/md/" + projectId + "/obj/1027",
                                identifier: "label.owner.department",
                                formOf: {
                                    name: "Department",
                                    uri: "/gdc/md/" + projectId + "/obj/1026",
                                    identifier: "attr.owner.department",
                                },
                                totalItems: [
                                    { totalHeaderItem: { name: "sum" } },
                                    { totalHeaderItem: { name: "max" } },
                                ],
                            },
                        },
                    ],
                },
                {
                    headers: [
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            name: "Sum of Amount",
                                            format: "#,##0.00",
                                            localIdentifier: "m1",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "Sum of Probability",
                                            format: "#,##0.00",
                                            localIdentifier: "m2",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/storybook/executionResults/6329905506215001088?q=eAGtkl9LwzAUxb%2FKSF%2BLaVftcCAi%2BIe9iEz3VPqQNmmJJk1Nb9jK6Hf3xrniHgQpe7w3Oeee%2B%2BPu%0AiRWtsfDMtCBLsmlAghKchKQ0yummI8uMaAFWlk%2FWuJbk4U%2FpX%2FakMlYzQGUQBkF0EUWo%2FLbA1qvT%0AM1PN7rRxDZAh%2FNfvF2sKVkgloScDDrNme5jEAEMUDsSbT4j2a1FL0%2BC8zmnNbI8tLLjsWsX6R8y1%0A4tiiNS%2Bp5pRJV7emTqUFubhqPq6TzzLe8hjmW5Xsqo6a4p3G0fwSPQrWiQcltGhgs15NMEmoOMi7%0AW8lvfiEZM4%2FbTAqZeEsDTHk0WR5mee7xjqZHRPeiZRb8Hig4K6bFOTClf2E6yT1uNQlVeoLKQ8AT%0AxpNmO4LQ8uELu2kAaw%3D%3D%0A&c=813b669f5e7a78007a7478390479ab13&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
