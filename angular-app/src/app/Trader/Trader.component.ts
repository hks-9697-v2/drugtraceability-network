/*
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
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TraderService } from './Trader.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-trader',
  templateUrl: './Trader.component.html',
  styleUrls: ['./Trader.component.css'],
  providers: [TraderService]
})
export class TraderComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  tradeId = new FormControl('', Validators.required);
  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  access = new FormControl('', Validators.required);
  products_owned = new FormControl('', Validators.required);
  transactions_initiated = new FormControl('', Validators.required);
  license = new FormControl('', Validators.required);


  constructor(public serviceTrader: TraderService, fb: FormBuilder) {
    this.myForm = fb.group({
      tradeId: this.tradeId,
      firstName: this.firstName,
      lastName: this.lastName,
      access: this.access,
      products_owned: this.products_owned,
      transactions_initiated: this.transactions_initiated,
      license: this.license
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceTrader.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.nitk.drugtraceability.Trader',
      'tradeId': this.tradeId.value,
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'access': this.access.value,
      'products_owned': this.products_owned.value,
      'transactions_initiated': this.transactions_initiated.value,
      'license': this.license.value
    };

    this.myForm.setValue({
      'tradeId': null,
      'firstName': null,
      'lastName': null,
      'access': null,
      'products_owned': null,
      'transactions_initiated': null,
      'license': null
    });

    return this.serviceTrader.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'tradeId': null,
        'firstName': null,
        'lastName': null,
        'access': null,
        'products_owned': null,
        'transactions_initiated': null,
        'license': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.nitk.drugtraceability.Trader',
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'access': this.access.value,
      'products_owned': this.products_owned.value,
      'transactions_initiated': this.transactions_initiated.value,
      'license': this.license.value
    };

    return this.serviceTrader.updateParticipant(form.get('tradeId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceTrader.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceTrader.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'tradeId': null,
        'firstName': null,
        'lastName': null,
        'access': null,
        'products_owned': null,
        'transactions_initiated': null,
        'license': null
      };

      if (result.tradeId) {
        formObject.tradeId = result.tradeId;
      } else {
        formObject.tradeId = null;
      }

      if (result.firstName) {
        formObject.firstName = result.firstName;
      } else {
        formObject.firstName = null;
      }

      if (result.lastName) {
        formObject.lastName = result.lastName;
      } else {
        formObject.lastName = null;
      }

      if (result.access) {
        formObject.access = result.access;
      } else {
        formObject.access = null;
      }

      if (result.products_owned) {
        formObject.products_owned = result.products_owned;
      } else {
        formObject.products_owned = null;
      }

      if (result.transactions_initiated) {
        formObject.transactions_initiated = result.transactions_initiated;
      } else {
        formObject.transactions_initiated = null;
      }

      if (result.license) {
        formObject.license = result.license;
      } else {
        formObject.license = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'tradeId': null,
      'firstName': null,
      'lastName': null,
      'access': null,
      'products_owned': null,
      'transactions_initiated': null,
      'license': null
    });
  }
}
