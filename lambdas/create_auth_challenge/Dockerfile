FROM public.ecr.aws/lambda/nodejs:18.2023.05.19.01

#Copy files
COPY index.js ${LAMBDA_TASK_ROOT}
COPY package.json ${LAMBDA_TASK_ROOT}

RUN npm install

CMD [ "index.handler" ]
