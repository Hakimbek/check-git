FROM group-docker.wolterskluwer.io/node:16-bullseye-slim

ARG productName="csn"
ENV WORKDIR=/${productName}
ENV USER="${productName}User"
ENV GROUP="${productName}Group"
ENV USER_UID=1024

RUN apt-get update \
    && apt-get upgrade --assume-yes \
    && npm -g i npm@"<9" && sync

RUN groupadd --gid 1024 ${GROUP} \
      && useradd --uid 1024 --gid ${GROUP} --shell /bin/bash --create-home --home-dir ${WORKDIR} ${USER}

USER ${USER}
WORKDIR ${WORKDIR}

COPY --chown=${USER_UID} ./ ./

RUN mkdir node_modules && npm install --production --legacy-peer-deps

RUN rm ./.npmrc

CMD npm start -- --env=${env}
