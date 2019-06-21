// (C) 2019 GoodData Corporation
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import * as classNames from "classnames";
import { getTranslation } from "../../utils/translations";

class UnsupportedProperties extends React.Component<InjectedIntlProps> {
    public render() {
        return (
            <div className={this.getClassNames()}>
                {getTranslation("properties.unsupported", this.props.intl)}
            </div>
        );
    }

    private getClassNames() {
        return classNames("adi-unsupported-configuration", "s-properties-unsupported");
    }
}

export default injectIntl(UnsupportedProperties);
