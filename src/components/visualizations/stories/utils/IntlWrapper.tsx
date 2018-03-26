// (C) 2007-2018 GoodData Corporation
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

import translations from '../../mock-translations/en';

export default class IntlWrap extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    render() {
        return (
            <IntlProvider
                locale="en"
                messages={translations}
            >
                {this.props.children}
            </IntlProvider>
        );
    }
}
