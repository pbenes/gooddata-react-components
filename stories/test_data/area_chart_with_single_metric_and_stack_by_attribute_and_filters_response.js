// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "Activity Type",
                                localIdentifier: "17cb5f5555c54da782a4dc8c27fcfb78",
                                uri: "/gdc/md/" + projectId + "/obj/1252",
                                identifier: "label.activity.activitytype",
                                formOf: {
                                    name: "Activity Type",
                                    uri: "/gdc/md/" + projectId + "/obj/1251",
                                    identifier: "attr.activity.activitytype",
                                },
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
                                            name: "# of Activities",
                                            format: "#,##0",
                                            localIdentifier: "7096e0a6c19c49479a1da524e2f97aac",
                                            uri: "/gdc/md/" + projectId + "/obj/14636",
                                            identifier: "acKjadJIgZUN",
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
                    "/gdc/app/projects/tce1r94inbj8t5z9dxnlojzrudpvybmf/executionResults/2476035763170541056?q=eAGdkDFrwzAQhf%2BKkVeDajcOTSCUDm3J0qEkU%2FAgW%2BciI1lGOqVVgv97z3UoJVsz3j3eu%2B%2FdmTkY%0ArMM3YYCt2b5HhRoky1hjdTC9Z%2BsDM4BONa%2FOhoFV2WWclDNrrTMCyZlmaXpHNh%2BMES7ShoafsElM%0AbJs8NaiOChV4UubIrSSRf8iGG8mxgdytFqqvuwcsTyv51WvbnVyQwzHWpuW27ni%2BWN4v2UgUzn7O%0ACAKJrg4IuwmdAi%2BHYrKLA1wjSeUHLeILcd9wvSgLCqyFh2cNBnrcv2%2F%2FXaEocw6z3T8qufnzqGv0%0A3243seZTskWhp0cdqmqsxm%2FELqkW%0A&c=188a8d8b4d02ebc879dc21cf3371a692&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
