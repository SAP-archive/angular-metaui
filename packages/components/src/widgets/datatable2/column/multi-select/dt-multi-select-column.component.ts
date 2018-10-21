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
import {Component, ViewEncapsulation} from '@angular/core';
import {Environment} from '@aribaui/core';
import {DTColumn2Component} from '../dt-column.component';
import {DomUtilsService} from '../../../../core/dom-utils.service';


/**
 *
 * Column implementation for the Multiselection where we show checkbox control
 *
 *
 */
@Component({
    selector: 'aw-dt-multi-select-column',
    templateUrl: 'dt-multi-select-column.component.html',
    styleUrls: ['dt-multi-select-column.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class DTMultiSelectColumnComponent extends DTColumn2Component
{

    constructor(public env: Environment, public domUtils: DomUtilsService)
    {
        super(env, domUtils);

        // default width of the selection control
        this.width = '45px';
    }

}

