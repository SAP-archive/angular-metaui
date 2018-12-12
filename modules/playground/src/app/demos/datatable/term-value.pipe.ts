import {Pipe, PipeTransform} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {ItemTerm} from './datatable.page.component';

@Pipe({name: 'termValue'})
export class TermValuePipe implements PipeTransform
{
    constructor()
    {
    }

    transform(value: ItemTerm, ...args: any[]): SafeHtml
    {
        if (value && value.value) {

            let newValue = '';
            switch (value.valueTypeName) {
                case 'Money':
                    let money = value.value.moneyValue;
                    newValue = `${money.amount} ${money.currency}`;
                    break;
                case 'Quantity':
                    let qty = value.value.quantityValue;
                    newValue = `${qty.amount} ${qty.unitOfMeasureName}`;
                    break;
                case 'MoneyDifference':
                    let diff = value.value.moneyDifferenceValue;
                    let mWithCurrency = `${diff.difference.amount} ${diff.difference.currency}`;
                    newValue = `${mWithCurrency}  (${diff.percentage}%)`;
                    break;
                case 'Percentage':
                    let perc = value.value.bigDecimalValue;
                    newValue = `${perc || 0} %)`;
                    break;
                case 'MultilineFreeText':
                    newValue = value.value.simpleValue || '';
                    break;
                case 'ShortText':
                    if (value.value.simpleValue && Array.isArray(value.value.simpleValue))
                    {
                        newValue = value.value.simpleValue[0];
                    } else if (value.value.simpleValue) {
                        newValue = value.value.simpleValue || '';
                    }
                    break;
                case 'Date':
                    if (value.value.dateValue) {
                        let d = new Date(value.value.dateValue);
                        newValue = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}}`;
                    } else {
                        newValue = '';
                    }
                    break;
                case 'Address':
                    newValue = '';
                    break;
                case 'Text':
                    newValue = '';
                    break;
                case 'YesNo':

                    newValue = (value.value && !!value.value.simpleValue) ? 'Yes' : 'No';
                    break;
                default:
                    newValue = 'N/A';
            }
            return newValue;

        } else if (args && args.length === 1) {
            return args[0].title;
        } else {
            return '';
        }
    }
}
