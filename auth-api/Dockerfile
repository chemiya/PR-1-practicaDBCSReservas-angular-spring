FROM openjdk:18-jdk-alpine3.14
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY target/users-0.0.1-SNAPSHOT.jar users.jar
EXPOSE 8080
ENTRYPOINT exec java $JAVA_OPTS -jar users.jar
# For Spring-Boot project, use the entrypoint below to reduce Tomcat startup time.
#ENTRYPOINT exec java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar users.jar
