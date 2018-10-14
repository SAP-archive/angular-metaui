/**
 *
 * @license
 * Copyright 2017 SAP Ariba
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 */
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Environment, isBlank} from '@aribaui/core';
import {BaseComponent} from '../../../../core/base.component';


/**
 *
 * Simple Table action button with dimension 40x40 pixes and icons in the middle. Also supports
 * badge numbers in the top right corner
 *
 *
 */
@Component({
    selector: 'aw-dt-button',
    templateUrl: 'action-button.component.html',
    styleUrls: ['action-button.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DTActionButtonComponent extends BaseComponent
{

    @Input()
    icon: string;

    @Input()
    isActive: boolean = false;

    /**
     * We need to support also a badge number in the top right corder
     */
    @Input()
    badgetNumber: number = 0;

    /**
     * Clic Action
     */
    @Output()
    onAction: EventEmitter<any> = new EventEmitter();

    constructor(public env: Environment)
    {
        super(env);
    }


    ngOnInit(): void
    {
        super.ngOnInit();

        this.icon = 'icon-show';
        if (isBlank(this.icon)) {
            throw new Error('This icon button. Icon is required !');
        }

        this.styleClass = this.icon;
    }


    /**
     *
     * Broadcast click event outside of this component
     */
    onButtonClick(event: any): void
    {
        this.onAction.emit(event);
        if (this.isActive) {
            this.styleClass = this.icon + ' u-dt-btn-active-bg';
        } else {
            this.styleClass = this.icon;
        }
    }

}

