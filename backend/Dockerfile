FROM node:20.10.0-bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies required for Google Chrome and add Google's signing key
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        wget \
        gnupg \
        fonts-liberation \
        lsb-release \
        xdg-utils \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libgdk-pixbuf2.0-0 \
        libnspr4 \
        libnss3 \
        libx11-6 \
        libxcomposite1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxrandr2 \
        libxss1 \
        libxtst6 \
        libgbm1 \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-signing-key.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/google-linux-signing-key.gpg arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Ensure chrome-sandbox is owned by root and has setuid so Chrome can use the sandbox inside containers
# RUN if [ -f /opt/google/chrome/chrome-sandbox ]; then \
#             chown root:root /opt/google/chrome/chrome-sandbox && \
#             chmod 4755 /opt/google/chrome/chrome-sandbox; \
#         fi

# Create app directory
WORKDIR /app

# NOTE: This image is intended as a runtime environment only.
# Do NOT copy source or install dependencies inside the image.
# Mount your project into /app at runtime and run `npm install` / `npm start` from the host or via `docker run`.

# Expose application port
EXPOSE 3000

# Default to an interactive shell so you can run commands inside the container
CMD ["bash"]
