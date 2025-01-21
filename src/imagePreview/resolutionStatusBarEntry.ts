/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { PreviewStatusBarEntry as OwnedStatusBarEntry } from "../ownedStatusBarEntry";
import { ISize } from "../util/icns";

export const selectResolutionLevelCommandId = "_preview-icns.selectResolutionLevel";

export class ResolutionStatusBarEntry extends OwnedStatusBarEntry {
    private resolutions: Record<string, ISize> | null = null;

    private readonly _onDidChangeResolution = this._register(new vscode.EventEmitter<{ key: string }>());
    public readonly onDidChangeResolution = this._onDidChangeResolution.event;

    constructor() {
        super(
            "status.preview-icns.resolution",
            vscode.l10n.t("Image Resolution"),
            vscode.StatusBarAlignment.Right,
            101 /* to the left of editor status (100) */
        );
        this._register(
            vscode.commands.registerCommand(selectResolutionLevelCommandId, async () => {
                const options = (this.resolutions ? Object.keys(this.resolutions) : []).map(
                    (item): vscode.QuickPickItem => ({
                        label: item,
                    })
                );

                const pick = await vscode.window.showQuickPick(options, {
                    placeHolder: options.length === 0 ? vscode.l10n.t("Empty") : vscode.l10n.t("Select Resolution"),
                });

                if (pick) {
                    this._onDidChangeResolution.fire({ key: pick.label });
                }
            })
        );

        this.entry.command = selectResolutionLevelCommandId;
    }

    public show(owner: unknown, resolutions: Record<string, ISize>, key: string) {
        this.resolutions = resolutions;
        this.showItem(owner, resolutions[key] ? `${resolutions[key].width}x${resolutions[key].height}` : vscode.l10n.t("Empty"));
    }
}
