// (C) 2020 GoodData Corporation
module.exports = (projectId: string) => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "amountMetric",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/1279",
                                },
                            },
                        },
                        alias: "Amount",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: [],
                    },
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                ],
                sorts: [] as any,
            },
        },
    };
};
