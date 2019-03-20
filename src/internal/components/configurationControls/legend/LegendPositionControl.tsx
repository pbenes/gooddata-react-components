// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { InjectedIntl } from "react-intl";

import DropdownControl from "../DropdownControl";
import { legendPositionDropdownItems } from "../../../constants/dropdowns";
import { getTranslatedDropdownItems } from "../../../utils/translations";
import { IVisualizationProperties } from "../../../interfaces/Visualization";

export interface ILegendPositionControl {
    disabled: boolean;
    value: string;
    showDisabledMessage: boolean;
    intl: InjectedIntl;
    properties: IVisualizationProperties;
    pushData: (data: any) => any;
}

export default class LegendPositionControl extends React.PureComponent<ILegendPositionControl, {}> {
    public render() {
        return (
            <DropdownControl
                value={this.props.value}
                valuePath="legend.position"
                labelText="properties.legend.position"
                intl={this.props.intl}
                disabled={this.props.disabled}
                properties={this.props.properties}
                pushData={this.props.pushData}
                items={this.generateDropdownItems()}
                showDisabledMessage={this.props.showDisabledMessage}
            />
        );
    }

    private generateDropdownItems() {
        return getTranslatedDropdownItems(legendPositionDropdownItems, this.props.intl);
    }
}
