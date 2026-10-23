# tbblog

git fetch origin
git checkout claude/project-thread-mbovaq
git pull origin claude/project-thread-mbovaq


# db setup 
docker exec -it tbpgdb sh -c 'psql -U "$POSTGRES_USER" -d postgres'
CREATE USER tbblog WITH PASSWORD 'strapi2';
CREATE DATABASE tbblog OWNER tbblog;

# make keys
openssl rand -base64 32

