"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

var tl = require('azure-pipelines-task-lib');
var shell = require('node-powershell');
var fs = require('fs');

const msRestAzure = require('ms-rest-azure');
const keyVaultClient = require('azure-keyvault');

try {
    var azureSubscriptionEndpoint = tl.getInput("azureSubscriptionEndpoint", true);
    
    var subcriptionId = tl.getEndpointDataParameter(azureSubscriptionEndpoint, "subscriptionId", false);
    var servicePrincipalId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalid", false);
    var servicePrincipalKey = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint, "serviceprincipalkey", false);
    var tenantId = tl.getEndpointAuthorizationParameter(azureSubscriptionEndpoint,"tenantid", false);

    var resourceGroupName = tl.getInput("resourceGroupName", true);
    var keyVault = tl.getInput("keyVaultName", true);
    var secretsFilePath = tl.getInput("secretsFilePath", true);
    
    console.log("Azure Subscription Id: " + subcriptionId);
    console.log("ServicePrincipalId: " + servicePrincipalId);
    console.log("ServicePrincipalKey: " + servicePrincipalKey);
    console.log("Tenant Id: " + tenantId);
    console.log("Resource Group: " + resourceGroupName);
    console.log("Key Vault: " + keyVault);
    console.log("Secret File Path: '" + secretsFilePath + "'");

    fs.access(secretsFilePath, fs.F_OK, (err) => {
        if(err){
            throw new Error('File not exists');
        } else {
            let client;
            msRestAzure.loginWithServicePrincipalSecret(servicePrincipalId, servicePrincipalKey)
                .then(creds => {
                    console.log('inside creds');
                    console.log(creds);
                    url = 'https://' + keyVault + '.vault.azure.net';
                    client = new keyVaultClient(creds, subcriptionId);
                    client.getSecrets(url, secrets => {
                        console.log('read secrets');
                    });
                })
                .catch(err=> {
                    console.log('In error');
                    console.dir(err, { depth: null, colors: true });
                    return err;
                });
        }
    });
} catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message || 'run() failed');
}