// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "Menu Category",
                                localIdentifier: "a1",
                                uri: "/gdc/md/" + projectId + "/obj/2188",
                                identifier: "label.menuitem.menucategory",
                                formOf: {
                                    name: "Menu Category",
                                    uri: "/gdc/md/" + projectId + "/obj/2187",
                                    identifier: "attr.menuitem.menucategory",
                                },
                                totalItems: [
                                    {
                                        totalHeaderItem: {
                                            name: "min",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Restaurant Category",
                                localIdentifier: "a2",
                                uri: "/gdc/md/" + projectId + "/obj/2197",
                                identifier: "label.restaurantprofile.restaurantcategory",
                                formOf: {
                                    name: "Restaurant Category",
                                    uri: "/gdc/md/" + projectId + "/obj/2196",
                                    identifier: "attr.restaurantprofile.restaurantcategory",
                                },
                                totalItems: [
                                    {
                                        totalHeaderItem: {
                                            name: "sum",
                                        },
                                    },
                                    {
                                        totalHeaderItem: {
                                            name: "max",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Location State",
                                localIdentifier: "a3",
                                uri: "/gdc/md/" + projectId + "/obj/2211",
                                identifier: "label.restaurantlocation.locationstate",
                                formOf: {
                                    name: "Location State",
                                    uri: "/gdc/md/" + projectId + "/obj/2210",
                                    identifier: "attr.restaurantlocation.locationstate",
                                },
                                totalItems: [
                                    {
                                        totalHeaderItem: {
                                            name: "sum",
                                        },
                                    },
                                    {
                                        totalHeaderItem: {
                                            name: "max",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Year (Date)",
                                localIdentifier: "a4",
                                uri: "/gdc/md/" + projectId + "/obj/2005",
                                identifier: "date.aag81lMifn6q",
                                formOf: {
                                    name: "Year (Date)",
                                    uri: "/gdc/md/" + projectId + "/obj/2003",
                                    identifier: "date.year",
                                },
                                totalItems: [],
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Location Name",
                                localIdentifier: "a5",
                                uri: "/gdc/md/" + projectId + "/obj/2205",
                                identifier: "label.restaurantlocation.locationname",
                                formOf: {
                                    name: "Location Name",
                                    uri: "/gdc/md/" + projectId + "/obj/2204",
                                    identifier: "attr.restaurantlocation.locationname",
                                },
                                totalItems: [
                                    {
                                        totalHeaderItem: {
                                            name: "avg",
                                        },
                                    },
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
                                            name: "$ Total Sales",
                                            format: "[>=0]$#,##0;[<0]-$#,##0",
                                            localIdentifier: "m1",
                                            uri: "/gdc/md/" + projectId + "/obj/2352",
                                            identifier: "aa7ulGyKhIE5",
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
                    "/gdc/app/projects/storybook/executionResults/1061054995817037696?q=eAG1lV1P2zAUhv9K5HLBpExxEqApH5umdUxI2y4oXExVLtzkEGX1R2Q7fFX97zumaxgtnUYNd%2FZx%0AfPye57VPZkRDo7T9wQSQQ3IpbW05lCQkheKtkIYcjokAq%2Bviq1ZtQ%2FLwz9StzMiV0oJZ3Dn%2BcELz%0AnV7Y69Gj8THN3y%2FGmMi0QjB9h9%2Fg5CE9DneCC2UZD0aMg8H44oizEpeiqiwiUUa3wvQrtmev0iqV%0A921RZmlGVTKB60zBVDaRmvyKknQ%2FIXMUpdXNQhGzKHbSWrhwlWC%2B7yDb4DOzUClUsaKnrE3D2d0p%0AlrHF4XGWYcIJM%2FCFgwBpL8%2FPXlxBnPUjWGw3H%2Bvy5C9Kq9K72rbS2neZHXUHaux8IXk%2BD2ekS7tE%0Adg7GslYzad8K3MCJ8QU3ONgE7vkCujq3wTc4WMcXEnZdYViw200ov6mC2VrJYGTxCuK3T56D3%2FVL%0A4tifYhLTTRTXtPsAxHP%2BB6AfEUr3%2FYlQmq4S8Skc06GmUtecD9WNHFloPi171PD05e0idaYb7Nm4%0AtZm6cddgfwLTGOjULt%2Bziwe7Q7yA73B52YNXok87w%2FrV9nMmeQ1nErr3ms5gOsTBazn1MCTNEpfl%0A0YTnDOhe0sN%2F9tGCtfg%2FTcjnvwH5I4rT%0A&c=a01ba6524840529659cf4f8156bff180&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=1%2C0",
            },
        },
    };
};
