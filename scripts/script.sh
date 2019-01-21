createBuild(){
    cd ../manager
    # to make react build
    # react-scripts build
     npm run build
    # rename static folder name to www
    mv build/static build/www
    # replace word static from following files with www
    sed -i 's/static/www/g' build/index.html
    sed -i 's/static\//www\//g' build/www/js/main.*.js
    sed -i 's/static\//www\//g' build/www/css/main.*.css
    sed -i 's/static\//www\//g' build/service-worker
}

# createDir(){
#     cd ../manager/
#     mkdir test
# }

createBuild