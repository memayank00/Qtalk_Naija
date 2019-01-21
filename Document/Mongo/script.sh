#!/bin/bash
MONGO_DATABASE="houseBuyer"
APP_NAME="HouseBuyersOfAmerica"
MONGO_USERNAME="houseBuyer"
MONGO_PASS="2Rtf_mSJdkfNj"

MONGO_HOST="housebuyersofamerica.com"
MONGO_PORT="27017"
TIMESTAMP=`date +%F-%H%M`
MONGODUMP_PATH="/usr/bin/mongodump"
BACKUPS_DIR="/home/ubuntu/backups/$APP_NAME"
BACKUP_NAME="$APP_NAME-$TIMESTAMP"

# mongo admin --eval "printjson(db.fsyncLock())"
# $MONGODUMP_PATH -h $MONGO_HOST:$MONGO_PORT -d $MONGO_DATABASE mongodump -d zenbrisa --gzip
$MONGODUMP_PATH -u $MONGO_USERNAME -p $MONGO_PASS  -d $MONGO_DATABASE
# mongo admin --eval "printjson(db.fsyncUnlock())"

mkdir -p $BACKUPS_DIR
mv dump $BACKUP_NAME
tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
rm -rf $BACKUP_NAME
find $BACKUPS_DIR -mtime +7 -type f -delete 
