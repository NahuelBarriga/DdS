@description('Name of the container app environment')
param envName string = 'virtual-pet-env'

@description('Name of the container app')
param appName string = 'virtual-pet-api'

@description('Container image to deploy, e.g. myrepo/myimage:tag')
param dockerImage string

@description('Location for deployment')
param location string = resourceGroup().location

resource containerEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: envName
  location: location
  properties: {
    daprAIInstrumentationKey: ''
  }
}

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: appName
  location: location
  properties: {
    managedEnvironmentId: containerEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000 // change to your app's exposed port
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: 'api'
          image: dockerImage
        }
      ]
    }
  }
}

output appUrl string = 'https://${containerApp.name}.${location}.azurecontainerapps.io'
