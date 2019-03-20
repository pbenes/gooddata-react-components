// (C) 2007-2019 GoodData Corporation
import * as React from "react";
import { IColorItem } from "@gooddata/gooddata-js";
import * as classNames from "classnames";
import ColorPaletteItem from "./ColorPaletteItem";

const MAX_SMALL_PALETTE_SIZE = 20;

export interface IColorPaletteProps {
    selectedColorGuid?: string;
    colorPalette: any;
    onColorSelected: (color: IColorItem) => void;
}

export default class ColorPalette extends React.PureComponent<IColorPaletteProps> {
    public render() {
        return <div className={this.getClassNames()}>{this.renderItems()}</div>;
    }

    private getClassNames() {
        const isColorPaletteLarge = this.isColorPaletteLarge();
        return classNames(
            {
                "gd-color-drop-down-list-large": isColorPaletteLarge,
                "gd-color-drop-down-list": !isColorPaletteLarge,
            },
            "s-color-drop-down-list",
        );
    }

    private renderItems() {
        return this.props.colorPalette.map((item: any) => {
            return (
                <ColorPaletteItem
                    selected={this.isItemSelected(item.guid)}
                    key={item.guid}
                    paletteItem={item}
                    onColorSelected={this.onColorSelected}
                />
            );
        });
    }

    private isColorPaletteLarge() {
        return this.props.colorPalette.length > MAX_SMALL_PALETTE_SIZE;
    }

    private isItemSelected(guid: string) {
        return this.props.selectedColorGuid === guid;
    }

    private onColorSelected = (color: IColorItem) => {
        this.props.onColorSelected(color);
    };
}
