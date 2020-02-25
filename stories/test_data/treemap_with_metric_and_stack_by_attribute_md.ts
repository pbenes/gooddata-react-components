module.exports = (projectId: string) => { 
 return {
    "buckets": [
        {
            "localIdentifier": "measures",
            "items": [
                {
                    "localIdentifier": "amountMetric",
                    "title": "Amount",
                    "definition": {
                        "measureDefinition": {
                            "item": {
                                "uri": "/gdc/md/" + projectId + "/obj/1279"
                            }
                        }
                    }
                }
            ]
        },
        {
            "localIdentifier": "segment",
            "items": [
                {
                    "visualizationAttribute": {
                        "displayForm": {
                            "uri": "/gdc/md/" + projectId + "/obj/1027"
                        },
                        "localIdentifier": "departmentAttribute"
                    }
                }
            ]
        }
    ]
}
;
 };