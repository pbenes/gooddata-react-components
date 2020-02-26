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
                                            name: "% Amount",
                                            format: "#,##0.00%",
                                            localIdentifier: "350381637b674c2eaa18d29ebf22c043",
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
                                name: "Product Name",
                                localIdentifier: "f4213833c9244f63858b52686044f7aa",
                                uri: "/gdc/md/" + projectId + "/obj/952",
                                identifier: "label.product.id.name",
                                formOf: {
                                    name: "Product",
                                    uri: "/gdc/md/" + projectId + "/obj/949",
                                    identifier: "attr.product.id",
                                },
                            },
                        },
                        {
                            attributeHeader: {
                                name: "Stage Name",
                                localIdentifier: "230215bcc2984abda7fefadac5379547",
                                uri: "/gdc/md/" + projectId + "/obj/1805",
                                identifier: "label.stage.name.stagename",
                                formOf: {
                                    name: "Stage Name",
                                    uri: "/gdc/md/" + projectId + "/obj/1095",
                                    identifier: "attr.stage.name",
                                },
                            },
                        },
                    ],
                },
            ],
            links: {
                executionResult:
                    "/gdc/app/projects/dfnkvzqa683mz1c29ijdkydrsodm8wjw/executionResults/3120108285852450304?q=eAGlks1uwjAQhF8FrdRbJAMlKIlUVT20FZeqassJ5eDEBjnEceqfRiHKu3cNhRZuNBdL3l2P5vNO%0AB5rXStsXKjkksKyssCVnEECuSicrA8mqA2qtFpmz%2FMN3ce5VK%2BZyi2PGSUl1izW8MGHqkrZPSssF%0AwxLZsJxIRti62n7tPuk8upW7ST6NRcG2LdNGMRk1RUNUVpA4nKJERg1%2FLLnklV2%2BLa7WmMWEH16b%0Ae8HuUHAPdGb5RPMPj7PYSypLS%2F8zqzTtg24Y9iQah4O5J%2BM4vAQfgOnl0JPBYECCfGt%2FOi2uXQey%0AzaHvL1JyMnZM07ulGz7aR%2FB3X%2BfFvz%2BeBiA5BjI%2FhPO44JvRg1SustDjgFaN7%2F4MPmvlakj7b3qN%0AAFM%3D%0A&c=37945a72c7a9c14958c50e93c54ca59f&offset=0%2C0&limit=1000%2C1000&dimensions=2&totals=0%2C0",
            },
        },
    };
};
