pipeline {
    agent { dockerfile { filename 'Dockerfile' } }
    environment {
        ENV_NAME = "${params.ENV_NAME}"
        ENV_CATEGORY = "${params.ENV_CATEGORY}"
        SUIT = "${params.SUIT}"
        HEADLES_MODE = true
    }
    parameters {
        choice(name: 'ENV_NAME', choices: ['aqa', 'qa106', 'qa1', 'qa2', 'qa3', 'qa4', 'qa5', 'qa6', 'qa7', 'qa8', 'qa101', 'qa102', 'qa103', 'qa104', 'qa105', 'qa107', 'study'], description: 'Select the environment name')
        choice(name: 'ENV_CATEGORY', choices: ['aqa', 'qa', 'study'], description: 'Select the environment category')
        choice(name: 'SUIT', choices: ['finance', 'package9', 'package24', 'package60', 'package54', 'smoke', 'regression', 'new'], description: 'Select the test suite')
    }

    stages {
        stage('Print Parameters') {
            steps {
                script {
                    echo "Selected Parameters:"
                    echo "ENV_NAME: ${ENV_NAME}"
                    echo "ENV_CATEGORY: ${ENV_CATEGORY}"
                    echo "SUIT: ${SUIT}"
                }
            }
        }
        stage('Run Tests') {
            steps {
                // Проверка окружения перед запуском тестов
                sh 'node -v && npm -v'
                sh 'pwd && ls -l'
                // Запуск тестов Playwright
                sh "npx playwright test --project=chromium -g @${SUIT}"
            }
        }
        stage('Publish Report') {
            steps {
                // Сохранение отчёта о тестах
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
