#!groovy

pipeline {
    agent any
    tools {
        maven 'Maven'
        nodejs 'Nodejs'
    }

    stages {
        stage('Initial-Checks') {
            steps {
                sh "npm -v"
                sh "mvn -v"
        }}  
        stage('Policy-Code Analysis') {
            steps {
                sh "npm install -g apigeelint"
                sh "apigeelint -s iciciproxy/apiproxy/ -f codeframe.js"
                sh "apigeelint -s security/sharedflowbundle/ -f codeframe.js"

            }
        }
        stage('cobertura-coverage-test') {
            steps {
                script {
                    try {
                       sh "npm install request-promise"
                        sh "npm install"
                        sh "npm test test/unit/*.js"
                        sh "npm run coverage"
                    } catch (e) {
                        throw e
                    } finally {
                        sh "cd coverage && cp cobertura-coverage.xml $WORKSPACE"
                        step([$class: 'CoberturaPublisher', coberturaReportFile: 'cobertura-coverage.xml'])
                    }
                }
            }
        }

        stage('Approval for UAT') {
            steps {
                script {
                    def approval = input message: 'Approve to deploy in UAT', ok: 'Approve'
                    echo "Approval: ${approval}"
                }
            }
        }
        stage('SharedFlow deployment to UAT') {
            steps {
                 // service account key from  credentials 
                withCredentials([file(credentialsId: 'sailorgcp', variable: 'MY_FILE')]) {
                    echo 'My file path: $MY_FILE'
                    //deploy using maven plugin and replace email and orgs value 
                    sh "mvn -f ./security/pom.xml install -Puat -Dorg=sailor-321711 -Dsafile=$MY_FILE -Demail=apigeetest@sailor-321711.iam.gserviceaccount.com"
                }
            }
        }
        stage('Deploy to UAT') {
            steps {
                 // service account key from  credentials 
                withCredentials([file(credentialsId: 'sailorgcp', variable: 'MY_FILE')]) {
                    echo 'My file path: $MY_FILE'
                    //deploy using maven plugin and replace email and orgs value 
                    sh "mvn -f ./iciciproxy/pom.xml install -Puat -Dorg=sailor-321711 -Dsafile=$MY_FILE -Demail=apigeetest@sailor-321711.iam.gserviceaccount.com"
                }
            }
        }
        stage('Approval for production') {
            steps {
                script {
                    def approval = input message: 'Approve to deploy in production', ok: 'Approve'
                    echo "Approval: ${approval}"
                }
            }
        }
        stage('Create Pull Request') {
            steps {
                script {
                    def githubApiUrl = "https://api.github.com/repos/akilasuba249/apigee_branching/pulls"
                    def pullRequestBody = """
                    {
                        "title": "UAT to Production PR",
                        "head": "main",
                        "base": "prod"
                    }
                    """

                    httpRequest(
                        acceptType: 'APPLICATION_JSON',
                        contentType: 'APPLICATION_JSON',
                        httpMode: 'POST',
                        url: githubApiUrl,
                        authentication: 'gitpost',
                        requestBody: pullRequestBody
                    )
                }
            }
        }

        stage('SharedFlow deployment to PROD') {
            steps {
                 // service account key from  credentials 
                withCredentials([file(credentialsId: 'sailorgcp', variable: 'MY_FILE')]) {
                    echo 'My file path: $MY_FILE'
                    //deploy using maven plugin and replace email and orgs value 
                    sh "mvn -f ./security/pom.xml install -Puat -Dorg=sailor-321711 -Dsafile=$MY_FILE -Demail=apigeetest@sailor-321711.iam.gserviceaccount.com"
                }
            }
        }
        stage('Deploy to PROD') {
            steps {
                 // service account key from  credentials 
                withCredentials([file(credentialsId: 'sailorgcp', variable: 'MY_FILE')]) {
                    echo 'My file path: $MY_FILE'
                    //deploy using maven plugin and replace email and orgs value 
                    sh "mvn -f ./iciciproxy/pom.xml install -Puat -Dorg=sailor-321711 -Dsafile=$MY_FILE -Demail=apigeetest@sailor-321711.iam.gserviceaccount.com"
                }
            }
        }
        
    }
}
