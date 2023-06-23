FROM public.ecr.aws/lambda/nodejs:18.2023.05.19.01

# Copy files
COPY index.js ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
