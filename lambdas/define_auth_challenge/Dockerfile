FROM public.ecr.aws/lambda/nodejs:18.2023.05.19.01

# Copy function code
COPY index.js ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
