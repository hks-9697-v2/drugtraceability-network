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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { DrugBatchComponent } from './DrugBatch/DrugBatch.component';
import { LicenseComponent } from './License/License.component';

import { TraderComponent } from './Trader/Trader.component';

import { TradeInitiateComponent } from './TradeInitiate/TradeInitiate.component';
import { TradeFinaliseComponent } from './TradeFinalise/TradeFinalise.component';
import { IssueLicenseComponent } from './IssueLicense/IssueLicense.component';
import { AddDrugComponent } from './AddDrug/AddDrug.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'DrugBatch', component: DrugBatchComponent },
  { path: 'License', component: LicenseComponent },
  { path: 'Trader', component: TraderComponent },
  { path: 'TradeInitiate', component: TradeInitiateComponent },
  { path: 'TradeFinalise', component: TradeFinaliseComponent },
  { path: 'IssueLicense', component: IssueLicenseComponent },
  { path: 'AddDrug', component: AddDrugComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
