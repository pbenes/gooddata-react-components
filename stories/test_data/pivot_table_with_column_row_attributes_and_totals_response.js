// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "Location State",
                                localIdentifier: "label.restaurantlocation.locationstate",
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
                                            name: "avg",
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Location Name",
                                localIdentifier: "label.restaurantlocation.locationname",
                                uri: "/gdc/md/" + projectId + "/obj/2205",
                                identifier: "label.restaurantlocation.locationname",
                                formOf: {
                                    name: "Location Name",
                                    uri: "/gdc/md/" + projectId + "/obj/2204",
                                    identifier: "attr.restaurantlocation.locationname",
                                },
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Menu Category",
                                localIdentifier: "label.menuitem.menucategory",
                                uri: "/gdc/md/" + projectId + "/obj/2188",
                                identifier: "label.menuitem.menucategory",
                                formOf: {
                                    name: "Menu Category",
                                    uri: "/gdc/md/" + projectId + "/obj/2187",
                                    identifier: "attr.menuitem.menucategory",
                                },
                            },
                        },
                    ],
                },
                {
                    headers: [
                        {
                            attributeHeader: {
                                name: "default (Date)",
                                localIdentifier: "date.aam81lMifn6q",
                                uri: "/gdc/md/" + projectId + "/obj/2011",
                                identifier: "date.aam81lMifn6q",
                                formOf: {
                                    name: "Quarter (Date)",
                                    uri: "/gdc/md/" + projectId + "/obj/2009",
                                    identifier: "date.quarter.in.year",
                                },
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Short (Jan) (Date)",
                                localIdentifier: "date.abm81lMifn6q",
                                uri: "/gdc/md/" + projectId + "/obj/2073",
                                identifier: "date.abm81lMifn6q",
                                formOf: {
                                    name: "Month (Date)",
                                    uri: "/gdc/md/" + projectId + "/obj/2071",
                                    identifier: "date.month.in.year",
                                },
                            },
                        },
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            name: "$ Franchise Fees",
                                            format: "[>=0]$#,##0;[<0]-$#,##0",
                                            localIdentifier: "aaEGaXAEgB7U",
                                            uri: "/gdc/md/" + projectId + "/obj/6685",
                                            identifier: "aaEGaXAEgB7U",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "$ Franchise Fees (Ad Royalty)",
                                            format: "[>=0]$#,##0;[<0]-$#,##0",
                                            localIdentifier: "aabHeqImaK0d",
                                            uri: "/gdc/md/" + projectId + "/obj/6694",
                                            identifier: "aabHeqImaK0d",
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
                    "/gdc/app/projects/xms7ga4tf3g3nzucd8380o2bev8oeknp/executionResults/7619392577204124672?q=eAGtVdtum0AQ%2FRW0zoMrOWK5JOC0aWXVdRSpqeSkeUI8rGFCqGEXLUsSN%2FK%2Fd9YU0uKqkg1ve5md%0AOTPnzOwrkVAIqb6xHMgFuecqVRnEZEIikVU5L8lF8EritCwytlkImV%2FHaGYmcWTmsfmSl17CXPXg%0AJA7%2FWUWx7%2FhU2Ct48gWseWGK1Q%2FTppaF%2FlashC8Z5MDV%2Fe314U7o1IT6efkpjS%2FRI1NKpqtKwTGY%0A6BQ9xDLNsrl45ncKilnjbr44GJ3l6BRLLCQ%2BLdZ6XeU5kxvcXgEHmUbGsmJSgTTGS%2Bt06b77M4Hv%0Auuho2prMmQJtsWPjnxdCsUyTE4STIAy3k94keQ7G60uSZw1KkqerOhxJro3u%2Fk%2FSjeDqEa1abTXU%0A7C6McZeY7nGXFpIDijS6kqIqSDj5va276gHbiWnBBB8vaXgymoxG9H3wgYan9VqDbVWEm0YMJ8ZC%0AMh49piUYC4ASr%2Booh%2FfB%2Bbl%2FRrR4hsJijGexcSs2LFMbLeDjgU1dssWCSfFcV2uPka8iYioV3LhT%0A2C3dYvUbWfYQI8u2aLcbGgr3sLfZHc6hjXG0OlrpadXgAXtKUHHBbjfEhLDpGXrtOSFs6nZr0it1%0A6iKmLOXr2fHT2%2FFt7eWvXmtBNf3fMrb7Kd%2Bace%2B8paEdzHu%2BboBXxmcUbSLwh%2BhE7idcy%2Ff7k2T5%0AXpekRrhd6G1uR%2BgWwyDWN93WBQu3vwBtX9KY%0A&c=f77205b1127f82f904da129be8166699&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=2%2C0",
            },
        },
    };
};
