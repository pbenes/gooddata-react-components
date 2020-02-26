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
                                            name: "Amount",
                                            format: "#,##0.00",
                                            localIdentifier: "amountMetric",
                                            uri: "/gdc/md/" + projectId + "/obj/1279",
                                            identifier: "ah1EuQxwaCqs",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    headers: [],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/d20eyb3wfs0xe5l0lfscdnrnyhq1t42q/executionResults/7362656840808922112?q=eAFdj71uwzAMhF9FoFcjUtwWRb11Krp0CzIUGRSLdhToJyFlpIbhd6%2FUGAjQ7cjjxyNnILxESl%2Fa%0AI7SwC8kmhwZq6KIbfdhbk04M7fehht66hLQWFG%2Br4oxDO6%2FAP3vJWCSv8wQMZB%2BLyxx4TGS7D4rj%0ABXLAvSzO%2FKCquqrURql8Eo%2Fea5ryqneRtYi90M4Jg9pxLQgHTcYhczE46QFFpCLSyJuM%2F71WYB%2FH%0AkHLjnvdpck8OppPeSNMonI5Pt57VD7445XruTKAwna7b9NxcZTye5bZ5fYPlsPwCToVqBQ%3D%3D%0A&c=c25b0cad21527dac7c716ca03cf432a2&dimension=Amount&dimension=x",
            },
        },
    };
};
