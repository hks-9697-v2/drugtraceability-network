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
import { DrugBatchService } from './DrugBatch.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-drugbatch',
  templateUrl: './DrugBatch.component.html',
  styleUrls: ['./DrugBatch.component.css'],
  providers: [DrugBatchService]
})
export class DrugBatchComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  batchno = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  drug_name = new FormControl('', Validators.required);
  drug_id = new FormControl('', Validators.required);
  expiry_date = new FormControl('', Validators.required);
  MRP = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  producer = new FormControl('', Validators.required);
  proposed_owner = new FormControl('', Validators.required);

  constructor(public serviceDrugBatch: DrugBatchService, fb: FormBuilder) {
    this.myForm = fb.group({
      batchno: this.batchno,
      description: this.description,
      drug_name: this.drug_name,
      drug_id: this.drug_id,
      expiry_date: this.expiry_date,
      MRP: this.MRP,
      owner: this.owner,
      producer: this.producer,
      proposed_owner: this.proposed_owner
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDrugBatch.getAll()
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
      $class: 'org.nitk.drugtraceability.DrugBatch',
      'batchno': this.batchno.value,
      'description': this.description.value,
      'drug_name': this.drug_name.value,
      'drug_id': this.drug_id.value,
      'expiry_date': this.expiry_date.value,
      'MRP': this.MRP.value,
      'owner': this.owner.value,
      'producer': this.producer.value,
      'proposed_owner': this.proposed_owner.value
    };

    this.myForm.setValue({
      'batchno': null,
      'description': null,
      'drug_name': null,
      'drug_id': null,
      'expiry_date': null,
      'MRP': null,
      'owner': null,
      'producer': null,
      'proposed_owner': null
    });

    return this.serviceDrugBatch.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'batchno': null,
        'description': null,
        'drug_name': null,
        'drug_id': null,
        'expiry_date': null,
        'MRP': null,
        'owner': null,
        'producer': null,
        'proposed_owner': null
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
      $class: 'org.nitk.drugtraceability.DrugBatch',
      'description': this.description.value,
      'drug_name': this.drug_name.value,
      'drug_id': this.drug_id.value,
      'expiry_date': this.expiry_date.value,
      'MRP': this.MRP.value,
      'owner': this.owner.value,
      'producer': this.producer.value,
      'proposed_owner': this.proposed_owner.value
    };

    return this.serviceDrugBatch.updateAsset(form.get('batchno').value, this.asset)
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

    return this.serviceDrugBatch.deleteAsset(this.currentId)
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

    return this.serviceDrugBatch.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'batchno': null,
        'description': null,
        'drug_name': null,
        'drug_id': null,
        'expiry_date': null,
        'MRP': null,
        'owner': null,
        'producer': null,
        'proposed_owner': null
      };

      if (result.batchno) {
        formObject.batchno = result.batchno;
      } else {
        formObject.batchno = null;
      }

      if (result.description) {
        formObject.description = result.description;
      } else {
        formObject.description = null;
      }

      if (result.drug_name) {
        formObject.drug_name = result.drug_name;
      } else {
        formObject.drug_name = null;
      }

      if (result.drug_id) {
        formObject.drug_id = result.drug_id;
      } else {
        formObject.drug_id = null;
      }

      if (result.expiry_date) {
        formObject.expiry_date = result.expiry_date;
      } else {
        formObject.expiry_date = null;
      }

      if (result.MRP) {
        formObject.MRP = result.MRP;
      } else {
        formObject.MRP = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.producer) {
        formObject.producer = result.producer;
      } else {
        formObject.producer = null;
      }

      if (result.proposed_owner) {
        formObject.proposed_owner = result.proposed_owner;
      } else {
        formObject.proposed_owner = null;
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
      'batchno': null,
      'description': null,
      'drug_name': null,
      'drug_id': null,
      'expiry_date': null,
      'MRP': null,
      'owner': null,
      'producer': null,
      'proposed_owner': null
      });
  }

}
