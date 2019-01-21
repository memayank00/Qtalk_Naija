#!/usr/bin/env bash
rsync -arvzP --delete --dry-run /home/flexsin/projects/housebuyersofamerica-backend/manager/build/ housebuyer@158.85.76.204:/home/housebuyer/public_html/admin