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
import { LicenseService } from './License.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-license',
  templateUrl: './License.component.html',
  styleUrls: ['./License.component.css'],
  providers: [LicenseService]
})
export class LicenseComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  licenseno = new FormControl('', Validators.required);
  products_allowed = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  expiry_date = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);

  constructor(public serviceLicense: LicenseService, fb: FormBuilder) {
    this.myForm = fb.group({
      licenseno: this.licenseno,
      products_allowed: this.products_allowed,
      type: this.type,
      expiry_date: this.expiry_date,
      owner: this.owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceLicense.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.nitk.drugtraceability.License',
      'licenseno': this.licenseno.value,
      'products_allowed': this.products_allowed.value,
      'type': this.type.value,
      'expiry_date': this.expiry_date.value,
      'owner': this.owner.value
    };

    this.myForm.setValue({
      'licenseno': null,
      'products_allowed': null,
      'type': null,
      'expiry_date': null,
      'owner': null
    });

    return this.serviceLicense.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'licenseno': null,
        'products_allowed': null,
        'type': null,
        'expiry_date': null,
        'owner': null
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


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.nitk.drugtraceability.License',
      'products_allowed': this.products_allowed.value,
      'type': this.type.value,
      'expiry_date': this.expiry_date.value,
      'owner': this.owner.value
    };

    return this.serviceLicense.updateAsset(form.get('licenseno').value, this.asset)
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


  deleteAsset(): Promise<any> {

    return this.serviceLicense.deleteAsset(this.currentId)
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

    return this.serviceLicense.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'licenseno': null,
        'products_allowed': null,
        'type': null,
        'expiry_date': null,
        'owner': null
      };

      if (result.licenseno) {
        formObject.licenseno = result.licenseno;
      } else {
        formObject.licenseno = null;
      }

      if (result.products_allowed) {
        formObject.products_allowed = result.products_allowed;
      } else {
        formObject.products_allowed = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.expiry_date) {
        formObject.expiry_date = result.expiry_date;
      } else {
        formObject.expiry_date = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
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
      'licenseno': null,
      'products_allowed': null,
      'type': null,
      'expiry_date': null,
      'owner': null
      });
  }

}
