// (C) 2007-2018 GoodData Corporation
import React, { Component } from 'react';
import { Treemap } from '@gooddata/react-components';

import '@gooddata/react-components/styles/css/main.css';

import { numberOfChecksIdentifier, menuCategoryAttributeDFIdentifier, locationCityDisplayFormIdentifier, projectId } from '../utils/fixtures';

export class TreeMapExample extends Component {
    onLoadingChanged(...params) {
        // eslint-disable-next-line no-console
        console.info('TreeMapExample onLoadingChanged', ...params);
    }

    onError(...params) {
        // eslint-disable-next-line no-console
        console.info('TreeMapExample onLoadingChanged', ...params);
    }

    render() {
        const numberOfChecks = {
            measure: {
                localIdentifier: 'numberOfChecks',
                definition: {
                    measureDefinition: {
                        item: {
                            identifier: numberOfChecksIdentifier
                        }
                    }
                },
                alias: '# Checks',
                format: '#,##0'
            }
        };

        const locationCity = {
            visualizationAttribute: {
                displayForm: {
                    identifier: locationCityDisplayFormIdentifier
                },
                localIdentifier: 'label.restaurantlocation.locationcity'
            }
        };

        const menuCategory = {
            visualizationAttribute: {
                displayForm: {
                    identifier: menuCategoryAttributeDFIdentifier
                },
                localIdentifier: 'menu_category'
            }
        };

        return (
            <div style={{ height: 300 }} className="s-tree-map">
                <Treemap
                    projectId={projectId}
                    measures={[numberOfChecks]}
                    viewBy={locationCity}
                    segmentBy={menuCategory}
                    onLoadingChanged={this.onLoadingChanged}
                    onError={this.onError}
                />
            </div>
        );
    }
}

export default TreeMapExample;
