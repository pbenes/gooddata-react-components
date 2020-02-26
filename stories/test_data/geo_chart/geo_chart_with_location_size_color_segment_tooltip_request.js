// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        execution: {
            afm: {
                measures: [
                    {
                        localIdentifier: "size",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/20",
                                },
                            },
                        },
                    },
                    {
                        localIdentifier: "color",
                        definition: {
                            measure: {
                                item: {
                                    uri: "/gdc/md/" + projectId + "/obj/21",
                                },
                            },
                        },
                    },
                ],
                attributes: [
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/30.df",
                        },
                        localIdentifier: "location",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/23.df",
                        },
                        localIdentifier: "segmentBy",
                    },
                    {
                        displayForm: {
                            uri: "/gdc/md/" + projectId + "/obj/24.df",
                        },
                        localIdentifier: "tooltip",
                    },
                ],
            },
            resultSpec: {
                dimensions: [
                    {
                        itemIdentifiers: ["measureGroup"],
                    },
                    {
                        itemIdentifiers: ["location", "segmentBy", "tooltip"],
                    },
                ],
            },
        },
    };
};
