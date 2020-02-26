// (C) 2020 GoodData Corporation
module.exports = projectId => {
    return {
        executionResponse: {
            dimensions: [
                {
                    headers: [
                        {
                            measureGroupHeader: {
                                items: [
                                    {
                                        measureHeaderItem: {
                                            name: "_Close [BOP]",
                                            format: "#,##0.00",
                                            localIdentifier: "c2fa878519934f39aefe9325638f2beb",
                                            uri: "/gdc/md/" + projectId + "/obj/9211",
                                            identifier: "aaeb7jTCfexV",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "_Close [EOP]",
                                            format: "#,##0.00",
                                            localIdentifier: "8a1a34106a8a41c8b0a8da816600802e",
                                            uri: "/gdc/md/" + projectId + "/obj/9203",
                                            identifier: "aazb6kroa3iC",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "_Timeline [BOP]",
                                            format: "#,##0.00",
                                            localIdentifier: "3b4fc6113ff9452da677ef7842e2302c",
                                            uri: "/gdc/md/" + projectId + "/obj/1277",
                                            identifier: "aiTEuXhZaJw5",
                                        },
                                    },
                                    {
                                        measureHeaderItem: {
                                            name: "_Timeline [EOP]",
                                            format: "#,##0.00",
                                            localIdentifier: "26843260d95c4c9fa0aecc996ffd7829",
                                            uri: "/gdc/md/" + projectId + "/obj/1276",
                                            identifier: "ahUEuUVTefyt",
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
                            attributeHeader: {
                                name: "Department",
                                localIdentifier: "0e3388d37e444c369731afe398740572",
                                uri: "/gdc/md/" + projectId + "/obj/1027",
                                identifier: "label.owner.department",
                                formOf: {
                                    name: "Department",
                                    uri: "/gdc/md/" + projectId + "/obj/1026",
                                    identifier: "attr.owner.department",
                                },
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Region",
                                localIdentifier: "6af145960f4145efbe4ace7504b0f1de",
                                uri: "/gdc/md/" + projectId + "/obj/1024",
                                identifier: "label.owner.region",
                                formOf: {
                                    name: "Region",
                                    uri: "/gdc/md/" + projectId + "/obj/1023",
                                    identifier: "attr.owner.region",
                                },
                            },
                        },
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/jroecoqa7jywstxy1hxp8lwl2c4nc10t/executionResults/2601650277422562816?q=eAGtUtFOwjAU%2FRVTXhfbDcKUxJioaHhRQ%2BBpWUxZr1jSrrPtMhbCv3snwgORBzaSvrS995x7zrkb%0AYqEw1r9yDWRE5rmXXoEgAcmMKnXuyCjZEO69lYvSw6z5xbonKLj1GnKPla7Umtsan%2FEipCsUr5%2BN%0A1ROBT3QpMqoFXVkDmfnm8aqunF%2FX4de6uFGVirJBnoXMU7NY0ZBFMWIsuIOxggZ%2BPp20ABlS2LW7%0AeynuEPFX1fHcB1WtBh02sMZz1ViUpMH%2BpNvgH8OmsJQmx5aLmjW4hFn9U2YdZu5mVP%2BkUWlANOBm%0AZbst%2B8Sd4R5T6gW9Hrtm7NiufYofj8o4uEoe3t5TrNlhnB%2FibRSGpEnrbOJxV2LWP5N4JjUomXcX%0AHUZx3Jq7o27kHpItpm5N1UT%2Bl9yLNWVB0u0POyWCAQ%3D%3D%0A&c=66407e2f85895dae317f0215f069b848&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
