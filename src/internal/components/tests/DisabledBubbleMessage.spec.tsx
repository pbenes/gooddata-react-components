// (C) 2019 GoodData Corporation
import * as React from "react";
import { mount } from "enzyme";

import DisabledBubbleMessage from "../DisabledBubbleMessage";
import { InternalIntlWrapper } from '../../utils/internalIntlProvider';

function createComponent(showDisabledMessage: boolean = true) {
    return mount(
        <InternalIntlWrapper>
            <DisabledBubbleMessage showDisabledMessage={showDisabledMessage}>
                <div className={"bubble-trigger"}>{"Foo"}</div>
            </DisabledBubbleMessage>
        </InternalIntlWrapper>
    );
}

describe("DisabledBubbleMessage", () => {
    it("should create Bubble component without invisible class by default", () => {
        const wrapper = createComponent();
        expect(wrapper.find(".bubble-primary.invisible").length).toBe(0);
    });

    it("should create Bubble component with invisible class", () => {
        const wrapper = createComponent(false);
        expect(wrapper.find(".bubble-primary.invisible").length).toBe(1);
    });
});
