FROM node:20.11.1


WORKDIR /app 
COPY . /app 

RUN touch ./prisma/database/iard.db

RUN apt-get update || : && apt-get install python3 -y
RUN apt-get install -y python3-pip

RUN npm install
RUN pip install pdf2docx --break-system-packages
# RUN pip install pdf2docx 

RUN npm run db:generate
RUN npm run db:push

EXPOSE 3000 


CMD ["npm", "run", "dev"]