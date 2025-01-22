pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile'
        }
    }
    options {
        // Настройка volume для передачи данных
        dockerVolume('/var/jenkins_home/workspace:/workspace')
    }
    environment {
        ENV_NAME = "${params.ENV_NAME}"
        ENV_CATEGORY = "${params.ENV_CATEGORY}"
        SUIT = "${params.SUIT}"
        HEADLES_MODE = true
    }
    parameters {
        choice(name: 'ENV_NAME', choices: ['qa1', 'qa2', 'qa3'], description: 'Select environment name')
        choice(name: 'ENV_CATEGORY', choices: ['qa', 'study'], description: 'Select environment category')
        choice(name: 'SUIT', choices: ['smoke', 'regression'], description: 'Select test suite')
    }
    stages {
        stage('Print Parameters') {
            steps {
                echo "ENV_NAME: ${ENV_NAME}"
                echo "ENV_CATEGORY: ${ENV_CATEGORY}"
                echo "SUIT: ${SUIT}"
            }
        }
        stage('Verify Volume') {
            steps {
                script {
                    // Записываем тестовый файл в volume
                    sh 'echo "Testing volume" > /workspace/volume_test.txt'
                    // Проверяем содержимое volume
                    sh 'ls -l /workspace'
                }
            }
        }
        stage('Run Tests') {
            steps {
                sh "npx playwright test --project=chromium -g @${SUIT}"
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