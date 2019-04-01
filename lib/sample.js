'use strict';
var NS = 'org.nitk.drugtraceability';

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

/**
 * Initiate a transaction from one trader to another
 * @param {org.nitk.drugtraceability.TradeInitiate} tradeInitiate - the tradeInitaite to be processed
 * @transaction
 */
function tradeCommodityInitiate(tradeInitiate) {
    tradeInitiate.commodity.proposed_owner = tradeInitiate.newOwner;
    tradeInitiate.newOwner.transactions_initiated.push(tradeInitiate.commodity);
    return getAssetRegistry(NS + '.DrugBatch')
        .then(function (assetRegistry) {
            return assetRegistry.update(tradeInitiate.commodity);
        }).then(function(){
        	return getParticipantRegistry(NS + '.Trader').then(function(memberRegistry) {
        return memberRegistry.update(tradeInitiate.newOwner);
      });
        });
}



/**
 * Finalise a transaction from one trader to another
 * @param {org.nitk.drugtraceability.TradeFinalise} tradeFinalise - the tradeFinalise to be processed
 * @transaction
 */
function tradeCommodityFinalise(tradeFinalise) {
	var oldOwner=tradeFinalise.commodity.owner;
	for( var i = 0; i < oldOwner.products_owned.length; i++){ 
   		if ( oldOwner.products_owned[i].batchno === tradeFinalise.commodity.batchno) {
     		oldOwner.products_owned.splice(i, 1); 
   		}
	}
    tradeFinalise.commodity.owner = tradeFinalise.newOwner;
    tradeFinalise.newOwner.products_owned.push(tradeFinalise.commodity);
    for( var i = 0; i < tradeFinalise.newOwner.transactions_initiated.length; i++){ 
   		if ( tradeFinalise.newOwner.transactions_initiated[i].batchno === tradeFinalise.commodity.batchno) {
    		 tradeFinalise.newOwner.transactions_initiated.splice(i, 1); 
   		}
	}
    return getAssetRegistry(NS + '.DrugBatch')
        .then(function (assetRegistry) {
            return assetRegistry.update(tradeFinalise.commodity);
        }).then(
        function(){
        	return getParticipantRegistry(NS + '.Trader').then(function(memberRegistry) {
        		return memberRegistry.update(tradeFinalise.newOwner);})
        }).then(
        function(){
        	return getParticipantRegistry(NS + '.Trader').then(function(memberRegistry) {
        		return memberRegistry.update(oldOwner);})
        });
}

/**
 * Issues License to a trader
 * @param {org.nitk.drugtraceability.IssueLicense} issueLicense - the issueLicense to be processed
 * @transaction
 */

function licenseIssuer(newlicense) {
    var issuedlicense = getFactory().newResource(NS, 'License', newlicense.licenseno);
    var trader = newlicense.applicant;
    issuedlicense.type = newlicense.type;
    issuedlicense.expiry_date = newlicense.expiry_date
    issuedlicense.owner = trader;
    issuedlicense.products_allowed=[];
    for( var i = 0; i < newlicense.products_allowed.length; i++){ 
        issuedlicense.products_allowed.push(newlicense.products_allowed[i]); 
    }
    if(trader.license.length<1)
    {
        trader.license=[];
        trader.license.push(issuedlicense);
    }
    else{
        trader.license[0]=issuedlicense;
    }
    trader.access = issuedlicense.type;

    return getParticipantRegistry(NS + '.Trader').then(function(memberRegistry){
        return memberRegistry.update(trader);
    }).then(function(){
        return getAssetRegistry(NS + '.License')
    }).then(function(licenseregistry){
        return licenseregistry.add(issuedlicense);
    })
}

/**
 * Add new Drug
 * @param {org.nitk.drugtraceability.AddDrug} addDrug - new product addition
 * @transaction
 */
function addDrug(newproduct) {
    var product = getFactory().newResource(NS, 'DrugBatch', newproduct.batchno);
    var trader=newproduct.producer;
    if(!trader.license[0].products_allowed.includes(newproduct.drug_id))
    {
        throw new Error('Not licensed to produce this drug.');
    }
    product.description = newproduct.description;
    product.drug_name = newproduct.drug_name
    product.drug_id = newproduct.drug_id
    product.expiry_date = newproduct.expiry_date
    product.MRP = newproduct.MRP
    product.owner = newproduct.producer;
    product.producer = newproduct.producer;
    product.proposed_owner = newproduct.producer;
    newproduct.producer.products_owned.push(product);
    return getAssetRegistry(NS + '.DrugBatch').then(function(registry) {
      return registry.add(product);
    }).then(function() {
      return getParticipantRegistry(NS + '.Trader');
    }).then(function(Registry) {
      return Registry.update(newproduct.producer);
    });
  }
