FROM nginx:stable-alpine
ARG target=production
ENV target ${target}
COPY ./dist /usr/share/nginx/html
COPY nginx.${target}.conf /etc/nginx/conf.d/default.conf
