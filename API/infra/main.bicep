@description('Virtual Pet API Bicep template')
param appName string = 'virtual-pet-api-${uniqueString(resourceGroup().id)}'

@description('Name of the Docker image, e.g. myrepo/myimage:tag')
param dockerImage string

@description('Region for deployment')
param location string = resourceGroup().location

resource plan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: 'free-linux-plan'
  location: location
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: appName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${dockerImage}'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
      ]
    }
    httpsOnly: true
  }
}

output appUrl string = 'https://${webApp.properties.defaultHostName}'
