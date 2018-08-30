pipeline {
    agent none
    stages {
        stage('NPM Test') {
            agent any
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS 10.4.0') {
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'npm test'
                }
            }
        }
        stage('Build Container & Push to ACR') {
            agent any
            steps {
                script {
                    docker.withRegistry("${env.DOCKER_REGISTRY_URL}", 'docker_registry_credentials') {
                    def customImage = docker.build("lpg-management-ui:${env.BUILD_ID}")
                    customImage.push()
                    }
                }
            }
        }
        stage('Deploy to Integration?') {
            agent none
            steps {
                script {
                    def deployToStaging = input(message: 'Deploy to Staging?', ok: 'Yes',
                    parameters: [booleanParam(defaultValue: true,
                    description: 'Press the button to deploy',name: 'Yes?')])
                    echo "Deploy to Staging:" + deployToStaging
                }
            }
        }
        stage('Deploy to Integration') {
            agent any
            steps {
                script {
                    def tfHome = tool name: 'Terraform', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'
                    env.PATH = "${tfHome}:${env.PATH}"
                }
                withCredentials([
                    string(credentialsId: 'SECURE_FILES', variable: 'SF'),
                    usernamePassword(credentialsId: 'docker_registry_credentials', usernameVariable: 'acr_username', passwordVariable: 'acr_password')
                    ]) {
                    cleanWs()
                    sh "git clone https://github.com/Civil-Service-Human-Resources/lpg-terraform-paas.git -b acrmodules --single-branch"
                    dir("lpg-terraform-paas/environments/master") {
                        sh "ln -s ${SF}/azure/cabinet-azure/00-integration/state.tf state.tf"
                        sh "ln -s ${SF}/azure/cabinet-azure/00-integration/integration-vars.tf integration-vars.tf"
                        sh "ln -s ../00-integration/00-vars.tf 00-vars.tf"
                        sh "terraform --version"
                        sh "terraform init"
                        sh "terraform validate"
                        sh "terraform plan -target=module.lpg-management2 -var 'lpg_management2_tag=${env.BUILD_ID}' -var 'docker_registry_server_username=${acr_username}' -var 'docker_registry_server_password=${acr_password}'"
                        sh "terraform apply -target=module.lpg-management2 -var 'lpg_management2_tag=${env.BUILD_ID}' -var 'docker_registry_server_username=${acr_username}' -var 'docker_registry_server_password=${acr_password}' -auto-approve"
                    }
                }
            }
        }
        stage('Deploy to Staging?') {
            agent none
            steps {
                script {
                    /* def deployToStaging = input(message: 'Deploy to Staging?', ok: 'Yes',
                    parameters: [booleanParam(defaultValue: true,
                    description: 'Press the button to deploy',name: 'Yes?')])
                    echo "Deploy to Staging:" + deployToStaging
                    */
                    echo 'skipping staging step'
                }
            }
        }
        stage('Deploy to Staging') {
            agent any
            steps {
                /* script {
                    def tfHome = tool name: 'Terraform', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'
                    env.PATH = "${tfHome}:${env.PATH}"
                }
                withCredentials([
                    string(credentialsId: 'SECURE_FILES', variable: 'SF'),
                    usernamePassword(credentialsId: 'docker_registry_credentials', usernameVariable: 'acr_username', passwordVariable: 'acr_password')
                    ]) {
                    cleanWs()
                    sh "git clone https://github.com/Civil-Service-Human-Resources/lpg-terraform-paas.git -b acrmodules --single-branch"
                    dir("lpg-terraform-paas/environments/master") {
                        sh "ln -s ${SF}/azure/cabinet-azure/00-staging/state.tf state.tf"
                        sh "ln -s ${SF}/azure/cabinet-azure/00-staging/integration-vars.tf integration-vars.tf"
                        sh "ln -s ../00-staging/00-vars.tf 00-vars.tf"
                        sh "terraform --version"
                        sh "terraform init"
                        sh "terraform validate"
                        sh "terraform plan -target=module.lpg-management2 -var 'lpg_management2_tag=${env.BUILD_ID}' -var 'docker_registry_server_username=${acr_username}' -var 'docker_registry_server_password=${acr_password}'"
                        sh "terraform apply -target=module.lpg-management2 -var 'lpg_management2_tag=${env.BUILD_ID}' -var 'docker_registry_server_username=${acr_username}' -var 'docker_registry_server_password=${acr_password}' -auto-approve"
                    }
                } */
                script {
                    echo 'skipping staging step'
                }
            }
        }
        stage('Deploy to Production?') {
            agent none
            steps {
                script {
                    /* def deployToStaging = input(message: 'Deploy to Production?', ok: 'Yes',
                    parameters: [booleanParam(defaultValue: true,
                    description: 'Press the button to deploy',name: 'Yes?')])
                    echo "Deploy to Staging:" + deployToStaging
                    */
                    echo 'skipping production step'
                }
            }
        }
        stage('Deploy to Production') {
            agent any
            steps {
                /* script {
                    def tfHome = tool name: 'Terraform', type: 'com.cloudbees.jenkins.plugins.customtools.CustomTool'
                    env.PATH = "${tfHome}:${env.PATH}"
                }
                withCredentials([
                    string(credentialsId: 'SECURE_FILES', variable: 'SF'),
                    usernamePassword(credentialsId: 'docker_registry_credentials', usernameVariable: 'acr_username', passwordVariable: 'acr_password')
                    ]) {
                    cleanWs()
                    sh "git clone https://github.com/Civil-Service-Human-Resources/lpg-terraform-paas.git -b acrmodules --single-branch"
                    dir("lpg-terraform-paas/environments/master") {
                        sh "ln -s ${SF}/azure/cabinet-azure/00-production/state.tf state.tf"
                        sh "ln -s ${SF}/azure/cabinet-azure/00-production/integration-vars.tf integration-vars.tf"
                        sh "ln -s ../00-production/00-vars.tf 00-vars.tf"
                        sh "terraform --version"
                        sh "terraform init"
                        sh "terraform validate"
                        sh "terraform plan -target=module.lpg-management2 -var 'lpg_management2_tag=${env.BUILD_ID}' -var 'docker_registry_server_username=${acr_username}' -var 'docker_registry_server_password=${acr_password}'"
                        sh "terraform apply -target=module.lpg-management2 -var 'lpg_management2_tag=${env.BUILD_ID}' -var 'docker_registry_server_username=${acr_username}' -var 'docker_registry_server_password=${acr_password}' -auto-approve"
                    }
                } */
                script {
                    echo 'skipping production step'
                }
            }
        }
    }
}