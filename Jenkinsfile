pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile'
            // args '--user root'
            
        }
    }
    environment {
        ENV_NAME = "${params.ENV_NAME}"
        ENV_CATEGORY = "${params.ENV_CATEGORY}"
        SUIT = "${params.SUIT}"
        PRINT_API_REQUEST = "${params.PRINT_API_REQUEST}"
        PRINT_API_RESPONSE = "${params.PRINT_API_RESPONSE}"
        HEADLES_MODE = true
    }
    parameters {
        choice(name: 'PROJECT', choices: ['chromium', 'firefox', 'webkit'], description: 'Select browser')
        choice(name: 'ENV_NAME', choices: ['aqa', 'qa106', 'qa1', 'qa2', 'qa3', 'qa4', 'qa5', 'qa6', 'qa7', 'qa8', 'qa101', 'qa102', 'qa103', 'qa104', 'qa105', 'qa107', 'study'], description: 'Select environment')
        choice(name: 'ENV_CATEGORY', choices: ['aqa', 'qa', 'study'], description: 'Select environment')
        choice(name: 'SUIT', choices: ['finance', 'package9', 'package24', 'package60', 'package54', 'smoke', 'regression'], description: 'Select test suite')
        choice(name: 'PRINT_API_REQUEST', choices: ['false', 'true'], description: 'Print API requests logs')
        choice(name: 'PRINT_API_RESPONSE', choices: ['false', 'true'], description: 'Print API responses logs')
    }
    stages {
        stage('Print Parameters') {
            steps {
                echo "PROJECT: ${params.PROJECT}"  
                echo "ENV_NAME: ${params.ENV_NAME}"  
                echo "ENV_CATEGORY: ${params.ENV_CATEGORY}" 
                echo "SUIT: ${params.SUIT}" 
            }
        }
        stage('Run Tests') {
            steps {
                sh "npx playwright test --project=${params.PROJECT} -g @${params.SUIT}"  
            }
        }
        stage('Publish Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report'
                ])
            }
        }
    }
}