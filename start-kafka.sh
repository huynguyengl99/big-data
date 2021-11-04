#!/bin/bash -e
sleep 20
exec "/kafka/bin/kafka-server-start.sh" "/kafka/config/server.properties"