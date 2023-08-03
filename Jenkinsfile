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
          when {
                expression {
                    return env.BRANCH_NAME == "main"
                }
            }
            steps {
                sh "npm install -g apigeelint"
                sh "apigeelint -s iciciproxy/apiproxy/ -f codeframe.js"
                sh "apigeelint -s security/sharedflowbundle/ -f codeframe.js"

            }
        }
        stage('cobertura-coverage-test') {
           when {
                expression {
                    return env.BRANCH_NAME == "main"
                }
            }
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
        stage('SharedFlow deployment to UAT') {
            when {
                expression {
                    return env.BRANCH_NAME == "main"
                }
            }
            steps {
                withCredentials([file(credentialsId: 'sailorgcp', variable: 'MY_FILE')]) {
                    echo 'My file path: $MY_FILE'
                    sh "mvn -f ./security/pom.xml install -Puat -Dorg=sailor-321711 -Dsafile=$MY_FILE -Demail=apigeetest@sailor-321711.iam.gserviceaccount.com"
                }
            }
        }

        stage('Deploy to UAT') {
            when {
                expression {
                    return env.BRANCH_NAME == "main"
                }
            }
            steps {
                withCredentials([file(credentialsId: 'sailorgcp', variable: 'MY_FILE')]) {
                    echo 'My file path: $MY_FILE'
                    sh "mvn -f ./iciciproxy/pom.xml install -Puat -Dorg=sailor-321711 -Dsafile=$MY_FILE -Demail=apigeetest@sailor-321711.iam.gserviceaccount.com"
                }
            }
        }

        stage('Create Pull Request') {
            when {
                expression {
                    return env.BRANCH_NAME == "main"
                }
            }
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
                        authentication: 'gitsecret',
                        requestBody: pullRequestBody
                    )
                }
            }
        }

        stage('SharedFlow deployment to PROD') {
            when {
                expression {
                    return env.BRANCH_NAME == "prod"
                }
            }
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
            when {
                expression {
                    return env.BRANCH_NAME == "prod"
                }
            }
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
