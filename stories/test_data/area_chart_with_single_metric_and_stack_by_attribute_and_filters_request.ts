// (C) 2020 GoodData Corporation
module.exports = (projectId: string) => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "7096e0a6c19c49479a1da524e2f97aac",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/14636",
                                },
                            },
                        },
                        alias: "# of Activities",
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/1252",
                        },
                        localIdentifier: "17cb5f5555c54da782a4dc8c27fcfb78",
                    },
                ],
                filters: [
                    {
                        positiveAttributeFilter: {
                            displayForm: {
                                uri: "/gdc/md/" + projectId + "/obj/1252",
                            },
                            in: ["/gdc/md/" + projectId + "/obj/1251/elements?id=169663"],
                        },
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["17cb5f5555c54da782a4dc8c27fcfb78"],
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
