FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html

COPY .devops/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
