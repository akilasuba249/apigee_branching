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
