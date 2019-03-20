import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.nitk.drugtraceability{
   export enum TraderType {
      END_CUSTOMER,
      PRODUCER,
      DISTRIBUTOR,
   }
   export enum LicenseType {
      PRODUCER,
      DISTRIBUTOR,
   }
   export class DrugBatch extends Asset {
      batchno: string;
      description: string;
      drug_name: string;
      drug_id: number;
      expiry_date: string;
      MRP: number;
      owner: Trader;
      producer: Trader;
      proposed_owner: Trader;
   }
   export class License extends Asset {
      licenseno: string;
      products_allowed: number[];
      type: LicenseType;
      expiry_date: string;
      owner: Trader;
   }
   export class Trader extends Participant {
      tradeId: string;
      firstName: string;
      lastName: string;
      access: TraderType;
      products_owned: DrugBatch[];
      transactions_initiated: DrugBatch[];
      license: License[];
   }
   export class TradeInitiate extends Transaction {
      commodity: DrugBatch;
      newOwner: Trader;
   }
   export class TradeFinalise extends Transaction {
      commodity: DrugBatch;
      newOwner: Trader;
   }
   export class IssueLicense extends Transaction {
      licenseno: string;
      products_allowed: number[];
      type: LicenseType;
      expiry_date: string;
      applicant: Trader;
   }
   export class AddDrug extends Transaction {
      batchno: string;
      description: string;
      drug_name: string;
      drug_id: number;
      expiry_date: string;
      MRP: number;
      producer: Trader;
   }
// }
