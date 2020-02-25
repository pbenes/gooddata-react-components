module.exports = (projectId: string) => { 
 return {
    "execution": {
        "afm": {
            "attributes": [
                {
                    "displayForm": {
                        "uri": "/gdc/md/" + projectId + "/obj/30.df"
                    },
                    "localIdentifier": "location"
                }
            ]
        },
        "resultSpec": {
            "dimensions": [
                {
                    "itemIdentifiers": ["location"]
                }
            ]
        }
    }
}
;
 };