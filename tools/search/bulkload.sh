#! /bin/bash

# run this script from a screen instance:
# screen -m

# STEP 1
# sync harvested data to instance
# you may have to "sudo chown ubuntu /mnt/beast" before syncing

mkdir /mnt/beast/harvest
s3cmd sync s3://vnproject/data/staging/ /mnt/beast/harvest/

# STEP 2
# cat all part files into one big one.
# You need a header in the file:
cat ~/webapp/tools/search/header.tsv > /mnt/beast/parts
ls -R /mnt/beast/harvest/*/part* | xargs cat >> /mnt/beast/parts

# STEP 3
# deploy to app engine - this doesn't usually need to happen
# YOU PROBABLY DON'T NEED TO DO THIS STEP:
# appcfg.py update -V bulkloader .

# STEP 4
# upload Records to app engine 
# 'webapp/tools/search/' directory:
echo "$GAE_PASSWORD" | appcfg.py upload_data --log_file=bulk.log --rps_limit 2000 --bandwidth_limit 2000000 --batch_size=100 --num_threads=40 --config_file=/home/ubuntu/webapp/tools/search/bulkload.yaml --filename=/mnt/beast/parts --url=http://bulkloader.wip.vertnet-portal.appspot.com/_ah/remote_api --email $EMAIL --kind Record --passin

# if the bulkloading fails due to an incorrect number of fields or the like, make sure
# you have the latest version of this repo and that the header.tsv file is up to date

# STEP 5

# there is no step 5! We're using the search api to handling indexing now.

# MONITORING

# To check the progress of the upload, open the sql3 file that is created in
# the webapp/tools/search directory. It'll look something like 
# bulkloader-progress-20130402.230158.sql3

# run this to get the number of records already uploaded (replacing the .sql3 filename with the one you have):

# sqlite3 bulkloader-progress-20130402.230158.sql3
# sqlite> select max(key_end) from progress;
# 31010
